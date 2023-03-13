import React, { ReactNode } from "react";
import { ColorSchemeProvider, useColorScheme } from "./Theme";

import styles from "./Container.module.scss";

export type ContainerProps = {
  children: ReactNode;
};

// An example theme-aware container
// It references it's parent theme to know if it needs to invert itself
export function Container({ children }: ContainerProps) {
  const [colorScheme] = useColorScheme();
  return (
    <ColorSchemeProvider mode={colorScheme === "light" ? "dark" : "light"}>
      {(style) => (
        <div className={styles.Container} style={style}>
          {children}
        </div>
      )}
    </ColorSchemeProvider>
  );
}
