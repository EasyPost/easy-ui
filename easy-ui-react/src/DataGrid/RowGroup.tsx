import React, { ReactNode } from "react";
import { useTableRowGroup } from "react-aria";

import styles from "./DataGrid.module.scss";

type RowGroupProps = {
  as?: "div" | "thead" | "tbody";
  children: ReactNode;
};

export function RowGroup({ as: As = "div", children }: RowGroupProps) {
  const { rowGroupProps } = useTableRowGroup();
  return (
    <As
      {...rowGroupProps}
      className={styles.contents}
      style={
        As === "thead"
          ? { borderBottom: "2px solid var(--spectrum-global-color-gray-800)" }
          : {}
      }
    >
      {children}
    </As>
  );
}
