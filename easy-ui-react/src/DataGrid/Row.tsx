import { Node } from "@react-types/shared";
import React, { ReactNode, useRef } from "react";
import { mergeProps, useFocusRing, useTableRow } from "react-aria";
import { TableState } from "react-stately";

type RowProps<T = unknown> = {
  item: Node<T>;
  state: TableState<T>;
  children: ReactNode;
};

export function Row({ item, children, state }: RowProps) {
  const ref = useRef(null);
  const isSelected = state.selectionManager.isSelected(item.key);
  const { rowProps, isPressed } = useTableRow({ node: item }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  return (
    <div
      style={{
        background: isSelected
          ? "blueviolet"
          : isPressed
          ? "var(--spectrum-global-color-gray-400)"
          : item.index && item.index % 2
          ? "var(--spectrum-alias-highlight-hover)"
          : "none",
        color: isSelected ? "white" : undefined,
        outline: "none",
        boxShadow: isFocusVisible ? "inset 0 0 0 2px orange" : "none",
      }}
      {...mergeProps(rowProps, focusProps)}
      ref={ref}
    >
      {children}
    </div>
  );
}
