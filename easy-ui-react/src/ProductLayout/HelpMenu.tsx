import ArrowDropDownIcon from "@easypost/easy-ui-icons/ArrowDropDown";
import SupportIcon from "@easypost/easy-ui-icons/Support";
import React from "react";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { MenuOverlayProps } from "../Menu/MenuOverlay";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";

import styles from "./HelpMenu.module.scss";

export type HelpMenuProps = {
  items: MenuOverlayProps<object>["children"];
  onAction?: MenuOverlayProps<object>["onAction"];
};

export function HelpMenu(props: HelpMenuProps) {
  const { items, onAction } = props;
  return (
    <Menu>
      <Menu.Trigger>
        <UnstyledButton className={styles.button}>
          <span className={styles.buttonContent}>
            <Icon symbol={SupportIcon} />
            <Text variant="subtitle1">Help</Text>
            <span className={styles.arrow}>
              <Icon symbol={ArrowDropDownIcon} />
            </span>
          </span>
        </UnstyledButton>
      </Menu.Trigger>
      <Menu.Overlay onAction={onAction} placement="bottom right">
        {items}
      </Menu.Overlay>
    </Menu>
  );
}
