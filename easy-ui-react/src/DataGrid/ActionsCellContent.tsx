import React from "react";
import MoreVertIcon from "@easypost/easy-ui-icons/MoreVert";
import { Menu } from "../Menu";
import { UnstyledPressButton } from "./UnstyledPressButton";
import { RowAction } from "./types";
import { Icon } from "../Icon";

type ActionsCellContentProps = {
  rowActions: RowAction[];
};

export function ActionsCellContent({ rowActions }: ActionsCellContentProps) {
  return (
    <span style={{ display: "inline-flex", gap: "12px" }}>
      {rowActions.map((rowAction, i) => {
        if (rowAction.type === "menu") {
          return (
            <Menu key={i}>
              <Menu.Trigger>
                <UnstyledPressButton>
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
