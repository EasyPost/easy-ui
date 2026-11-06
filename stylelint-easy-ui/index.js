/** @type {import('stylelint').Config} */
module.exports = {
  // Equivalent to extending "stylelint-prettier/recommended", which registers
  // its plugin as `plugins: ["."]`. Stylelint 18 no longer resolves
  // extension-less relative paths, so name the plugin package directly.
  extends: ["stylelint-config-recommended-scss"],
  plugins: ["stylelint-prettier"],
  rules: {
    "prettier/prettier": true,
    "scss/comment-no-empty": null,
    "scss/dollar-variable-pattern": [/^ezui-/, { ignore: "local" }],
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: ["global"] },
    ],
  },
};
