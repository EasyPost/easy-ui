import { dirname, join } from "path";
import { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  addons: [
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-a11y"),
  ],
  docs: {
    autodocs: true,
  },
  features: {
    storyStoreV7: true,
  },
  framework: {
    name: getAbsolutePath("@storybook/react-vite") as "@storybook/react-vite",
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
};

export default config;

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}
