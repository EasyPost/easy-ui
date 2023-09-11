import MoreVertIcon from "@easypost/easy-ui-icons/MoreVert";
import React, { useCallback } from "react";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { UnstyledPressButton } from "./UnstyledPressButton";
import { useDataGridRow } from "./context";
import {
  ActionRowAction as ActionRowActionType,
  MenuRowAction as MenuRowActionType,
  RowAction,
} from "./types";

import styles from "./DataGrid.module.scss";
import { Text } from "../Text";

type ActionsCellContentProps = {
  rowActions: RowAction[];
};

export function ActionsCellContent({ rowActions }: ActionsCellContentProps) {
  return (
    <span className={styles.actionsCellContent}>
      {rowActions.map((rowAction, i) =>
        rowAction.type === "menu" ? (
          <MenuRowAction key={i} rowAction={rowAction} />
        ) : (
          <ActionRowAction key={i} rowAction={rowAction} />
        ),
      )}
    </span>
  );
}

function MenuRowAction({ rowAction }: { rowAction: MenuRowActionType }) {
  const { accessibilityLabel = "Actions" } = rowAction;
  const { removeHover } = useDataGridRow();
  const handleClick = useCallback(() => {
    removeHover();
  }, [removeHover]);
  return (
    <Menu>
      <Menu.Trigger>
        <UnstyledPressButton onPress={handleClick}>
          <Text visuallyHidden>{accessibilityLabel}</Text>
          <Icon symbol={MoreVertIcon} />
        </UnstyledPressButton>
      </Menu.Trigger>
      {rowAction.renderMenuOverlay()}
    </Menu>
  );
}

function ActionRowAction({ rowAction }: { rowAction: ActionRowActionType }) {
  const { onAction } = rowAction;
  const handleClick = useCallback(() => {
    onAction();
  }, [onAction]);
  return (
    <UnstyledPressButton onPress={handleClick}>
      <Text visuallyHidden>{rowAction.accessibilityLabel}</Text>
      <Icon symbol={rowAction.iconSymbol} />
    </UnstyledPressButton>
  );
}
