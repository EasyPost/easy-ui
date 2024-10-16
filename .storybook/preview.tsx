import React from "react";
import { Preview } from "@storybook/react";
import { Provider as EasyUIProvider } from "../easy-ui-react/src/Provider";
import { backgrounds, gridCellSize, theme } from "./theme";
import { viewports } from "./viewports";

const preview: Preview = {
  parameters: {
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
      grid: {
        cellSize: gridCellSize,
        opacity: 0.25,
      },
    },
    options: {
      storySort: {
        order: [
          "Getting Started",
          "Changelog",
          "Contributing",
          "Primitives",
          "Components",
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const background = context.globals.backgrounds?.value;
      return (
        <EasyUIProvider
          navigate={(path, routerOptions) => {
            console.log("path", path);
            console.log("routerOptions", routerOptions);
          }}
          colorScheme={background === "#1c222d" ? "dark" : "light"}
        >
          <Story />
        </EasyUIProvider>
      );
    },
  ],
};

export default preview;
