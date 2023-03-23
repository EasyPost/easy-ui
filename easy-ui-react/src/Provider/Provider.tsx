import React, { ReactElement } from "react";
import { ThemeProvider } from "../Theme";
import type { ColorScheme, ThemeCreator } from "../Theme";

import "../styles/global.scss";

export interface ProviderProps {
  children: ReactElement;
  theme?: ThemeCreator;
  colorScheme?: ColorScheme;
}

export function Provider({ children, theme, colorScheme }: ProviderProps) {
  return (
    <ThemeProvider theme={theme} colorScheme={colorScheme}>
      {children}
    </ThemeProvider>
  );
}
