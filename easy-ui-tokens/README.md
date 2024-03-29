# Easy UI Tokens

[Design tokens](https://github.com/EasyPost/easy-ui/blob/main/documentation/decisions/004_design_tokens.md) for [Easy UI](https://github.com/EasyPost/easy-ui), EasyPost's design system.

Easy UI Tokens uses [Style Dictionary](https://amzn.github.io/style-dictionary) as its organizational paradigm and build tool. It transpiles JSON configuration values to platform-specific variables.

## Usage

### JavaScript

```js
import tokens from "@easypost/easy-ui-tokens/js/tokens.js";

console.log(tokens["color-blue-100"]);
```

### CSS

```js
import '@easypost/easy-ui-tokens/css/variables.css';

div {
  background: var(--ezui-color-blue-100);
}
```

CSS variables are prefixed with `--ezui` to signal that these variables are Easy UI variables.

### SCSS

```scss
@import "@easypost/easy-ui-tokens/scss/variables.scss";

div {
  background: $ezui-color-blue-100;
}

// Map:
@import "@easypost/easy-ui-tokens/scss/map.scss";

div {
  background: map-get($ezui-tokens, "color-blue-100");
}
```

SCSS variables are prefixed with `$ezui` to signal that these variables are Easy UI variables.

### JSON

```js
const tokens = require("@easypost/easy-ui-tokens/json/tokens.json");

console.log(tokens["color-blue-100"]);
```

## Development

### Commands

| Command         | Runs                                         |
| :-------------- | :------------------------------------------- |
| `npm run build` | Builds Easy UI design tokens                 |
| `npm run clean` | Removes temp directories                     |
| `npm run dev`   | Builds Easy UI design tokens on file changes |
