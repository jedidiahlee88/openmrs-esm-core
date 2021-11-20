import React from "react";
import styles from "./app-menu-panel.component.scss";
import { ExtensionSlot, useOnClickOutside } from "@openmrs/esm-framework";
import { HeaderPanel } from "carbon-components-react";

interface AppMenuProps {
  expanded: boolean;
  hidePanel: () => void;
}

const AppMenuPanel: React.FC<AppMenuProps> = ({ expanded, hidePanel }) => {
  const appMenuRef = useOnClickOutside<HTMLDivElement>(hidePanel, expanded);

  return (
    <HeaderPanel
      ref={appMenuRef as any}
      className={styles.headerPanel}
      aria-label="App Menu Panel"
      expanded={expanded}
    >
      <ExtensionSlot
        className={styles.menuLink}
        extensionSlotName="app-menu-slot"
      />
      <ExtensionSlot
        className={styles.menuLink}
        extensionSlotName="app-menu-external-links-slot"
      />
    </HeaderPanel>
  );
};

export default AppMenuPanel;
