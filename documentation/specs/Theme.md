# `Theme` Component Specification

## Design

### API

```ts
// Example theme configuration
export type Theme = {
  "color.text": string;
  "color.background": string;
};
export type ColorScheme = "light" | "dark" | "system" | "inverted";
export type ThemeableColorScheme = Extract<ColorScheme, "light" | "dark">;
export type ThemePreferences = { colorScheme: ThemeableColorScheme };
export type ThemeCreator = (preferences: ThemePreferences) => Theme;

type ThemeProvider = {
  /** Component tree to apply specified theme. */
  children: ReactNode;
  /**
   * Color scheme to apply to Easy UI.
   * @default system
   */
  colorScheme?: ColorScheme;
  /**
   * Theme to apply to Easy UI. Use `createTheme()` to build theme object.
   * @default defaultTheme
   */
  theme?: ThemeCreator;
};
```

# `Icon` Component Specification

## Design

### API

```tsx
import { ThemeProvider } from "@easypost/easy-ui/Theme";

const theme = createTheme(({ colorScheme }) => ({
  "color.text": colorScheme === "dark" ? "white" : "black",
  "color.background": colorScheme === "dark" ? "black" : "white",
}));

// Providing a base theme and using the default system color scheme
function App() {
  return (
    <ThemeProvider theme={theme}>
      <div />
    </ThemeProvider>
  );
}

// Providing a specific color scheme
function App() {
  return (
    <ThemeProvider colorScheme="dark">
      <div />
    </ThemeProvider>
  );
}

// Inverting a color scheme
function Component() {
  return (
    <ThemeProvider colorScheme="system">
      <div>
        <ThemeProvider colorScheme="inverted">
          <div />
        </ThemeProvider>
      </div>
    </ThemeProvider>
  );
}
```
