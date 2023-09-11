import { GridNode } from "@react-types/grid";
import React, { Key, useRef } from "react";
import { useTableCell, useTableSelectionCheckbox } from "react-aria";
import { TableState } from "react-stately";
import { Checkbox } from "../Checkbox";
import { classNames } from "../utilities/css";
import { useDataGridTable } from "./context";

import styles from "./Cell.module.scss";

type SelectCellProps<T = unknown> = {
  cell: GridNode<T>;
  state: TableState<T>;
};

export function SelectCell({ cell, state }: SelectCellProps) {
  const table = useDataGridTable();
  const ref = useRef(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { checkboxProps } = useTableSelectionCheckbox(
    { key: cell.parentKey as Key },
    state,
  );
  const className = classNames(
    styles.Cell,
    table.isLeftEdgeUnderScroll && styles.leftEdgeUnderScroll,
    table.isRightEdgeUnderScroll && styles.rightEdgeUnderScroll,
    table.hasRowActions && styles.hasEndMatter,
    (table.hasSelection || table.hasExpansion) && styles.hasStartMatter,
  );
  return (
    <div ref={ref} {...gridCellProps} className={className}>
      <Checkbox {...checkboxProps} />
    </div>
  );
}
