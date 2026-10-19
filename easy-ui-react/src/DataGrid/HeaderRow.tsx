import React, { ReactNode, useRef } from "react";
import { useTableHeaderRow } from "react-aria";
import { TableState, Node } from "react-stately";

import styles from "./Row.module.scss";

type HeaderRowProps<T = unknown> = {
  item: Node<T>;
  state: TableState<T>;
  children: ReactNode;
};

export function HeaderRow({ item, state, children }: HeaderRowProps) {
  const ref = useRef(null);
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref);
  return (
    <tr {...rowProps} ref={ref} className={styles.Row}>
      {children}
    </tr>
  );
}
