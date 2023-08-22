import { Node } from "@react-types/shared";
import React, { ReactNode, useRef } from "react";
import { useTableHeaderRow } from "react-aria";
import { TableState } from "react-stately";

import styles from "./DataGrid.module.scss";

type HeaderRowProps<T = unknown> = {
  item: Node<T>;
  state: TableState<T>;
  children: ReactNode;
};

export function HeaderRow({ item, state, children }: HeaderRowProps) {
  const ref = useRef(null);
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref);
  return (
    <div {...rowProps} ref={ref} className={styles.contents}>
      {children}
    </div>
  );
}
