import React, {
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { ModuleNameContext, ExtensionContext } from "@openmrs/esm-context";
import { configCacheNotifier } from "@openmrs/esm-config";
import {
  renderExtension,
  getExtensionIdsForExtensionSlot,
  getIsUIEditorEnabled,
  getExtensionRegistration,
  registerExtensionSlot,
  unregisterExtensionSlot,
} from "./extensions";

interface ExtensionSlotBaseProps {
  extensionSlotName: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  state?: Record<string, any>;
}

// remainder of props are for the top-level <div>
export type ExtensionSlotReactProps<T = {}> = ExtensionSlotBaseProps & T;

export const ExtensionSlotReact: React.FC<ExtensionSlotReactProps> = ({
  extensionSlotName,
  children,
  style,
  state,
  ...divProps
}: ExtensionSlotReactProps) => {
  const [extensionIds, setExtensionIds] = useState<Array<{attachedExtensionSlotName: string, extensionId: string}>>([]);
  const slotModuleName = useContext(ModuleNameContext);

  if (!slotModuleName) {
    throw Error(
      "ModuleNameContext has not been provided. This should come from openmrs-react-root-decorator"
    );
  }

  const getAndSetExtensionIds = useCallback(() => {
    getExtensionIdsForExtensionSlot(
      extensionSlotName,
      slotModuleName
    ).then((ids) => setExtensionIds(ids));
  }, [getExtensionIdsForExtensionSlot, extensionSlotName, slotModuleName]);

  useEffect(() => {
    getAndSetExtensionIds();
  }, [getAndSetExtensionIds, extensionSlotName, slotModuleName]);

  useEffect(() => {
    registerExtensionSlot(slotModuleName, extensionSlotName);
    return () => unregisterExtensionSlot(slotModuleName, extensionSlotName);
  }, []);

  useEffect(() => {
    const sub = configCacheNotifier.subscribe(() => {
      getAndSetExtensionIds();
    });
    return () => sub.unsubscribe();
  }, [extensionSlotName]);

  const divStyle = getIsUIEditorEnabled()
    ? { ...style, backgroundColor: "cyan" }
    : style;

  return (
    <div style={divStyle} {...divProps}>
      {extensionIds.map((extensionId) => {
        const extensionRegistration = getExtensionRegistration(extensionId.extensionId);
        return (
          <ExtensionContext.Provider
            key={extensionId.extensionId}
            value={{
              actualExtensionSlotName: extensionSlotName,
              attachedExtensionSlotName: extensionId.attachedExtensionSlotName,
              extensionId: extensionId.extensionId,
              extensionModuleName: extensionRegistration.moduleName,
            }}
          >
            {children ?? <ExtensionReact state={state} />}
          </ExtensionContext.Provider>
        );
      })}
    </div>
  );
};

export interface ExtensionReactProps {
  state?: Record<string, any>;
}

export const ExtensionReact: React.FC<ExtensionReactProps> = ({ state }) => {
  const ref = React.useRef<HTMLSlotElement>(null);
  const { actualExtensionSlotName, attachedExtensionSlotName, extensionId } = useContext(ExtensionContext);
  // TODO: handle error if Extension not wrapped in ExtensionSlot

  React.useEffect(() => {
    if (ref.current) {
      return renderExtension(
        ref.current,
        actualExtensionSlotName,
        attachedExtensionSlotName,
        extensionId,
        undefined,
        state
      );
    }
  }, [actualExtensionSlotName, attachedExtensionSlotName, extensionId]);

  return getIsUIEditorEnabled() ? (
    <div style={{ outline: "0.125rem solid yellow" }}>
      <slot ref={ref} />
    </div>
  ) : (
    <slot ref={ref} />
  );
};
