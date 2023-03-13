import React from "react";
import { Provider as EasyUIProvider } from "../easy-ui-react/src/Provider";
import { createTheme } from "../easy-ui-react/src/Theme";

import "./poppins.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story, context) => {
    const background = context.globals.backgrounds?.value;
    const theme = createTheme({
      light: {
        textColor: "hsl(320, 30%, 20%)",
        backgroundColor: "hsl(320, 30%, 90%)",
      },
      dark: {
        textColor: "hsl(320, 30%, 90%)",
        backgroundColor: "hsl(320, 30%, 20%)",
      },
    });
    return (
      <EasyUIProvider
        theme={theme}
        colorScheme={background === "#333333" ? "dark" : "light"}
      >
        <Story />
      </EasyUIProvider>
    );
  },
];
