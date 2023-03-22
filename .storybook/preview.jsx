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

const ezuiTheme = createTheme(({ colorScheme }) => ({
  "color.text": `var(--ezui-theme-${colorScheme}-color-text)`,
  "color.background": `var(--ezui-theme-${colorScheme}-color-background)`,
}));

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
