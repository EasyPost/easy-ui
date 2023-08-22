import { GridNode } from "@react-types/grid";
import React, { useRef } from "react";
import { mergeProps, useFocusRing, useTableCell } from "react-aria";
import { TableState } from "react-stately";

type CellProps<T = unknown> = {
  cell: GridNode<T>;
  state: TableState<T>;
};

export function Cell({ cell, state }: CellProps) {
  const ref = useRef(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  return (
    <div
      {...mergeProps(gridCellProps, focusProps)}
      style={{
        padding: "5px 10px",
        outline: "none",
        boxShadow: isFocusVisible ? "inset 0 0 0 2px orange" : "none",
        cursor: "default",
      }}
      ref={ref}
    >
      {cell.rendered}
    </div>
  );
}
