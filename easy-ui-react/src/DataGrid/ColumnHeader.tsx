import { GridNode } from "@react-types/grid";
import React, { useRef } from "react";
import { mergeProps, useFocusRing, useTableColumnHeader } from "react-aria";
import { TableState } from "react-stately";
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
    table.hasRowActions && styles.hasEndMatter,
    (table.hasSelection || table.hasExpansion) && styles.hasStartMatter,
  );
  return (
    <div
      ref={ref}
      {...mergeProps(columnHeaderProps, focusProps)}
      className={className}
      data-ezui-data-grid-column-header="true"
    >
      {column.rendered}
      {column.props.allowsSorting && (
        <SortIndicator
          isColumnSorted={state.sortDescriptor?.column === column.key}
          sortDirection={state.sortDescriptor?.direction}
        />
      )}
    </div>
  );
}
