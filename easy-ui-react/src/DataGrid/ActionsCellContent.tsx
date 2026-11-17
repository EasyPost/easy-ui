import React, { useCallback, useState } from "react";
import { IconButton } from "../IconButton";
import { Menu } from "../Menu";
import { KebabButton } from "../KebabButton";
import { useDataGridRow } from "./context";
import {
  ActionRowAction as ActionRowActionType,
  MenuRowAction as MenuRowActionType,
  RowAction,
} from "./types";

import styles from "./ActionsCellContent.module.scss";

type ActionsCellContentProps = {
  rowActions: RowAction[];
};

export function ActionsCellContent({ rowActions }: ActionsCellContentProps) {
  return (
    <span className={styles.ActionsCellContent}>
      {rowActions.map((rowAction, i) =>
        rowAction.type === "menu" ? (
          // eslint-disable-next-line @eslint-react/no-array-index-key -- row actions have no unique id
          <MenuRowAction key={i} rowAction={rowAction} />
        ) : (
          // eslint-disable-next-line @eslint-react/no-array-index-key -- row actions have no unique id
          <ActionRowAction key={i} rowAction={rowAction} />
        ),
      )}
    </span>
  );
}

function MenuRowAction({ rowAction }: { rowAction: MenuRowActionType }) {
  const { accessibilityLabel = "Actions" } = rowAction;
  const { removeHover } = useDataGridRow();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = useCallback(() => {
    removeHover();
  }, [removeHover]);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setIsOpen(isOpen);
  }, []);

  return (
    <Menu isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Menu.Trigger>
        <KebabButton
          onPress={handleClick}
          accessibilityLabel={accessibilityLabel}
        />
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
    <IconButton
      variant="ghost"
      color="support"
      size="xs"
      icon={rowAction.iconSymbol}
      accessibilityLabel={rowAction.accessibilityLabel}
      onPress={handleClick}
    />
  );
}
