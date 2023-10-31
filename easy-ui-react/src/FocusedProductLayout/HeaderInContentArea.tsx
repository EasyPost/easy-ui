import React from "react";
import { HelpMenu } from "../ProductLayout/HelpMenu";
import { Text } from "../Text";
import { BackArrow } from "./BackArrow";
import type { HeaderProps } from "./FocusedProductLayout";

import styles from "./HeaderInContentArea.module.scss";

/**
 * Header to render in the main content area. Most of this is rendered only
 * on large screens.
 *
 * @private
 * @ignore
 */
export function HeaderInContentArea(props: HeaderProps) {
  const {
    helpMenuItems,
    onHelpMenuAction,
    renderBackArrow,
    renderLogo,
    title,
  } = props;
  return (
    <div className={styles.HeaderInContentArea}>
      <div className={styles.logoBar}>
        {renderLogo()}
        <HelpMenu items={helpMenuItems} onAction={onHelpMenuAction} />
      </div>
      <header>
        <div className={styles.titleBox}>
          <span className={styles.backArrowBox}>
            <BackArrow renderBackArrow={renderBackArrow} />
          </span>
          <Text as="h2" variant="heading3">
            {title}
          </Text>
        </div>
      </header>
    </div>
  );
}
