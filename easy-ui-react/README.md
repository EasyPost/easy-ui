# Easy UI React

Easy UI React is a component library designed to help developers create the best experience for shippers who use EasyPost.

## Installation

Run the following command using [npm](https://www.npmjs.com/):

```bash
npm install @easypost/easy-ui --save
```

## Usage

1. EasyUI uses Poppins as its primary font. Include Poppins and its declarations in your setup. You can host it yourself or use Google Fonts. All fonts are included in `.storybook/public/fonts/poppins` for self-hosting.

```css
@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/poppins/poppins-v20-latin-400.woff2") format("woff2"), url("/fonts/poppins/poppins-v20-latin-400.woff")
      format("woff");
}

@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/fonts/poppins/poppins-v20-latin-500.woff2") format("woff2"), url("/fonts/poppins/poppins-v20-latin-500.woff")
      format("woff");
}

@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/fonts/poppins/poppins-v20-latin-600.woff2") format("woff2"), url("/fonts/poppins/poppins-v20-latin-600.woff")
      format("woff");
}

@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/fonts/poppins/poppins-v20-latin-700.woff2") format("woff2"), url("/fonts/poppins/poppins-v20-latin-700.woff")
      format("woff");
}
```

2.  Import the CSS directly into your project if your asset packager supports it:

```js
import "@easypost/easy-ui/styles.css";
```

3.  Include the provider and any relevant components in your project:

```js
import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";
```

4.  Tell React to render the element in the DOM:

```js
ReactDOM.render(
  <EasyUIProvider>
    <div>
      {/* More to come */}
    </div>
  </AppProvider>,
  document.querySelector("#app"),
);
```

## Development

We use Storybook to create a simple, hot-reloading playground for development on these components.

### Commands

| Command              | Runs                                            |
| :------------------- | :---------------------------------------------- |
| `npm run build`      | Builds the project                              |
| `npm run clean`      | Removes temp directories                        |
| `npm run lint`       | Lints the project (ESLint, Stylelint, Prettier) |
| `npm run test`       | Tests the project                               |
| `npm run test:watch` | Tests the project in watch mod                  |
