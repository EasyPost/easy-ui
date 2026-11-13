import eslintReact from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import turbo from "eslint-plugin-turbo";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    ...eslintReact.configs.recommended,
    plugins: {
      ...eslintReact.configs.recommended.plugins,
      "react-hooks": reactHooks,
      turbo,
    },
    languageOptions: {
      ...eslintReact.configs.recommended.languageOptions,
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      ...eslintReact.configs.recommended.rules,
      // Hooks rules come from eslint-plugin-react-hooks below, so turn off
      // @eslint-react's ports of them to avoid duplicate reports.
      "@eslint-react/rules-of-hooks": "off",
      "@eslint-react/exhaustive-deps": "off",
      // Ports of the React Compiler rules. Not enabled yet, matching the
      // react-hooks setup below.
      "@eslint-react/error-boundaries": "off",
      "@eslint-react/purity": "off",
      "@eslint-react/set-state-in-effect": "off",
      "@eslint-react/set-state-in-render": "off",
      "@eslint-react/static-components": "off",
      "@eslint-react/unsupported-syntax": "off",
      "@eslint-react/use-memo": "off",
      // These push React 19-only APIs, but the peer range reaches back to
      // React 16.14.
      "@eslint-react/no-context-provider": "off",
      "@eslint-react/no-forward-ref": "off",
      "@eslint-react/no-use-context": "off",
      // Trigger and slot components (Modal, Drawer, Tooltip, Popover, etc.)
      // inject props into consumer-provided children by design.
      "@eslint-react/no-children-to-array": "off",
      "@eslint-react/no-clone-element": "off",
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
