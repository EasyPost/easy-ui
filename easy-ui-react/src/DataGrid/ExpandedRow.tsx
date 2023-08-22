import React, { ReactNode } from "react";

import styles from "./DataGrid.module.scss";

type ExpandedRowProps = {
  children: ReactNode;
};

export function ExpandedRow({ children }: ExpandedRowProps) {
  return (
    <div className={styles.expandedRow} data-expanded-row="true">
      <div>{children}</div>
    </div>
  );
}
