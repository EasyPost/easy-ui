import { Node } from "@react-types/shared";
import React, { ReactNode, useRef } from "react";
import { mergeProps, useFocusRing, useHover, useTableRow } from "react-aria";
import { TableState } from "react-stately";
import { classNames } from "../utilities/css";

import styles from "./DataGrid.module.scss";
import { EXPAND_ROW_COLUMN_KEY } from "./constants";

type RowProps<T = object> = {
  item: Node<T>;
  state: TableState<T>;
  children: ReactNode;
  isExpanded: boolean;
};

export function Row({ item, children, state, isExpanded }: RowProps) {
  const isSelected = state.selectionManager.isSelected(item.key);
  const isDisabled = state.disabledKeys.has(item.key);
  const isPendingExpanded = item.value
    ? item.value[EXPAND_ROW_COLUMN_KEY as keyof typeof item.value] === true
    : false;

  const ref = useRef(null);
  const { rowProps, isPressed } = useTableRow({ node: item }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({});

  const className = classNames(
    styles.row,
    isExpanded && styles.rowExpanded,
    isHovered && styles.rowHovered,
    isFocusVisible && styles.rowFocused,
    isSelected && styles.rowSelected,
    isPressed && styles.rowPressed,
    isDisabled && styles.rowDisabled,
  );

  return (
    <div
      className={className}
      {...mergeProps(rowProps, focusProps, hoverProps)}
      ref={ref}
      data-ezui-expanded-row={isPendingExpanded}
      data-ezui-data-grid-row="true"
    >
      {children}
    </div>
  );
}
