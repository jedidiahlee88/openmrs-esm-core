import React, { ReactNode } from "react";
import styles from "./shared-page-layout.styles.scss";

export interface SharedPageLayoutProps {
  header: string;
  primaryActions?: ReactNode;
}

const SharedPageLayout: React.FC<SharedPageLayoutProps> = ({
  header: title,
  primaryActions,
  children,
}) => {
  return (
    <>
      <header className={styles.pageHeaderContainer}>
        <h1 className={styles.pageHeader}>{title}</h1>
        {primaryActions}
      </header>
      {children}
    </>
  );
};

export default SharedPageLayout;
