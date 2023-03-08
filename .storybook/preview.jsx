import React from "react";
import { Provider as EasyUIProvider } from "../easy-ui-react/src/Provider";
import { viewports } from "./viewports";
import { theme } from "./theme";

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
};

export const decorators = [
  (Story) => (
    <EasyUIProvider>
      <Story />
    </EasyUIProvider>
  ),
];
