# Easy UI

[Easy UI](https://github.com/EasyPost/easy-ui) is a component library designed to help developers create the best experience for shippers who use EasyPost.

## Getting Started

1. Install Easy UI using [npm](https://www.npmjs.com/) or your project's package manager:

```bash
npm install @easypost/easy-ui --save
```

2. Include the Easy UI CSS file in your app entry point:

```js
import "@easypost/easy-ui/style.css";
```

3. Render your app inside the Easy UI `Provider`:

```js
import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <EasyUIProvider>
    <App />
  </EasyUIProvider>,
);
```

4. Use Easy UI components:

```js
import { VerticalStack } from "@easypost/easy-ui/VerticalStack";
import { Button } from "@easypost/easy-ui/Button";

function App() {
  return (
    <VerticalStack>
      <Button>Click me!</Button>
    </VerticalStack>
  );
}
```

See our [Storybook](https://main--63f50c7c86f6514d2e0ef4be.chromatic.com/) for detailed component documentation.

### Fonts

Easy UI uses `Poppins` font. You can host it yourself or use Google Fonts. For hosting it yourself, `Poppins` is included in `.storybook/public/fonts/poppins`.

If hosting yourself, include this declaration in your stylesheets, replacing the path with wherever the fonts are located:

```css
@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src:
    url("/fonts/poppins/poppins-v20-latin-300.woff2") format("woff2"),
    url("/fonts/poppins/poppins-v20-latin-300.woff") format("woff");
}

@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src:
    url("/fonts/poppins/poppins-v20-latin-400.woff2") format("woff2"),
    url("/fonts/poppins/poppins-v20-latin-400.woff") format("woff");
}

@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src:
    url("/fonts/poppins/poppins-v20-latin-500.woff2") format("woff2"),
    url("/fonts/poppins/poppins-v20-latin-500.woff") format("woff");
}

@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src:
    url("/fonts/poppins/poppins-v20-latin-600.woff2") format("woff2"),
    url("/fonts/poppins/poppins-v20-latin-600.woff") format("woff");
}

@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src:
    url("/fonts/poppins/poppins-v20-latin-700.woff2") format("woff2"),
    url("/fonts/poppins/poppins-v20-latin-700.woff") format("woff");
}
```

### Server Rendering

When server rendering an app that uses Easy UI and React <18, your app must be wrapped with a single instance of React Aria's `SSRProvider`. If an app is using an additional version of React Aria, ensure there's only one version of `@react-aria/ssr` using NPM's `overrides` or Yarn's `resolutions` property.

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
