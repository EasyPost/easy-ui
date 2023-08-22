import { Node } from "@react-types/shared";
import React, { ReactNode, useRef } from "react";
import { mergeProps, useFocusRing, useHover, useTableRow } from "react-aria";
import { TableState } from "react-stately";
import { classNames } from "../utilities/css";

import styles from "./DataGrid.module.scss";

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
  const { isHovered, hoverProps } = useHover({});
  const className = classNames(
    styles.row,
    isHovered && styles.rowHovered,
    isFocusVisible && styles.rowFocused,
    isSelected && styles.rowSelected,
    isPressed && styles.rowPressed,
  );
  return (
    <div
      className={className}
      {...mergeProps(rowProps, focusProps, hoverProps)}
      ref={ref}
    >
      {children}
    </div>
  );
}
