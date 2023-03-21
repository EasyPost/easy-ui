/** @type {import('stylelint').Config} */
module.exports = {
  extends: [
    "stylelint-config-recommended-scss",
    "stylelint-prettier/recommended",
  ],
  rules: {
    "scss/comment-no-empty": null,
    "scss/at-extend-no-missing-placeholder": null,
    "scss/dollar-variable-pattern": [/^ezui-/, { ignore: "local" }],
  },
};
