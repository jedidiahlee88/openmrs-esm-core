import { createGlobalStore, getGlobalStore } from "@openmrs/esm-state";
import {
  Config,
  ConfigObject,
  ConfigSchema,
  ExtensionSlotConfigObject,
  ProvidedConfig,
} from "../types";

/**
 * Internal store
 *   A store of the inputs and internal state
 * @internal
 */
export interface ConfigInternalStore {
  /** Configs added using the `provide` function */
  providedConfigs: Array<ProvidedConfig>;
  /** A config file provided as `config-file` in the import map */
  importMapConfig: Config;
  /** An object with module names for keys and schemas for values */
  schemas: Record<string, ConfigSchema>;
  /** A flag to keep track of whether the import map config has been loaded */
  importMapConfigLoaded: boolean;
  /** Whether to use dev defaults or not */
  devDefaultsAreOn: boolean;
}

/**
 * @internal
 */
export const configInternalStore = createGlobalStore<ConfigInternalStore>(
  "config-internal",
  {
    providedConfigs: [],
    importMapConfig: {},
    schemas: {},
    importMapConfigLoaded: false,
    devDefaultsAreOn: getAreDevDefaultsOn(),
  }
);
(window as any).configInternalStore = configInternalStore;

let lastValueOfDevDefaultsAreOn = getAreDevDefaultsOn();
configInternalStore.subscribe((state) => {
  if (state.devDefaultsAreOn != lastValueOfDevDefaultsAreOn) {
    setAreDevDefaultsOn(state.devDefaultsAreOn);
    lastValueOfDevDefaultsAreOn = state.devDefaultsAreOn;
  }
});

function setAreDevDefaultsOn(value: boolean) {
  localStorage.setItem("openmrs:configAreDevDefaultsOn", JSON.stringify(value));
}

function getAreDevDefaultsOn(): boolean {
  try {
    return JSON.parse(
      localStorage.getItem("openmrs:configAreDevDefaultsOn") || "false"
    );
  } catch (e) {
    return false;
  }
}

/**
 * Temporary config
 *   LocalStorage-based config used by the implementer tools
 * @internal
 */

export const temporaryConfigStore = createGlobalStore<Config>(
  "temporary-config",
  getTemporaryConfig()
);

temporaryConfigStore.subscribe((state) => {
  setTemporaryConfig(state);
});

function setTemporaryConfig(value: Config) {
  localStorage.setItem("openmrs:temporaryConfig", JSON.stringify(value));
}

function getTemporaryConfig(): Config {
  try {
    return JSON.parse(localStorage.getItem("openmrs:temporaryConfig") || "{}");
  } catch (e) {
    return {};
  }
}

/**
 * Config-side extension store
 *   Just what esm-config needs to know about extension state. This
 *   is to avoid having esm-config depend on esm-extensions, which would
 *   create a circular dependency.
 * @internal
 */
export interface ConfigExtensionStore {
  mountedExtensions: Array<ConfigExtensionStoreElement>;
}

/**
 * @internal
 */
export interface ConfigExtensionStoreElement {
  slotModuleName: string;
  extensionModuleName: string;
  slotName: string;
  extensionId: string;
}

/**
 * @internal
 */
export const configExtensionStore = createGlobalStore<ConfigExtensionStore>(
  "config-extensions",
  { mountedExtensions: [] }
);

/**
 * Output configs
 *
 * Each module has its own stores for its config and its extension slots' configs.
 */
export interface ConfigStore {
  config: ConfigObject | null;
  loaded: boolean;
}

function initializeConfigStore() {
  return {
    config: null,
    loaded: false,
  };
}

export function getConfigStore(moduleName: string) {
  // We use a store for each module's config, named `config-${moduleName}`
  return getGlobalStore<ConfigStore>(
    `config-${moduleName}`,
    initializeConfigStore()
  );
}
(window as any).getConfigStore = getConfigStore;

export interface ExtensionSlotConfigsStore {
  /** Configs for each extension slot in the module, indexed by slot name */
  extensionSlotConfigs: Record<string, ExtensionSlotConfigObject>;
  loaded: boolean;
}

function initializeExtensionSlotConfigsStore() {
  return {
    extensionSlotConfigs: {},
    loaded: false,
  };
}

export function getExtensionSlotsConfigStore(moduleName: string) {
  // We use a store for each module's config, named `config-${moduleName}`
  return getGlobalStore<ExtensionSlotConfigsStore>(
    `config-${moduleName}-extension-slots`,
    initializeExtensionSlotConfigsStore()
  );
}

// A store for each extension's config
export function getExtensionConfigStore(
  extensionSlotModuleName: string,
  attachedExtensionSlotName: string,
  extensionId: string
) {
  return getGlobalStore<ConfigStore>(
    `ext-config-${extensionSlotModuleName}-${attachedExtensionSlotName}-${extensionId}`,
    initializeConfigStore()
  );
}

// A store of the implementer tools output config
export const implementerToolsConfigStore = createGlobalStore<Config>(
  "config-implementer-tools",
  {}
);
