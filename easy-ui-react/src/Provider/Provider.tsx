import React, { ReactElement } from "react";
import { ColorScheme, createTheme, Theme, ThemeProvider } from "../Theme";

import "../styles/global.scss";

export interface ProviderProps {
  children: ReactElement;
  theme?: Theme;
  colorScheme?: ColorScheme;
}

const DEFAULT_THEME = createTheme({
  light: {
    textColor: "var(--ezui-theme-base-text-color)",
    backgroundColor: "var(--ezui-theme-base-background-color)",
  },
  dark: {
    textColor: "var(--ezui-theme-dark-text-color)",
    backgroundColor: "var(--ezui-theme-dark-background-color)",
  },
});

export function Provider({
  children,
  theme = DEFAULT_THEME,
  colorScheme,
}: ProviderProps) {
  return (
    <ThemeProvider theme={theme} colorScheme={colorScheme}>
      {children}
    </ThemeProvider>
  );
}
