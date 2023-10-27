import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import React from "react";
import { Icon } from "../Icon";
import { HelpMenu } from "../ProductLayout/HelpMenu";
import { classNames } from "../utilities/css";
import type { HeaderProps } from "./FocusedProductLayout";

import styles from "./Header.module.scss";

export function HeaderAtTopOfPage(props: Omit<HeaderProps, "title">) {
  const { helpMenuItems, onHelpMenuAction, renderBackArrow, renderLogo } =
    props;
  return (
    <div className={classNames(styles.Header, styles.atTopOfPage)}>
      <div className={styles.logoRow}>
        <span className={styles.logoArrowBox}>
          <span className={styles.backArrowBox}>
            {renderBackArrow({ children: <Icon symbol={ArrowBackIcon} /> })}
          </span>
          {renderLogo()}
        </span>
        <HelpMenu items={helpMenuItems} onAction={onHelpMenuAction} />
      </div>
    </div>
  );
}
