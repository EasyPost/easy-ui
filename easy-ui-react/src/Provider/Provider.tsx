import React, { ReactElement } from "react";
import { ColorScheme, ThemeFunction, ThemeProvider } from "../Theme";

import "../styles/global.scss";

export interface ProviderProps {
  children: ReactElement;
  theme?: ThemeFunction;
  colorScheme?: ColorScheme;
}

export function Provider({ children, theme, colorScheme }: ProviderProps) {
  return (
    <ThemeProvider theme={theme} colorScheme={colorScheme}>
      {children}
    </ThemeProvider>
  );
}
