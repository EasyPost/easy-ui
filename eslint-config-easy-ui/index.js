module.exports = {
  extends: [
    "turbo",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: "2021",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    node: true,
    browser: true,
  },
};
