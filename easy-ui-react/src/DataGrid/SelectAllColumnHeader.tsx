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
import { useDataGridTable } from "./context";

import styles from "./ColumnHeader.module.scss";

type SelectAllColumnHeaderProps<T = unknown> = {
  column: GridNode<T>;
  state: TableState<T>;
};

export function SelectAllColumnHeader({
  column,
  state,
}: SelectAllColumnHeaderProps) {
  const table = useDataGridTable();
  const ref = useRef(null);
  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref,
  );
  const { checkboxProps } = useTableSelectAllCheckbox(state);
  const className = classNames(
    styles.ColumnHeader,
    table.isTopEdgeUnderScroll && styles.topEdgeUnderScroll,
    table.hasRowActions && styles.hasEndMatter,
    (table.hasSelection || table.hasExpansion) && styles.hasStartMatter,
  );
  return (
    <div ref={ref} {...columnHeaderProps} className={className}>
      {state.selectionManager.selectionMode === "single" ? (
        <VisuallyHidden>{checkboxProps["aria-label"]}</VisuallyHidden>
      ) : (
        <Checkbox {...checkboxProps} />
      )}
    </div>
  );
}
