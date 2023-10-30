import React from "react";
import { HelpMenu } from "../ProductLayout/HelpMenu";
import { classNames } from "../utilities/css";
import { BackArrow } from "./BackArrow";
import type { HeaderProps } from "./FocusedProductLayout";

import styles from "./Header.module.scss";

/**
 * Header to render at the top of the page. Above the main content. Only
 * visible on small screens.
 *
 * @private
 * @ignore
 */
export function HeaderAtTopOfPage(props: Omit<HeaderProps, "title">) {
  const { helpMenuItems, onHelpMenuAction, renderBackArrow, renderLogo } =
    props;
  return (
    <div className={classNames(styles.Header, styles.atTopOfPage)}>
      <div className={styles.logoRow}>
        <span className={styles.logoArrowBox}>
          <span className={styles.backArrowBox}>
            <BackArrow renderBackArrow={renderBackArrow} />
          </span>
          {renderLogo()}
        </span>
        <HelpMenu items={helpMenuItems} onAction={onHelpMenuAction} />
      </div>
    </div>
  );
}
