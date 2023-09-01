import React, { ReactNode } from "react";
import { classNames } from "../utilities/css";

import styles from "./DataGrid.module.scss";

type ExpandedRowContentProps = {
  children: ReactNode;
  isPending?: boolean;
};

export function ExpandedRowContent({
  children,
  isPending,
}: ExpandedRowContentProps) {
  return (
    <div
      className={classNames(
        styles.expandedRowContent,
        isPending ? styles.pendingExpandedRowContent : null,
      )}
      data-ezui-expanded-row-content={isPending ? "pending" : "base"}
    >
      <div>{children}</div>
    </div>
  );
}
