---
status: Pending
date: 2023-03-13
deciders: stephenjwatkins, OskiTheCoder, ldewald
---

# Support theming

## Context and Problem Statement

Easy UI needs to faciliate intentional and systematic customization of specific visual attributes. Theming allows for this adapation to business stragies and user needs.

## Decision Drivers

- Support theme management in tokens project
- Support on-demand toggling a theme
- Support complementary usage in CSS Modules
- Support server and client rendering
- Support prefers-color-theme browser directive without unstyled flash
- Support nesting
- Support typed theme configurations

## Decision Outcome

We will use a context-driven, nestable `<ThemeProvider />` with built-in color scheme support to accomplish theming throughout Easy UI.

## More Information

A theme is a system that encompasses changes to any visual aspect of Easy UI, such as colors, rounding, shadow, and typography. Component properties stay the same across themes.

A color scheme is a subset of a theme that only affects colors.

Easy UI will have built-in color scheme management. This means that `colorScheme` is a distinct property of theming and requires a specific theme configuration to take into account `light` and `dark` modes. A developer using Easy UI can provide `light`, `dark`, `system`, or `inverted` as the color scheme.

_Force a `dark` or `light` color scheme:_

```jsx
// external-app/src/App.tsx

import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";

function App() {
  return (
    <EasyUIProvider colorScheme="dark">
      <div>{children}</div>
    </EasyUIProvider>
  );
}

function App() {
  return (
    <EasyUIProvider colorScheme="light">
      <div>{children}</div>
    </EasyUIProvider>
  );
}
```

_Use the system's color scheme:_

```jsx
// external-app/src/App.tsx

import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";

function App() {
  return (
    <EasyUIProvider colorScheme="system">
      <div>{children}</div>
    </EasyUIProvider>
  );
}

// `system` is the default mode
function App() {
  return (
    <EasyUIProvider>
      <div>{children}</div>
    </EasyUIProvider>
  );
}
```

_Themes can be nested and overriden:_

```jsx
// external-app/src/App.tsx

import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";
import { ThemeProvider } from "@easypost/easy-ui/Theme";

function App() {
  return (
    <EasyUIProvider colorScheme="light">
      <div>
        <div>{navigation}</div>
        <ThemeProvider colorScheme="dark">
          <div>{children}</div>
        </ThemeProvider>
      </div>
    </EasyUIProvider>
  );
}
```

_Themes can be inverted:_

```jsx
// external-app/src/App.tsx

import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";
import { ThemeProvider } from "@easypost/easy-ui/Theme";

function App() {
  return (
    <EasyUIProvider colorScheme="system">
      <div>
        <div>{navigation}</div>
        <ThemeProvider colorScheme="inverted">
          {/* Colors will be opposite of whatever is the system theme */}
          <div>{children}</div>
        </ThemeProvider>
      </div>
    </EasyUIProvider>
  );
}
```

_Themes can be customized:_

```jsx
// external-app/src/App.tsx

import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";
import { createTheme } from "@easypost/easy-ui/Theme";

// createTheme() provides type hints for expected configuration

const redTheme = createTheme({
  fontFamily: "Helvetica, sans",
  colors: {
    light: {
      textColor: "#ff0000",
      backgroundColor: "#ffffff",
    },
    dark: {
      textColor: "#ffffff",
      backgroundColor: "#ff0000",
    },
  },
});

const greenTheme = createTheme({
  fontFamily: "Helvetica, sans",
  colors: {
    light: {
      textColor: "#00ff00",
      backgroundColor: "#ffffff",
    },
    dark: {
      textColor: "#ffffff",
      backgroundColor: "#00ff00",
    },
  },
});

function App() {
  return (
    <EasyUIProvider theme={redTheme}>
      <div>
        <div>{navigation}</div>
        <ThemeProvider theme={greenTheme}>
          <div>{children}</div>
        </ThemeProvider>
      </div>
    </EasyUIProvider>
  );
}
```

_Reading theme configuration:_

```jsx
import { useTheme, useColorScheme } from "./Theme";

function Component({ children }) {
  const [theme, setTheme] = useTheme();
  const [colorScheme, setColorScheme] = useColorScheme();
  // read theme
  //   { fontFamily: "", colors: { light: { textColor }, dark: { textColor } } }
  // read color scheme
  //   light | dark | system | inverted
  return <div />;
}
```

### Using theme variables in Easy UI

Theme configuration is mapped to CSS variables.

```js
const theme = createTheme({
  fontFamily: "Helvetica, sans",
  colors: {
    light: {
      textColor: "black",
      backgroundColor: "white",
    },
    dark: {
      textColor: "white",
      backgroundColor: "black",
    },
  },
});
```

The names of the variables are the same as in the theme configuration—only in CSS syntax. Each variable holds the backing primitive of the most immediate theme and color scheme context.

```css
.Button {
  font-family: var(--ezui-t-font-family);
  color: var(--ezui-t-text-color);
  background: var(--ezui-t-background-color);
}
```

### A note on inline styles

Inline styles are generally considered bad practice. They can be brittle, can lead to performance issues and are open to certain kinds of attacks. However, they are [the recommended approach](https://github.com/reactwg/react-18/discussions/110#:~:text=Our%20preferred%20solution%20is%20to%20use%20%3Clink%20rel%3D%22stylesheet%22%3E%20for%20statically%20extracted%20styles%20and%20plain%20inline%20styles%20for%20dynamic%20values.%20E.g.%20%3Cdiv%20style%3D%7B%7B...%7D%7D%3E) for dynamic styles in React, so as of now, they are used for styling dynamic properties in Easy UI.
