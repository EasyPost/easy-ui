import React, { useLayoutEffect } from "react";
import { Provider as EasyUIProvider } from "../easy-ui-react/src/Provider";
import { useTheme } from "../easy-ui-react/src/Theme";

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
    return (
      <EasyUIProvider
        themeColorSchemeProvider={createColorSchemeProvider(context)}
      >
        <Story />
      </EasyUIProvider>
    );
  },
];

// Direct our theme to read the color scheme from the Storybook backgrounds
// control instead of from the browser preference
function createColorSchemeProvider(context) {
  const background = context.globals.backgrounds?.value;
  // eslint-disable-next-line react/prop-types
  function ColorSchemeProvider({ children }) {
    const [, setTheme] = useTheme();
    useLayoutEffect(() => {
      setTheme(background === "#333333" ? "dark" : "base");
    }, [setTheme]);
    return <>{children}</>;
  }
  return ColorSchemeProvider;
}
