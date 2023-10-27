import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import React from "react";
import { Icon } from "../Icon";
import { HelpMenu } from "../ProductLayout/HelpMenu";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import type { HeaderProps } from "./FocusedProductLayout";

import styles from "./Header.module.scss";

export function HeaderInContentArea(props: HeaderProps) {
  const {
    helpMenuItems,
    onHelpMenuAction,
    renderBackArrow,
    renderLogo,
    title,
  } = props;
  return (
    <div className={classNames(styles.Header, styles.inContentArea)}>
      <div className={styles.logoRow}>
        {renderLogo()}
        <HelpMenu items={helpMenuItems} onAction={onHelpMenuAction} />
      </div>
      <header className={styles.titleRow}>
        <div className={styles.titleBoxWithArrow}>
          <span className={styles.backArrowBox}>
            {renderBackArrow({ children: <Icon symbol={ArrowBackIcon} /> })}
          </span>
          <Text as="h2" variant="heading3">
            {title}
          </Text>
        </div>
      </header>
    </div>
  );
}
