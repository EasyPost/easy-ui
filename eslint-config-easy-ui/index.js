/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["turbo"],
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    node: true,
    browser: true,
  },
  overrides: [
    {
      files: ["**/*.js", "**/*.mjs", "**/*.jsx"],
      extends: ["eslint:recommended"],
      parserOptions: {
        ecmaVersion: "2021",
        sourceType: "module",
      },
    },
    {
      files: ["**/*.ts", "**/*.tsx"],
      extends: ["plugin:@typescript-eslint/recommended"],
      plugins: ["@typescript-eslint"],
      parser: "@typescript-eslint/parser",
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
          },
        ],
      },
    },
  ],
};
