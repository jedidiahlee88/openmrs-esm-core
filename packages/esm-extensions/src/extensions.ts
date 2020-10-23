import { mountRootParcel } from "single-spa";
import { getExtensionSlotConfig } from "@openmrs/esm-config";

/**
 * Creates the extension component <-> extension slot management engine.
 */
const extensions: Record<string, ExtensionRegistration> = {};
const attachedExtensionsForExtensionSlot: Record<string, Array<string>> = {};
const extensionSlotsForModule: Record<string, Array<string>> = {};

interface ExtensionRegistration extends ExtensionDefinition {
  moduleName: string;
}

export interface ExtensionDefinition {
  name: string;
  load(): Promise<any>;
}

export interface PageDefinition {
  route: string;
  load(): Promise<any>;
}

export interface Lifecycle {
  bootstrap(): void;
  mount(): void;
  unmount(): void;
  update?(): void;
}

export interface CancelLoading {
  (): void;
}

export function registerExtension(
  moduleName: string,
  name: string,
  load: () => Promise<any>
) {
  extensions[name] = {
    name,
    load,
    moduleName,
  };
}

/**
 * This is only used to inform tooling about the extension slot. Extension slots
 * do not have to be registered to mount extensions.
 *
 * @param moduleName The name of the module that contains the extension slot
 * @param name The extension slot name
 */
export function registerExtensionSlot(moduleName: string, name: string) {
  if (extensionSlotsForModule.hasOwnProperty(moduleName)) {
    extensionSlotsForModule[moduleName].push(name);
  } else {
    extensionSlotsForModule[moduleName] = [name];
  }
}
export function unregisterExtensionSlot(moduleName: string, name: string) {
  extensionSlotsForModule[moduleName].splice(
    extensionSlotsForModule[moduleName].indexOf(name),
    1
  );
}
export function getExtensionSlotsForModule(moduleName: string) {
  return extensionSlotsForModule[moduleName] ?? [];
}

export function attach(extensionSlotName: string, extensionId: string) {
  if (attachedExtensionsForExtensionSlot.hasOwnProperty(extensionSlotName)) {
    attachedExtensionsForExtensionSlot[extensionSlotName].push(extensionId);
  } else {
    attachedExtensionsForExtensionSlot[extensionSlotName] = [extensionId];
  }
}

export function getExtensionRegistration(
  extensionId: string
): ExtensionRegistration {
  const extensionName = extensionId.split("#")[0];
  return extensions[extensionName];
}

export async function getExtensionIdsForExtensionSlot(
  extensionSlotName: string,
  moduleName: string
): Promise<Array<string>> {
  const config = await getExtensionSlotConfig(extensionSlotName, moduleName);
  let extensionIds =
    attachedExtensionsForExtensionSlot[extensionSlotName] ?? [];

  if (config.add) {
    extensionIds = extensionIds.concat(config.add);
  }

  if (config.remove) {
    extensionIds = extensionIds.filter((n) => !config.remove?.includes(n));
  }

  if (config.order) {
    extensionIds = extensionIds.sort((a, b) =>
      config.order?.includes(a)
        ? config.order.includes(b)
          ? config.order.indexOf(a) - config.order.indexOf(b)
          : -1
        : config.order?.includes(b)
        ? 1
        : 0
    );
  }

  return extensionIds;
}

/**
 * Mounts into a DOM node (representing an extension slot)
 * a lazy-loaded component from *any* microfrontend
 * that registered an extension component for this slot.
 */
export function renderExtension(
  domElement: HTMLElement,
  extensionSlotName: string, // will be used to look up configuration info
  extensionId: string,
  renderFunction: (lifecycle: Lifecycle) => Lifecycle = (x) => x
): CancelLoading {
  const extensionName = extensionId.split("#")[0];
  const component = extensions[extensionName];
  let active = true;

  if (domElement) {
    if (component) {
      component.load().then(
        ({ default: result }) =>
          active &&
          mountRootParcel(renderFunction(result) as any, {
            domElement,
          })
      );
    } else {
      throw Error(
        `Couldn't find extension '${extensionName}' to attach to '${extensionSlotName}'`
      );
    }
  }

  return () => {
    active = false;
  };
}

export function getIsUIEditorEnabled(): boolean {
  return JSON.parse(
    localStorage.getItem("openmrs:isUIEditorEnabled") ?? "false"
  );
}

export function setIsUIEditorEnabled(enabled: boolean): void {
  localStorage.setItem("openmrs:isUIEditorEnabled", JSON.stringify(enabled));
}

/**
 * @internal
 * Just for testing.
 */
export function reset() {
  Object.keys(extensions).forEach((key) => delete extensions[key]);
  Object.keys(attachedExtensionsForExtensionSlot).forEach(
    (key) => delete attachedExtensionsForExtensionSlot[key]
  );
}
