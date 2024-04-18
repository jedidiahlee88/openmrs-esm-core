import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Header, InlineLoading } from '@carbon/react';
import { ArrowLeft, Close } from '@carbon/react/icons';
import { useLayoutType, isDesktop, getCoreTranslation, translateFrom } from '@openmrs/esm-framework';
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import Parcel from 'single-spa-react/parcel';
import classNames from 'classnames';
import { type OpenWorkspace, useWorkspaces } from '../workspaces';
import { WorkspaceNotification } from '../notification/workspace-notification.component';
import styles from './workspace-overlay.module.scss';

export interface WorkspaceOverlayProps {
  contextKey: string;
}

export function WorkspaceOverlay({ contextKey }: WorkspaceOverlayProps) {
  const { workspaces } = useWorkspaces();
  return (
    <>
      {workspaces.length ? <Workspace workspaceInstance={workspaces[0]} /> : null}
      <WorkspaceNotification contextKey={contextKey} />
    </>
  );
}

interface WorkspaceProps {
  workspaceInstance: OpenWorkspace;
}

const Workspace: React.FC<WorkspaceProps> = ({ workspaceInstance }) => {
  const layout = useLayoutType();
  const ref = useRef<HTMLDivElement>(null);
  const [lifecycle, setLifecycle] = useState<ParcelConfig | undefined>();

  useEffect(() => {
    let active = true;
    workspaceInstance.load().then(({ default: result, ...lifecycle }) => {
      if (active) {
        setLifecycle(result ?? lifecycle);
      }
    });
    return () => {
      active = false;
    };
  }, [workspaceInstance.load]);

  const title = useMemo(
    () => translateFrom(workspaceInstance.moduleName, workspaceInstance.title, workspaceInstance.title),
    [workspaceInstance.moduleName, workspaceInstance.title],
  );

  const workspaceProps = {
    ...workspaceInstance.additionalProps,
    closeWorkspace: workspaceInstance.closeWorkspace,
    closeWorkspaceWithSavedChanges: workspaceInstance.closeWorkspaceWithSavedChanges,
    promptBeforeClosing: workspaceInstance.promptBeforeClosing,
  };

  return (
    <div
      className={classNames({
        [styles.desktopOverlay]: isDesktop(layout),
        [styles.tabletOverlay]: !isDesktop(layout),
      })}
    >
      {isDesktop(layout) ? (
        <div className={styles.desktopHeader}>
          <div className={styles.headerContent}>{title}</div>
          <Button
            className={styles.closeButton}
            onClick={workspaceInstance?.closeWorkspace}
            kind="ghost"
            hasIconOnly
            iconDescription={getCoreTranslation('close', 'Close')}
            tooltipPosition="bottom"
            renderIcon={(props) => <Close size={16} {...props} />}
          />
        </div>
      ) : (
        <Header className={styles.tabletOverlayHeader} aria-label="Workspace header">
          <Button
            onClick={workspaceInstance.closeWorkspace}
            kind="ghost"
            hasIconOnly
            iconDescription={getCoreTranslation('close', 'Close')}
            tooltipPosition="bottom"
            renderIcon={(props) => <ArrowLeft size={16} onClick={close} {...props} />}
          />
          <div className={styles.headerContent}>{title}</div>
        </Header>
      )}
      <div className={styles.workspaceContent} ref={ref}>
        {lifecycle ? (
          <Parcel key={workspaceInstance.name} config={lifecycle} mountParcel={mountRootParcel} {...workspaceProps} />
        ) : (
          <InlineLoading
            className={styles.workspaceLoadingContent}
            description={`${getCoreTranslation('loading', 'Loading...')}`}
          />
        )}
      </div>
    </div>
  );
};
