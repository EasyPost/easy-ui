import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import React, { ReactNode } from "react";
import { Icon } from "../Icon";
import { MenuOverlayProps } from "../Menu/MenuOverlay";
import { Text } from "../Text";

import styles from "./Header.module.scss";

export type HeaderProps = {
  helpMenuItems: MenuOverlayProps<object>["children"];
  onHelpMenuAction?: MenuOverlayProps<object>["onAction"];
  renderBackArrow: (props: { children: ReactNode }) => ReactNode;
  renderLogo: () => ReactNode;
  title: ReactNode;
};

export function Header({ renderLogo, renderBackArrow, title }: HeaderProps) {
  return (
    <div className={styles.Header}>
      <div className={styles.logoRow}>
        {renderLogo()}
        {/* <FakeHelpButton /> */}
      </div>
      <header className={styles.titleRow}>
        <div className={styles.titleBoxWithArrow}>
          {renderBackArrow({ children: <Icon symbol={ArrowBackIcon} /> })}
          <Text as="h2" variant="heading3">
            {title}
          </Text>
        </div>
      </header>
    </div>
  );
}
