import MoreVertIcon from "@easypost/easy-ui-icons/MoreVert";
import React from "react";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { useRow } from "./Row";
import { UnstyledPressButton } from "./UnstyledPressButton";
import { RowAction } from "./types";

type ActionsCellContentProps = {
  rowActions: RowAction[];
};

export function ActionsCellContent({ rowActions }: ActionsCellContentProps) {
  const row = useRow();
  return (
    <span style={{ display: "inline-flex", gap: "12px" }}>
      {rowActions.map((rowAction, i) => {
        if (rowAction.type === "menu") {
          return (
            <Menu key={i}>
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
        return (
          <UnstyledPressButton
            key={i}
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
      })}
    </span>
  );
}
