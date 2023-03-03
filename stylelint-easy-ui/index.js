/** @type {import('stylelint').Config} */
module.exports = {
  extends: [
    "stylelint-config-recommended-scss",
    "stylelint-prettier/recommended",
  ],
  rules: {
    "scss/comment-no-empty": false,
  },
};
