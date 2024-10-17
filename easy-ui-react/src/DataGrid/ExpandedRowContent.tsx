import React, { ReactNode } from "react";
import { classNames } from "../utilities/css";

import styles from "./ExpandedRowContent.module.scss";

type ExpandedRowContentProps = {
  children: ReactNode;
};

export function ExpandedRowContent({ children }: ExpandedRowContentProps) {
  return (
    <div
      className={classNames(styles.ExpandedRowContent)}
      data-ezui-data-grid-expanded-row-content="active"
    >
      <div className={classNames(styles.inner)}>{children}</div>
    </div>
  );
}
