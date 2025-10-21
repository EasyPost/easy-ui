import { action } from "storybook/actions";
import { Preview } from "@storybook/react-vite";
import React from "react";
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
      options: viewports,
    },
    docs: {
      theme,
    },
    backgrounds: {
      grid: {
        cellSize: gridCellSize,
        opacity: 0.25,
      },
      options: Object.entries(backgrounds).map(([name, value]) => ({
        name,
        value,
      })),
    },
    options: {
      storySort: {
        order: [
          "Getting Started",
          "Changelog",
          "Contributing",
          "Browser Support",
          "Foundations",
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
          navigate={action("Navigation")}
          colorScheme={background === "#1c222d" ? "dark" : "light"}
        >
          <Story />
        </EasyUIProvider>
      );
    },
  ],

  tags: ["autodocs"],
};

export default preview;
