import React from "react";
import { Menu } from "../Menu";
import { UnstyledPressButton } from "./UnstyledPressButton";
import { RowAction } from "./types";

type ActionsCellProps = {
  rowActions: RowAction[];
};

export function ActionsCell({ rowActions }: ActionsCellProps) {
  return (
    <span style={{ display: "inline-flex", gap: "12px" }}>
      {rowActions.map((rowAction, i) => {
        if (rowAction.type === "menu") {
          return (
            <Menu key={i}>
              <Menu.Trigger>
                <UnstyledPressButton>Test1</UnstyledPressButton>
              </Menu.Trigger>
              {rowAction.renderMenuOverlay()}
            </Menu>
          );
        }
        return (
          <span key={i}>
            <UnstyledPressButton
              onClick={() => {
                rowAction.onAction();
              }}
            >
              Test2
            </UnstyledPressButton>
          </span>
        );
      })}
    </span>
  );
}
