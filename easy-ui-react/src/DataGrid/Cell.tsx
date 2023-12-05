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
import { classNames, variationName } from "../utilities/css";
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

  const hasActionsAtStart = table.hasSelection || table.hasExpansion;
  const hasActionsAtEnd = table.hasRowActions;
  const hasRightShadow =
    table.isLeftEdgeUnderScroll &&
    (hasActionsAtStart ? cell.index === 1 : cell.index === 0);
  const hasLeftShadow =
    hasActionsAtEnd &&
    table.isRightEdgeUnderScroll &&
    cell.index === state.collection.columnCount - 1;

  const className = classNames(
    styles.Cell,
    isFocusVisible && styles.focused,
    row.isExpanded && styles.expanded,
    hasRightShadow && styles[variationName("shadow", "right")],
    hasLeftShadow && styles[variationName("shadow", "left")],
    cell.index === 0 && styles.first,
    hasActionsAtStart && cell.index === 0 && styles.firstWithActions,
    hasActionsAtStart && cell.index === 1 && styles.secondWithActions,
    cell.index === state.collection.columnCount - 1 && styles.last,
    hasActionsAtEnd &&
      cell.index === state.collection.columnCount - 1 &&
      styles.lastWithActions,
    hasActionsAtEnd &&
      cell.index === state.collection.columnCount - 2 &&
      styles.secondToLastWithActions,
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
