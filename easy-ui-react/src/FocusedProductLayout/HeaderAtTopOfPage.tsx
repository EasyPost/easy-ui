import React from "react";
import { HelpMenu } from "../ProductLayout/HelpMenu";
import { BackArrow } from "./BackArrow";
import type { HeaderProps } from "./FocusedProductLayout";

import styles from "./HeaderAtTopOfPage.module.scss";

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
    <div className={styles.HeaderAtTopOfPage}>
      <span className={styles.logoBox}>
        <BackArrow renderBackArrow={renderBackArrow} />
        {renderLogo()}
      </span>
      <HelpMenu items={helpMenuItems} onAction={onHelpMenuAction} />
    </div>
  );
}
