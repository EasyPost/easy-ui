import { GridNode } from "@react-types/grid";
import React, { useRef } from "react";
import {
  VisuallyHidden,
  mergeProps,
  useFocusRing,
  useTableColumnHeader,
  useTableSelectAllCheckbox,
} from "react-aria";
import { TableState } from "react-stately";
import { Checkbox } from "../Checkbox";
import { classNames, variationName } from "../utilities/css";
import { SortIndicator } from "./SortIndicator";
import { useDataGridTable } from "./context";

import styles from "./ColumnHeader.module.scss";

type ColumnHeaderProps<T = unknown> = {
  column: GridNode<T>;
  state: TableState<T>;
};

export function ColumnHeader({ column, state }: ColumnHeaderProps) {
  const table = useDataGridTable();
  const ref = useRef(null);
  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref,
  );
  const { isFocusVisible, focusProps } = useFocusRing();

  const hasActionsAtStart = table.hasSelection || table.hasExpansion;
  const hasActionsAtEnd = table.hasRowActions;
  const hasRightShadow =
    table.isLeftEdgeUnderScroll &&
    (hasActionsAtStart ? column.index === 1 : column.index === 0);
  const hasLeftShadow =
    hasActionsAtEnd &&
    table.isRightEdgeUnderScroll &&
    column.index === state.collection.columnCount - 1;

  const className = classNames(
    styles.ColumnHeader,
    isFocusVisible && styles.focused,
    column.props.allowsSorting && styles.allowsSorting,
    hasRightShadow && styles[variationName("shadow", "right")],
    hasLeftShadow && styles[variationName("shadow", "left")],
    table.isTopEdgeUnderScroll && styles[variationName("shadow", "bottom")],
    column.index === 0 && styles.first,
    hasActionsAtStart && column.index === 0 && styles.firstWithActions,
    hasActionsAtStart && column.index === 1 && styles.secondWithActions,
    column.index === state.collection.columnCount - 1 && styles.last,
    hasActionsAtEnd &&
      column.index === state.collection.columnCount - 1 &&
      styles.lastWithActions,
    hasActionsAtEnd &&
      column.index === state.collection.columnCount - 2 &&
      styles.secondToLastWithActions,
  );

  const contentClassName = classNames(
    styles.content,
    column.props.allowsSorting && styles.allowsSorting,
  );

  const ColumnHeaderContentComponent = column.props.isSelectionCell
    ? SelectAllColumnHeaderContent
    : DefaultColumnHeaderContent;

  return (
    <td
      ref={ref}
      {...mergeProps(columnHeaderProps, focusProps)}
      className={className}
      data-ezui-data-grid-column-header="true"
    >
      <div className={contentClassName}>
        <ColumnHeaderContentComponent column={column} state={state} />
        <div data-ezui-data-grid-shadow="bottom" />
        <div data-ezui-data-grid-shadow="side" />
      </div>
    </td>
  );
}

function DefaultColumnHeaderContent({ column, state }: ColumnHeaderProps) {
  return (
    <>
      {column.rendered}
      {column.props.allowsSorting && (
        <SortIndicator
          sortDirection={
            state.sortDescriptor?.column === column.key
              ? state.sortDescriptor?.direction
              : undefined
          }
        />
      )}
    </>
  );
}

function SelectAllColumnHeaderContent({ state }: ColumnHeaderProps) {
  const { checkboxProps } = useTableSelectAllCheckbox(state);
  if (state.selectionManager.selectionMode === "single") {
    return <VisuallyHidden>{checkboxProps["aria-label"]}</VisuallyHidden>;
  }
  return <Checkbox {...checkboxProps} />;
}
