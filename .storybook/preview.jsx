import React from "react";
import { Provider as EasyUIProvider } from "../easy-ui-react/src/Provider";
import { backgrounds, gridCellSize, theme } from "./theme";
import { viewports } from "./viewports";

import "./poppins.css";
import { createTheme } from "../easy-ui-react/src/Theme";

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

const ezuiTheme = createTheme(({ colorScheme }) => {
  const color = colorScheme === "dark" ? "dark" : "base";
  return {
    "color.text": `var(--ezui-theme-${color}-color-text)`,
    "color.background": `var(--ezui-theme-${color}-color-background)`,
  };
});

export const decorators = [
  (Story, context) => {
    const background = context.globals.backgrounds?.value;
    return (
      <EasyUIProvider
        theme={ezuiTheme}
        colorScheme={background === "#1c222d" ? "dark" : "light"}
      >
        <Story />
      </EasyUIProvider>
    );
  },
];
