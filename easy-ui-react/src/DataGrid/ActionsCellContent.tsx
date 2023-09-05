import MoreVertIcon from "@easypost/easy-ui-icons/MoreVert";
import React from "react";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { useRow } from "./Row";
import { UnstyledPressButton } from "./UnstyledPressButton";
import {
  ActionRowAction as ActionRowActionType,
  MenuRowAction as MenuRowActionType,
  RowAction,
} from "./types";

import styles from "./DataGrid.module.scss";

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
  const row = useRow();
  return (
    <Menu>
      <Menu.Trigger>
        <UnstyledPressButton
          onClick={() => {
            row.removeHover();
          }}
        >
          <Icon symbol={MoreVertIcon} />
        </UnstyledPressButton>
      </Menu.Trigger>
      {rowAction.renderMenuOverlay()}
    </Menu>
  );
}

function ActionRowAction({ rowAction }: { rowAction: ActionRowActionType }) {
  return (
    <UnstyledPressButton
      onClick={() => {
        rowAction.onAction();
      }}
    >
      <Icon
        symbol={rowAction.iconSymbol}
        accessibilityLabel={rowAction.accessibilityLabel}
      />
    </UnstyledPressButton>
  );
}
