# Easy UI React

Easy UI React is a component library designed to help developers create the best experience for shippers who use EasyPost.

## Installation

Run the following command using [npm](https://www.npmjs.com/):

```bash
npm install @easypost/easy-ui --save
```

## Usage

1.  Import the CSS directly into your project if your asset packager supports it:

```js
import "@easypost/easy-ui/dist/styles.css";
```

2.  Include the provider and any relevant components in your project:

```js
import { Provider as EasyUIProvider } from "@easypost/easy-ui";
```

3.  Tell React to render the element in the DOM:

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
