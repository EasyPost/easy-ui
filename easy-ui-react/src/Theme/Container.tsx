import React, { ReactNode } from "react";
import { ThemeProvider } from "./Theme";

import styles from "./Container.module.scss";

export type ContainerProps = {
  children: ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <ThemeProvider colorScheme="inverted">
      <div className={styles.Container}>{children}</div>
    </ThemeProvider>
  );
}
