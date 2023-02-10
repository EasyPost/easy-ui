# Easy UI Tokens

[Design tokens](https://github.com/EasyPost/easy-ui/blob/main/documentation/decisions/004_design_tokens.md) for [Easy UI](https://github.com/EasyPost/easy-ui), EasyPost's design system.

Easy UI Tokens uses [Style Dictionary](https://amzn.github.io/style-dictionary) as its organizational paradigm and build tool. It transpiles JSON configuration values to platform-specific variables.

## Commands

| **Command** | **Runs**
| `npm run build` | Builds Easy UI design tokens

## Usage

### JavaScript

Accessing all available tokens:

```js
import tokens from "@easypost/easy-ui-tokens";
console.log(tokens["color-blue-100"]);
```

### CSS

Importing all of the css variables. CSS variables are prefixed with `--ezui` to signal that these variables are Easy UI variables.

```js
import '@easypost/easy-ui-tokens/css/styles.css';

div {
  background: var(--ezui-color-blue-100);
}
```

### JSON

Accessing all available tokens:

```js
const tokens = require("@easypost/easy-ui-tokens/json/tokens.json");
```
