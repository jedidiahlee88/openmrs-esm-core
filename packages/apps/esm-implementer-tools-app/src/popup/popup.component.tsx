import React, { useState } from "react";
import { Button, ContentSwitcher, Switch } from "@carbon/react";
import { Close } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
import { Configuration } from "../configuration/configuration.component";
import { ModuleDiagnostics } from "../backend-dependencies/backend-dependencies.component";
import { FrontendModule } from "../backend-dependencies/openmrs-backend-dependencies";
import styles from "./popup.styles.scss";

interface DevToolsPopupProps {
  close(): void;
  frontendModules: Array<FrontendModule>;
  visibleTabIndex?: number;
}

export default function Popup({ close, frontendModules }: DevToolsPopupProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.popup}>
      <div className={styles.topBar}>
        <div className={styles.tabs}>
          <ContentSwitcher
            onChange={(c) => {
              setActiveTab((c as any).index);
            }}
          >
            <Switch
              name="configuration-tab"
              text={t("configuration", "Configuration")}
            />
            <Switch
              name="backend-modules-tab"
              text={t("backendModules", "Backend Modules")}
            />
          </ContentSwitcher>
        </div>
        <div>
          <Button
            kind="secondary"
            renderIcon={(props) => <Close size={16} {...props} />}
            iconDescription="Close"
            onClick={close}
            hasIconOnly
            size="sm"
          />
        </div>
      </div>
      <div className={styles.content}>
        {activeTab == 0 ? (
          <Configuration />
        ) : (
          <ModuleDiagnostics frontendModules={frontendModules} />
        )}
      </div>
    </div>
  );
}
