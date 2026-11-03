// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import easyUi from "@easypost/eslint-config-easy-ui";

export default [
  {
    ignores: [
      "**/node_modules",
      "**/dist",
      "storybook-static",
      "!**/.storybook",
    ],
  },
  ...easyUi,
  ...storybook.configs["flat/recommended"],
];
