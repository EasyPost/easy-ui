const { fixupPluginRules } = require("@eslint/compat");
const js = require("@eslint/js");
const prettierRecommended = require("eslint-plugin-prettier/recommended");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const turbo = require("eslint-plugin-turbo");
const globals = require("globals");
const tseslint = require("typescript-eslint");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    ...react.configs.flat.recommended,
    plugins: {
      // eslint-plugin-react 7.x still calls context APIs that ESLint 10
      // removed (e.g. context.getFilename), so shim them until it supports v10
      // https://github.com/jsx-eslint/eslint-plugin-react/issues/3977
      react: fixupPluginRules(react),
      "react-hooks": reactHooks,
      turbo,
    },
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      // Matches the eslint-plugin-react-hooks v5 recommended set. The React
      // Compiler rules added to v7's recommended config are not enabled yet.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx}"],
  })),
  {
    files: ["**/*.{ts,tsx}"],
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
  prettierRecommended,
];
