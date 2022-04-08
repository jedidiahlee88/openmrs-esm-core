import { start, unregisterApplication, getAppNames } from "single-spa";
import {
  setupApiModule,
  renderLoadingSpinner,
  createAppState,
  Config,
  provide,
  showNotification,
  showToast,
  renderInlineNotifications,
  renderToasts,
  integrateBreakpoints,
  dispatchConnectivityChanged,
  subscribeNotificationShown,
  subscribeToastShown,
  registerOmrsServiceWorker,
  messageOmrsServiceWorker,
  subscribeConnectivity,
  getCurrentUser,
  renderModals,
  dispatchPrecacheStaticDependencies,
  activateOfflineCapability,
  subscribePrecacheStaticDependencies,
  openmrsFetch,
} from "@openmrs/esm-framework/src/internal";
import {
  finishRegisteringAllApps,
  registerApp,
  tryRegisterExtension,
} from "./apps";
import { setupI18n } from "./locale";
import { sharedDependencies } from "./dependencies";
import { loadModules, registerModules } from "./system";
import { appName, getCoreExtensions } from "./ui";

const allowedSuffixes = ["-app", "-widgets"];

/**
 * Gets the frontend modules (apps). These are entries
 * in the import maps that end with "-app".
 * @param maps The value of the "imports" property of the
 * import maps.
 */
function getApps(maps: Record<string, string>) {
  return Object.keys(maps).filter((m) =>
    allowedSuffixes.some((n) => m.endsWith(n))
  );
}

/**
 * Loads the frontend modules (apps and widgets). Should be done *after*
 * the import maps initialized, i.e., after modules loaded.
 *
 * By convention we call frontend modules registering activation functions
 * apps, and all others widgets. This is not enforced technically.
 */
function loadApps() {
  return window.importMapOverrides
    .getCurrentPageMap()
    .then((importMap) => loadModules(getApps(importMap.imports)));
}

/**
 * Registers the extensions already coming from the app shell itself.
 */
function registerCoreExtensions() {
  const extensions = getCoreExtensions();

  for (const extension of extensions) {
    tryRegisterExtension(appName, extension);
  }
}

/**
 * Sets up the frontend modules (apps). Uses the defined export
 * from the root modules of the apps, which should export a
 * special function called "setupOpenMRS".
 * That function returns an object that is used to feed Single
 * SPA.
 */
async function setupApps(modules: Array<[string, System.Module]>) {
  modules.forEach(([appName, appExports]) => registerApp(appName, appExports));
  subscribeConnectivity(async () => {
    const appNames = getAppNames();
    await Promise.all(appNames.map(unregisterApplication));
    finishRegisteringAllApps();
  });
  window.installedModules = modules;
}

/**
 * Loads the provided configurations and sets them in the system.
 */
async function loadConfigs(configs: Array<{ name: string; value: Config }>) {
  for (const config of configs) {
    provide(config.value, config.name);
  }
}

/**
 * Invoked when the connectivity is changed.
 */
function connectivityChanged() {
  const online = navigator.onLine;
  dispatchConnectivityChanged(online);
  showToast({
    critical: true,
    description: `Connection: ${online ? "online" : "offline"}`,
    title: "App",
    kind: online ? "success" : "warning",
  });
}

/**
 * Runs the shell by importing the translations and starting single SPA.
 */
function runShell() {
  window.addEventListener("offline", connectivityChanged);
  window.addEventListener("online", connectivityChanged);
  return setupI18n()
    .catch((err) => console.error(`Failed to initialize translations`, err))
    .then(() => start());
}

function handleInitFailure(e: Error) {
  console.error(e);
  renderFatalErrorPage(e.message);
}

function renderFatalErrorPage(message: string) {
  const template = document.querySelector<HTMLTemplateElement>("#app-error");

  if (template) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const messageContainer = fragment.querySelector('[data-var="message"]');

    if (messageContainer) {
      messageContainer.textContent =
        message || "No additional information available.";
    }

    if (
      localStorage.getItem("openmrs:devtools") &&
      Object.keys(localStorage).some((k) =>
        k.startsWith("import-map-override:")
      )
    ) {
      const appErrorActionButtons = fragment?.querySelector("#buttons");
      if (appErrorActionButtons) {
        const clearDevOverridesButton = document.createElement("button");
        clearDevOverridesButton.className = "bx--btn";
        clearDevOverridesButton.innerHTML = "Clear dev overrides";
        clearDevOverridesButton.onclick = clearDevOverrides;
        appErrorActionButtons.appendChild(clearDevOverridesButton);
      }
    }

    document.body.appendChild(fragment);
  }
}

