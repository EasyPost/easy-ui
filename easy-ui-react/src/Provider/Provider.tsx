import React, { ReactElement } from "react";
import { RootThemeProvider, ThemeColorSchemeProvider } from "../Theme";

import "../styles/global.scss";

export interface ProviderProps {
  children: ReactElement;
  themeColorSchemeProvider?: ThemeColorSchemeProvider;
}

export function Provider({
  children,
  themeColorSchemeProvider,
}: ProviderProps) {
  return (
    <RootThemeProvider colorSchemeProvider={themeColorSchemeProvider}>
      {children}
    </RootThemeProvider>
  );
}
