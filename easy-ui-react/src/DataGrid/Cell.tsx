import { GridNode } from "@react-types/grid";
import React, { Key, useRef } from "react";
import {
  mergeProps,
  useFocusRing,
  useTableCell,
  useTableSelectionCheckbox,
} from "react-aria";
import { TableState } from "react-stately";
import { Checkbox } from "../Checkbox";
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
  const CellContentComponent = cell.props.isSelectionCell
    ? SelectCellContent
    : DefaultCellContent;
  return (
    <div
      {...mergeProps(gridCellProps, focusProps)}
      ref={ref}
      className={className}
    >
      <CellContentComponent cell={cell} state={state} />
      <div data-ezui-data-grid-shadow />
    </div>
  );
}

function DefaultCellContent({ cell }: CellProps) {
  return <>{cell.rendered}</>;
}

function SelectCellContent({ cell, state }: CellProps) {
  const { checkboxProps } = useTableSelectionCheckbox(
    { key: cell.parentKey as Key },
    state,
  );
  return <Checkbox {...checkboxProps} />;
}
