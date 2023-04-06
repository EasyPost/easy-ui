import { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-a11y",
    "@storybook/addon-essentials",
  ],
  docs: {
    autodocs: true,
  },
  features: {
    storyStoreV7: true,
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["./public"],
  stories: [
    "../easy-ui-react/src/**/*.mdx",
    "../easy-ui-react/src/**/*.stories.tsx",
  ],
};

export default config;
