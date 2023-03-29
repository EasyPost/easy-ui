---
status: Approved
date: 2023-03-13
deciders: stephenjwatkins, OskiTheCoder, ldewald
---

# Support theming

## Context and Problem Statement

Easy UI needs to faciliate intentional and systematic customization of specific visual attributes. Theming allows for this adapation to business stragies and user needs.

## Decision Drivers

- Support conventional React method of providing Theming
- Support complementary usage in CSS Modules
- Support user-facing dynamic updating of theme
- Support server and client rendering
- Support prefers-color-theme browser directive without unstyled flash
- Support nesting
- Support typed theme configurations
- Support ability to manage as tokens

## Decision Outcome

We will use a context-driven, nestable `<ThemeProvider />` with built-in color scheme support to accomplish theming throughout Easy UI.

## More Information

A theme is a system that encompasses changes to any visual aspect of Easy UI, such as colors, rounding, shadow, and typography. Component properties stay the same across themes.

A color scheme is a subset of a theme that only affects colors.

Easy UI will map theme configurations to CSS variables. These CSS variables are contextual design tokens and will be injected into the document to be referenced in CSS modules. These variables will dynamically adjust to the values of the closest theme configuration.

Easy UI will have some built-in color scheme management to offset some of the complexity of handling color schemes externally. This means that color scheme is a discrete behavior of the overall theming solution and should be considered in the configuration. This management does not include keeping state of user-selected color schemes. See references below for managing user-selected color schemes, such as a dark mode toggle.

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

_Color schemes can be inverted:_

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

const redTheme = createTheme(() => ({
  "color.text": "#ff0000",
  "color.background": "#ffffff",
}));

const greenTheme = createTheme(() => ({
  "color.text": "#00ff00",
  "color.background": "#ffffff",
}));

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

_Themes can specify a `dark` and `light` theme:_

```jsx
// external-app/src/App.tsx

import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";
import { createTheme } from "@easypost/easy-ui/Theme";

const theme = createTheme(({ colorScheme }) => ({
  "color.text": colorScheme === "dark" ? "white" : "black",
  "color.background": colorScheme === "dark" ? "black" : "white",
}));

function App() {
  return (
    <EasyUIProvider theme={theme}>
      <div>{children}</div>
    </EasyUIProvider>
  );
}
```

### Using theme variables in Easy UI

Theme configuration is mapped to CSS variables.

```js
const theme = createTheme(() => ({
  "color.text": "black",
  "color.background": "white",
});
```

The names of the CSS variables are the same as in the theme configuration. Each variable holds the backing primitive of the most immediate theme and color scheme context.

Note the `--ezui-t` prefix to differentiate theme-aware CSS variables from static design tokens.

```css
.Button {
  color: var(--ezui-t-color-text);
  background: var(--ezui-t-color-background);
}
```

### Managing theme and color scheme state

Easy UI's `<ThemeProvider />` doesn't manage user-facing state. It simply applies the given theme and color scheme to the React tree below it.

As an example, a common requirement of needing user-facing state is a dark mode toggle. Below are the pieces one could use to handle this case with Easy UI's `<ThemeProvider />`:

```jsx
function App() {
  // Retrieve the user's color scheme preference from the browser
  // Note that we can't know the user's preference in a server rendering context
  const colorSchemePreference = usePrefersColorScheme();

  // Initialize the colorScheme with the user's preference. If this is rendered
  // on the server, it will default to "system" to prevent an unstyled flash
  const [colorScheme, setColorScheme] = useState(() => {
    return colorSchemePreference ?? "system";
  });

  return (
    <EasyUIProvider colorScheme={colorScheme}>
      <ColorModeToggle
        mode={colorScheme}
        onToggle={() => {
          setColorScheme((prevColorScheme) => {
            return prevColorScheme === "light" ? "dark" : "light");
          });
        }}
      />
      <div />
    </EasyUIProvider>
  );
}
```

### A note on inline styles

Inline styles are generally considered bad practice. They can be brittle, can lead to performance issues and are open to certain kinds of attacks. However, they are [the recommended approach](https://github.com/reactwg/react-18/discussions/110#:~:text=Our%20preferred%20solution%20is%20to%20use%20%3Clink%20rel%3D%22stylesheet%22%3E%20for%20statically%20extracted%20styles%20and%20plain%20inline%20styles%20for%20dynamic%20values.%20E.g.%20%3Cdiv%20style%3D%7B%7B...%7D%7D%3E) for dynamic styles in React, so as of now, they are used for styling dynamic properties in Easy UI.
