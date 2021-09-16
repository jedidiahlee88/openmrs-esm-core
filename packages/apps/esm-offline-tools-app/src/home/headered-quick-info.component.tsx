import { SkeletonText } from "carbon-components-react";
import React, { ReactNode } from "react";
import styles from "./headered-quick-info.styles.scss";

export interface HeaderedQuickInfoProps {
  header: string;
  content: ReactNode;
  isLoading?: boolean;
}

const HeaderedQuickInfo: React.FC<HeaderedQuickInfoProps> = ({
  header,
  content,
  isLoading = false,
}) => {
  return (
    <div>
      <h4 className={styles.label01}>{header}</h4>
      {isLoading ? (
        <SkeletonText heading />
      ) : (
        <span className={styles.productiveHeading04}>{content}</span>
      )}
    </div>
  );
};

export default HeaderedQuickInfo;
