import { GridNode } from "@react-types/grid";
import React, { ComponentProps, useRef } from "react";
import { mergeProps, useFocusRing, useTableColumnHeader } from "react-aria";
import { TableState } from "react-stately";
import { classNames } from "../utilities/css";

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
  );
  return (
    <div
      {...mergeProps(columnHeaderProps, focusProps)}
      className={className}
      ref={ref}
      data-col-span={column.colspan}
    >
      {column.rendered}
      {column.props.allowsSorting &&
        state.sortDescriptor?.column === column.key && (
          <span aria-hidden="true" className={styles.sortIcon}>
            {state.sortDescriptor?.column === column.key &&
            state.sortDescriptor?.direction === "ascending" ? (
              <Up />
            ) : (
              <Down />
            )}
          </span>
        )}
    </div>
  );
}

function Down(props: ComponentProps<"svg">) {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0.344238L0 0.344238L6 7.561L12 0.344238Z"
      />
    </svg>
  );
}

function Up() {
  return <Down style={{ transform: "rotate(180deg)" }} />;
}
