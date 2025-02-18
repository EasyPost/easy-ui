import React, { ReactNode } from "react";
import { Text } from "../Text";

import styles from "./DataGrid.module.scss";

type VisuallyHiddenCellContentProps = {
  children: ReactNode;
};

export function VisuallyHiddenCellContent({
  children,
}: VisuallyHiddenCellContentProps) {
  return (
    <span className={styles.visuallyHiddenCellContainer}>
      <Text visuallyHidden>{children}</Text>
    </span>
  );
}
