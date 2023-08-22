import { GridNode } from "@react-types/grid";
import React, { useRef } from "react";
import {
  VisuallyHidden,
  useTableColumnHeader,
  useTableSelectAllCheckbox,
} from "react-aria";
import { TableState } from "react-stately";
import { Checkbox } from "../Checkbox";
import { classNames } from "../utilities/css";

import styles from "./DataGrid.module.scss";

type SelectAllColumnHeaderProps<T = unknown> = {
  column: GridNode<T>;
  state: TableState<T>;
};

export function SelectAllColumnHeader({
  column,
  state,
}: SelectAllColumnHeaderProps) {
  const ref = useRef(null);
  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref,
  );
  const { checkboxProps } = useTableSelectAllCheckbox(state);
  const className = classNames(styles.columnHeader);
  return (
    <div {...columnHeaderProps} ref={ref} className={className}>
      {state.selectionManager.selectionMode === "single" ? (
        <VisuallyHidden>{checkboxProps["aria-label"]}</VisuallyHidden>
      ) : (
        <Checkbox size="lg" {...checkboxProps} />
      )}
    </div>
  );
}
