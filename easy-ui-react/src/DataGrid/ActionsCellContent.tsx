import React, { useCallback, useState } from "react";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { Text } from "../Text";
import { KebabButton } from "../KebabButton";
import { UnstyledPressButton } from "../UnstyledButton/UnstyledPressButton";
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
    <UnstyledPressButton onPress={handleClick}>
      <Text visuallyHidden>{rowAction.accessibilityLabel}</Text>
      <Icon symbol={rowAction.iconSymbol} />
    </UnstyledPressButton>
  );
}
