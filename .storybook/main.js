/** @type {import('@storybook/react/types').StorybookConfig} */
module.exports = {
  stories: ["../easy-ui-react/src/**/*.stories.mdx"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  features: {
    storyStoreV7: true,
  },
  staticDirs: ["./public"],
  docs: {
    autodocs: true,
  },
};
