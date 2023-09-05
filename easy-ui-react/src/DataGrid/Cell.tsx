import { GridNode } from "@react-types/grid";
import React, { useRef } from "react";
import { mergeProps, useFocusRing, useTableCell } from "react-aria";
import { TableState } from "react-stately";
import { classNames } from "../utilities/css";

import styles from "./DataGrid.module.scss";

type CellProps<T = unknown> = {
  cell: GridNode<T>;
  state: TableState<T>;
};

export function Cell({ cell, state }: CellProps) {
  const ref = useRef(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const className = classNames(
    styles.cell,
    isFocusVisible && styles.cellFocused,
  );
  return (
    <div
      ref={ref}
      className={className}
      {...mergeProps(gridCellProps, focusProps)}
    >
      {cell.rendered}
    </div>
  );
}
