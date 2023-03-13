import React from "react";
import { Provider as EasyUIProvider } from "../easy-ui-react/src/Provider";
import { createTheme } from "../easy-ui-react/src/Theme";
import { backgrounds, gridCellSize, theme } from "./theme";
import { viewports } from "./viewports";

import "./poppins.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      date: /Date$/,
    },
  },
  viewport: {
    viewports,
  },
  docs: {
    theme,
  },
  backgrounds: {
    values: Object.entries(backgrounds).map(([name, value]) => ({
      name,
      value,
    })),
  },
  grid: {
    cellSize: gridCellSize,
  },
};

export const decorators = [
  (Story, context) => {
    const background = context.globals.backgrounds?.value;
    const theme = createTheme({
      light: {
        textColor: "var(--ezui-theme-base-text-color)",
        backgroundColor: "var(--ezui-theme-base-background-color)",
      },
      dark: {
        textColor: "var(--ezui-theme-dark-text-color)",
        backgroundColor: "var(--ezui-theme-dark-background-color)",
      },
    });
    return (
      <EasyUIProvider
        theme={theme}
        colorScheme={background === "#1c222d" ? "dark" : "light"}
      >
        <Story />
      </EasyUIProvider>
    );
  },
];
