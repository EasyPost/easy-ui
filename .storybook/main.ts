import { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
  addons: [
    "@storybook/addon-a11y",
    {
      name: "@storybook/addon-docs",
      options: {
        // Storybook's MDX pipeline is plain CommonMark, so GitHub-flavored
        // syntax—tables above all—renders as literal pipes on the page. Every
        // other Markdown surface we write (specs, READMEs, PR bodies) is GFM,
        // so docs authors reasonably expect tables to work here too.
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],

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

    // Point docgen at the library's own tsconfig rather than the root one. The
    // root config is solution-style — `files: []` plus a reference to
    // ./easy-ui-react — so docgen resolved components through the emitted
    // `dist/**/*.d.ts` whenever a build was present, and every `forwardRef`
    // component came back with no props at all. `<Box />` showed it first
    // because it has no hand-written argTypes to fall back on.
    reactDocgenTypescriptOptions: {
      tsconfigPath: "easy-ui-react/tsconfig.json",
    },
  },
};

export default config;
