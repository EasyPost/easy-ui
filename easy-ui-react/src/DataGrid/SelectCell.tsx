import { GridNode } from "@react-types/grid";
import React, { Key, useRef } from "react";
import { useTableCell, useTableSelectionCheckbox } from "react-aria";
import { TableState } from "react-stately";
import { Checkbox } from "../Checkbox";

type SelectCellProps<T = unknown> = {
  cell: GridNode<T>;
  state: TableState<T>;
};

export function SelectCell({ cell, state }: SelectCellProps) {
  const ref = useRef(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { checkboxProps } = useTableSelectionCheckbox(
    { key: cell.parentKey as Key },
    state,
  );
  return (
    <div {...gridCellProps} ref={ref}>
      <Checkbox {...checkboxProps} />
    </div>
  );
}
