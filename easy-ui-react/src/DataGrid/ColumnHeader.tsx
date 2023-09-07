import { GridNode } from "@react-types/grid";
import React, { useRef } from "react";
import { mergeProps, useFocusRing, useTableColumnHeader } from "react-aria";
import { TableState } from "react-stately";
import { classNames } from "../utilities/css";
import { SortIndicator } from "./SortIndicator";

import styles from "./DataGrid.module.scss";

type ColumnHeaderProps<T = unknown> = {
  column: GridNode<T>;
  state: TableState<T>;
};

export function ColumnHeader({ column, state }: ColumnHeaderProps) {
  const ref = useRef(null);
  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref,
  );
  const { isFocusVisible, focusProps } = useFocusRing();
  const className = classNames(
    styles.columnHeader,
    isFocusVisible && styles.columnHeaderFocused,
    column.props.allowsSorting && styles.columnHeaderAllowsSorting,
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
