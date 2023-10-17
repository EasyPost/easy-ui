import ArrowDropDownIcon from "@easypost/easy-ui-icons/ArrowDropDown";
import SupportIcon from "@easypost/easy-ui-icons/Support";
import { CollectionChildren } from "@react-types/shared";
import React from "react";
import { UnstyledPressButton } from "../DataGrid/UnstyledPressButton";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { Text } from "../Text";

import styles from "./HelpMenu.module.scss";

export type HelpMenuProps = {
  items: CollectionChildren<object>;
};

export function HelpMenu(props: HelpMenuProps) {
  const { items } = props;
  return (
    <Menu>
      <Menu.Trigger>
        <UnstyledPressButton>
          <span className={styles.button}>
            <Icon symbol={SupportIcon} />
            <Text variant="subtitle1">Help</Text>
            <span className={styles.arrow}>
              <Icon symbol={ArrowDropDownIcon} />
            </span>
          </span>
        </UnstyledPressButton>
      </Menu.Trigger>
      <Menu.Overlay placement="bottom right">{items}</Menu.Overlay>
    </Menu>
  );
}
