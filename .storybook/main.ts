import { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],

  docs: {},

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  staticDirs: ["./public"],

  stories: [
    "../easy-ui-react/src/**/*.mdx",
    "../easy-ui-react/src/**/*.stories.tsx",
  ],

  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(config, {
      css: {
        preprocessorOptions: {
          scss: {
            silenceDeprecations: ["legacy-js-api"],
          },
        },
      },
    });
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
