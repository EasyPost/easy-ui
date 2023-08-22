import { GridNode } from "@react-types/grid";
import React, { forwardRef, useRef } from "react";
import { mergeProps, useFocusRing, useTableCell } from "react-aria";
import { TableState } from "react-stately";
import { classNames } from "../utilities/css";

import styles from "./DataGrid.module.scss";
import { mergeRefs } from "@react-aria/utils";

type CellProps<T = unknown> = {
  cell: GridNode<T>;
  state: TableState<T>;
};

export const Cell = forwardRef<null, CellProps>(({ cell, state }, inRef) => {
  const ref = useRef(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const className = classNames(
    styles.cell,
    isFocusVisible && styles.cellFocused,
  );
  return (
    <div
      className={className}
      {...mergeProps(gridCellProps, focusProps)}
      ref={mergeRefs(ref, inRef)}
    >
      {cell.rendered}
    </div>
  );
});

Cell.displayName = "Cell";
