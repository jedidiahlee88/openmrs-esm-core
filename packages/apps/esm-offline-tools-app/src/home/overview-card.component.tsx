import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Tile, TileProps } from "carbon-components-react";
import styles from "./overview-card.styles.scss";
import ArrowRight16 from "@carbon/icons-react/es/arrow--right/16";

export interface OverviewCardProps extends TileProps {
  header: string;
  viewLink: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  header,
  viewLink,
  children,
  ...rest
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Tile
      {...rest}
      light
      className={`${styles.overviewCard} ${rest.className}`}
    >
      <div className={styles.headerContainer}>
        <h3 className={styles.productiveHeading01}>{header}</h3>
        <Button
          kind="ghost"
          renderIcon={ArrowRight16}
          size="sm"
          onClick={() => history.push(viewLink)}
        >
          {t("homeOverviewCardView", "View")}
        </Button>
      </div>
      <div className={styles.contentContainer}>{children}</div>
    </Tile>
  );
};

export default OverviewCard;
