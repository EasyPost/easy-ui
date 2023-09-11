import React, { ReactNode } from "react";
import { classNames } from "../utilities/css";

import styles from "./ExpandedRowContent.module.scss";

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
        styles.ExpandedRowContent,
        isPending ? styles.pending : styles.active,
      )}
      data-ezui-data-grid-expanded-row-content={
        isPending ? "pending" : "active"
      }
    >
      <div>{children}</div>
    </div>
  );
}
