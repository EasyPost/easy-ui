import React from "react";
import { Provider as EasyUIProvider } from "@easypost/easy-ui/src/components/Provider";

import "./poppins.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <EasyUIProvider>
      <Story />
    </EasyUIProvider>
  ),
];