function clearDevOverrides() {
  for (const key of Object.keys(localStorage)) {
    if (
      key.startsWith("import-map-override:") &&
      !["import-map-override:react", "import-map-override:react-dom"].includes(
        key
      )
    ) {
      localStorage.removeItem(key);
    }
  }
  location.reload();
}

function createConfigLoader(configUrls: Array<string>) {
  const loadingConfigs = Promise.all(
    configUrls.map((configUrl) =>
      fetch(configUrl)
        .then((res) => res.json())
        .then((config) => ({
          name: configUrl,
          value: config,
        }))
        .catch((err) => {
          console.error(`Loading the config from "${configUrl}" failed.`, err);
          return {
            name: configUrl,
            value: {},
          };
        })
    )
  );
  return () => loadingConfigs.then(loadConfigs);
}

function showNotifications() {
  renderInlineNotifications(
    document.querySelector(".omrs-inline-notifications-container")
  );
  return;
}

function showToasts() {
  renderToasts(document.querySelector(".omrs-toasts-container"));
  return;
}

function showModals() {
  renderModals(document.querySelector(".omrs-modals-container"));
  return;
}

function showLoadingSpinner() {
  return renderLoadingSpinner(document.body);
}

async function setupOffline() {
  try {
    await registerOmrsServiceWorker(
      `${window.getOpenmrsSpaBase()}service-worker.js`
    );
    await activateOfflineCapability();
    setupOfflineStaticDependencyPrecaching();
  } catch (e) {
    console.error("Error while setting up offline mode.", e);
    showNotification({
      critical: true,
      title: "Offline Setup Error",
      description: `There was an error while initializing the website's offline mode. You can try reloading the page later.`,
    });
  }
}

function setupOfflineStaticDependencyPrecaching() {
  const precacheDelay = 1000 * 60 * 5;
  let lastPrecache: Date | null = null;

  subscribeOnlineAndLoginChange((online, hasLoggedInUser) => {
    const hasExceededPrecacheDelay =
      !lastPrecache ||
      new Date().getTime() - lastPrecache.getTime() > precacheDelay;

    if (hasLoggedInUser && online && hasExceededPrecacheDelay) {
      lastPrecache = new Date();
      dispatchPrecacheStaticDependencies();
    }
  });
}

function subscribeOnlineAndLoginChange(
  cb: (online: boolean, hasLoggedInUser: boolean) => void
) {
  let isOnline = false;
  let hasLoggedInUser = false;

  getCurrentUser({ includeAuthStatus: false }).subscribe((user) => {
    hasLoggedInUser = !!user;
    cb(isOnline, hasLoggedInUser);
  });

  subscribeConnectivity(({ online }) => {
    isOnline = online;
    cb(online, hasLoggedInUser);
  });
}

async function precacheGlobalStaticDependencies() {
  await precacheImportMap();

  // By default, cache the session endpoint.
  // This ensures that a lot of user/session related functions also work offline.
  const sessionPathUrl = new URL(
    `${window.openmrsBase}/ws/rest/v1/session`,
    window.location.origin
  ).href;

  await messageOmrsServiceWorker({
    type: "registerDynamicRoute",
    url: sessionPathUrl,
    strategy: "network-first",
  });

  await openmrsFetch("/ws/rest/v1/session").catch((e) =>
    console.warn(
      "Failed to precache the user session data from the app shell. MFs depending on this data may run into problems while offline.",
      e
    )
  );
}

async function precacheImportMap() {
  const importMap = await window.importMapOverrides.getCurrentPageMap();
  await messageOmrsServiceWorker({
    type: "onImportMapChanged",
    importMap,
  });
}

function setupOfflineCssClasses() {
  subscribeConnectivity(({ online }) => {
    const body = document.querySelector("body")!;
    if (online) {
      body.classList.remove("omrs-offline");
    } else {
      body.classList.add("omrs-offline");
    }
  });
}

export function run(configUrls: Array<string>, offline: boolean) {
  const closeLoading = showLoadingSpinner();
  const provideConfigs = createConfigLoader(configUrls);

  integrateBreakpoints();
  showToasts();
  showModals();
  showNotifications();
  createAppState({});
  subscribeNotificationShown(showNotification);
  subscribeToastShown(showToast);
  subscribePrecacheStaticDependencies(precacheGlobalStaticDependencies);
  registerModules(sharedDependencies);
  setupApiModule();
  registerCoreExtensions();

  return loadApps()
    .then(setupApps)
    .then(setupOfflineCssClasses)
    .then(provideConfigs)
    .then(runShell)
    .catch(handleInitFailure)
    .then(closeLoading)
    .then(() => (offline ? setupOffline() : undefined));
}
