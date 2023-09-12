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
import { classNames } from "../utilities/css";
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
  const className = classNames(
    styles.ColumnHeader,
    isFocusVisible && styles.focused,
    column.props.allowsSorting && styles.allowsSorting,
    table.isTopEdgeUnderScroll && styles.topEdgeUnderScroll,
    table.isLeftEdgeUnderScroll && styles.leftEdgeUnderScroll,
    table.isRightEdgeUnderScroll && styles.rightEdgeUnderScroll,
    table.hasRowActions && styles.hasEndMatter,
    (table.hasSelection || table.hasExpansion) && styles.hasStartMatter,
  );
  const ColumnHeaderContentComponent = column.props.isSelectionCell
    ? SelectAllColumnHeaderContent
    : DefaultColumnHeaderContent;
  return (
    <div
      ref={ref}
      {...mergeProps(columnHeaderProps, focusProps)}
      className={className}
      data-ezui-data-grid-column-header="true"
    >
      <ColumnHeaderContentComponent column={column} state={state} />
      <div data-ezui-data-grid-shadow="bottom" />
      <div data-ezui-data-grid-shadow="side" />
    </div>
  );
}

function DefaultColumnHeaderContent({ column, state }: ColumnHeaderProps) {
  return (
    <>
      {column.rendered}
      {column.props.allowsSorting && (
        <SortIndicator
          isColumnSorted={state.sortDescriptor?.column === column.key}
          sortDirection={state.sortDescriptor?.direction}
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
