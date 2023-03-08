import React from "react";
import { Provider as EasyUIProvider } from "../easy-ui-react/src/Provider";
import { backgrounds, theme } from "./theme";
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
    values: Object.entries(backgrounds).map(([name, value]) => {
      return { name, value };
    }),
  },
};

export const decorators = [
  (Story) => (
    <EasyUIProvider>
      <Story />
    </EasyUIProvider>
  ),
];
