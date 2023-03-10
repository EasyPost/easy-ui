import React, { ReactNode } from "react";
import { ChildThemeProvider, useTheme } from "./Theme";

import styles from "./Container.module.scss";

export type ContainerProps = {
  children: ReactNode;
};

// An example theme-aware container
// It references it's parent theme to know if it needs to invert itself
export function Container({ children }: ContainerProps) {
  const [theme] = useTheme();
  return (
    <ChildThemeProvider theme={theme === "base" ? "dark" : "base"}>
      {(vars) => (
        <div className={styles.Container} style={vars}>
          {children}
        </div>
      )}
    </ChildThemeProvider>
  );
}
