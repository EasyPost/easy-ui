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

We will use a context-driven, disparate theme and color scheme system to accomplish theming throughout Easy UI.

## More Information

A theme is a system that encompasses changes to any visual aspect of Easy UI, such as colors, rounding, shadow, and typography. Component properties stay the same across themes.

A color scheme is a subset of a theme that only affects colors.

These terms carry significance in Easy UI. A theme is setup once and considered static; a color scheme is defined initially and can be set multiple times in nested contexts.

### Supplemental decisions

- There can only be one theme defined in a project
- A theme must consist of a `light` and `dark` variant
- Color scheme defaults to what is set by the user's system
- Color schemes can be nested to allow for differing modes within modes

### Providing for themes in Easy UI

```jsx
import { ThemeProvider, createTheme } from "./Theme";

const theme = createTheme({
  light: {
    textColor: "black",
    backgroundColor: "white",
  },
  dark: {
    textColor: "white",
    backgroundColor: "black",
  },
});

// Without a specified color scheme, it defaults to the system theme
function App({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

// To provide a static color scheme
function App({ children }) {
  return (
    <ThemeProvider theme={theme} colorScheme="light">
      {children}
    </ThemeProvider>
  );
}
```

As part of setup, the ThemeProvider will inline `:root` CSS variables based on the specified theme configuration and color scheme. These CSS variables are sent with the server preventing inaccurate flashes of themes. These CSS variables are then able to be referenced in component CSS.

### Reading theme configuration

```jsx
import { useTheme, useColorScheme } from "./Theme";

function Component({ children }) {
  const theme = useTheme();
  const [colorScheme, setColorScheme] = useColorScheme();
  // read theme
  //   { light: { textColor }, dark: { textColor } }
  // read color scheme
  //   light | dark | undefined
  return <div />;
}
```

From within the inner component tree, theme and color scheme are referenced independently.

### Creating a new color scheme context

```jsx
import { ColorSchemeProvider } from "./Theme";

function ThemeAwareContainer({ children }) {
  return (
    <ColorSchemeProvider mode="dark">
      {(style) => (
        <div style={style} />;
      )}
    </ColorSchemeProvider>
  );
}
```

A new color scheme context provides the color scheme-specific CSS variables as inline styles to the specified DOM element. This allows styles to be supplied as part of the server rendering process, eliminating flashes of inaccurate color scheme. The `<ColorSchemeProvider />` is headless, defering all styles to the element rendered within it.

### Using theme variables

Theme configuration is mapped to CSS variables.

```js
const theme = createTheme({
  light: {
    textColor: "black",
    backgroundColor: "white",
  },
  dark: {
    textColor: "white",
    backgroundColor: "black",
  },
});
```

The names of the variables are the same as what is defined in the theme only in CSS syntax. Each variable holds the backing primitive of the most immediate color scheme context.

```css
.Button {
  color: var(--ezui-text-color);
  background: var(--ezui-background-color);
}
```

### A note on inline styles

Inline styles are generally considered bad practice. They can be brittle, can lead to performance issues and are open to certain kinds of attacks. However, they are [the recommended approach](https://github.com/reactwg/react-18/discussions/110#:~:text=Our%20preferred%20solution%20is%20to%20use%20%3Clink%20rel%3D%22stylesheet%22%3E%20for%20statically%20extracted%20styles%20and%20plain%20inline%20styles%20for%20dynamic%20values.%20E.g.%20%3Cdiv%20style%3D%7B%7B...%7D%7D%3E) for dynamic styles in React, so as of now, they are used for styling dynamic properties in Easy UI.
