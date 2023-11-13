import React from "react";
import type { BaseVerticalNavProps } from "./types";

import styles from "./VerticalNav.module.scss";

export function Container(props: BaseVerticalNavProps) {
  const {
    renderBanner,
    renderLogo,
    supplementaryAction,
    ["aria-label"]: ariaLabel,
    ["aria-labelledby"]: ariaLabelledBy,
    ["aria-describedby"]: ariaDescribedBy,
    ["aria-details"]: ariaDetails,
    children,
  } = props;
  return (
    <div className={styles.container}>
      {renderBanner && <div className={styles.banner}>{renderBanner()}</div>}
      {renderLogo && <div className={styles.logo}>{renderLogo()}</div>}
      <nav
        className={styles.nav}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
      >
        {children}
      </nav>
      {supplementaryAction && (
        <div className={styles.supplementaryActionContainer}>
          {supplementaryAction}
        </div>
      )}
    </div>
  );
}
