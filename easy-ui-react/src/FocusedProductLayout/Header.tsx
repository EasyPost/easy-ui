import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import React, { ReactNode } from "react";
import { Icon } from "../Icon";
import { MenuOverlayProps } from "../Menu/MenuOverlay";
import { HelpMenu } from "../ProductLayout/HelpMenu";
import { Text } from "../Text";

import styles from "./Header.module.scss";
import { classNames } from "../utilities/css";

export type HeaderProps = {
  helpMenuItems: MenuOverlayProps<object>["children"];
  onHelpMenuAction?: MenuOverlayProps<object>["onAction"];
  renderBackArrow: (props: { children: ReactNode }) => ReactNode;
  renderLogo: () => ReactNode;
  title: ReactNode;
};

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
