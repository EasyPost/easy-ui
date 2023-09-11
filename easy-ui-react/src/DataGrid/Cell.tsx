import { GridNode } from "@react-types/grid";
import React, { useRef } from "react";
import { mergeProps, useFocusRing, useTableCell } from "react-aria";
import { TableState } from "react-stately";
import { classNames } from "../utilities/css";
import { useDataGridRow, useDataGridTable } from "./context";

import styles from "./Cell.module.scss";

type CellProps<T = unknown> = {
  cell: GridNode<T>;
  state: TableState<T>;
};

export function Cell({ cell, state }: CellProps) {
  const table = useDataGridTable();
  const row = useDataGridRow();
  const ref = useRef(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const className = classNames(
    styles.Cell,
    isFocusVisible && styles.focused,
    row.isExpanded && styles.expanded,
    table.isLeftEdgeUnderScroll && styles.leftEdgeUnderScroll,
    table.isRightEdgeUnderScroll && styles.rightEdgeUnderScroll,
    table.hasRowActions && styles.hasEndMatter,
    (table.hasSelection || table.hasExpansion) && styles.hasStartMatter,
  );
  return (
    <div
      {...mergeProps(gridCellProps, focusProps)}
      ref={ref}
      className={className}
    >
      {cell.rendered}
    </div>
  );
}
