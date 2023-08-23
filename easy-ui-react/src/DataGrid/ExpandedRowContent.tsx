import React, { ReactNode } from "react";

import styles from "./DataGrid.module.scss";

type ExpandedRowContentProps = {
  children: ReactNode;
};

export function ExpandedRowContent({ children }: ExpandedRowContentProps) {
  return (
    <div
      className={styles.expandedRowContent}
      data-ezui-expanded-row-content="true"
    >
      <div>{children}</div>
    </div>
  );
}
