/** @type {import('@storybook/react/types').StorybookConfig} */
module.exports = {
  stories: ["../easy-ui-react/src/**/*.stories.mdx"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },
  staticDirs: ["./public"],
};
