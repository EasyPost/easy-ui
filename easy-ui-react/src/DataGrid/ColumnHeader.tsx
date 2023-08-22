import { GridNode } from "@react-types/grid";
import React, { useRef } from "react";
import { mergeProps, useFocusRing, useTableColumnHeader } from "react-aria";
import { TableState } from "react-stately";

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
  const arrowIcon = state.sortDescriptor?.direction === "ascending" ? "▲" : "▼";
  return (
    <div
      {...mergeProps(columnHeaderProps, focusProps)}
      data-colSpan={column.colspan}
      style={{
        textAlign: column.colspan && column.colspan > 1 ? "center" : "left",
        padding: "5px 10px",
        outline: "none",
        boxShadow: isFocusVisible ? "inset 0 0 0 2px orange" : "none",
        cursor: "default",
      }}
      ref={ref}
    >
      {column.rendered}
      {column.props.allowsSorting && (
        <span
          aria-hidden="true"
          style={{
            padding: "0 2px",
            visibility:
              state.sortDescriptor?.column === column.key
                ? "visible"
                : "hidden",
          }}
        >
          {arrowIcon}
        </span>
      )}
    </div>
  );
}
