import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import kebabCase from "lodash/kebabCase";

const themeDefinition = {
  "color.background.danger": "",
  "color.background.danger.hovered": "",
  "color.background.danger.pressed": "",
  "color.background.disabled": "",
  "color.background.neutral": "",
  "color.background.neutral.hovered": "",
  "color.background.neutral.pressed": "",
  "color.background.primary": "",
  "color.background.primary.hovered": "",
  "color.background.primary.pressed": "",
  "color.background.secondary": "",
  "color.background.secondary.hovered": "",
  "color.background.secondary.pressed": "",
  "color.background.success": "",
  "color.background.success.hovered": "",
  "color.background.success.pressed": "",
  "color.border.support": "",
  "color.border.support.hovered": "",
  "color.border.support.pressed": "",
  "color.border.inverse": "",
  "color.border.inverse.hovered": "",
  "color.border.inverse.pressed": "",
  "color.border.disabled": "",
  "color.text": "",
  "color.text.disabled": "",
  "color.text.heading": "",
  "color.text.inverse": "",
  "color.text.success.inverse": "",
  "color.text.success.inverse.pressed": "",
  "color.text.danger.inverse": "",
  "color.text.danger.inverse.pressed": "",
  "font.family": "",
  "shadow.button": "",
};

export type Theme = typeof themeDefinition;
export type ColorScheme = "light" | "dark" | "system" | "inverted";

export const defaultTheme = createTheme(() => {
  return buildThemeFromTokenNamespace("theme.light");
});

const invertedColorSchemes: Record<ColorScheme, ColorScheme> = {
  light: "dark",
  dark: "light",
  system: "inverted",
  inverted: "system",
};

export type ThemeableColorScheme = Extract<ColorScheme, "light" | "dark">;
export type ThemePreferences = { colorScheme: ThemeableColorScheme };
export type ThemeCreator = (preferences: ThemePreferences) => Theme;

export type ThemeProviderProps = {
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

type ThemeContextProviderProps = {
  children: ReactNode;
  theme: ThemeCreator;
};

type ColorSchemeContextProviderProps = {
  children: ReactNode;
  colorScheme: ColorScheme;
};

type ThemeContextSchema = ThemeCreator;

type ColorSchemeContextSchema = {
  userColorScheme: ColorScheme;
  // Resolved color scheme is used to keep track of color scheme inversion
  resolvedColorScheme: ColorScheme;
};

function NoopComponent(props: { children: ReactNode }) {
  return <>{props.children}</>;
}

const TrackerContext = createContext<number>(0);
const ThemeContext = createContext<ThemeContextSchema | null>(null);
const ColorSchemeContext = createContext<ColorSchemeContextSchema | null>(null);

/**
 * Makes the specified `theme` and `colorScheme` applicable to the provided
 * React tree. CSS variables within modules will adjust to
 * the new configuration.
 *
 * @param props.children Component tree to apply specified theme
 * @param props.colorScheme Color scheme to apply to Easy UI
 * @param props.theme Theme to apply to Easy UI. Use `createTheme()` to build theme object
 * @returns Themed component tree
 */
export function ThemeProvider({
  children,
  colorScheme: colorSchemeFromUser,
  theme: themeFromUser,
}: ThemeProviderProps) {
  const parentTheme = useContext(ThemeContext);
  const isRoot = !parentTheme;

  if (!isRoot && !themeFromUser && !colorSchemeFromUser) {
    throw new Error("Must supply theme or colorScheme to ThemeProvider");
  }

  const parentContext = useContext(TrackerContext);
  const [count] = useState(() => parentContext + 1);

  const ThemeContextComponent =
    isRoot || themeFromUser ? ThemeContextProvider : NoopComponent;

  const ColorSchemeContextComponent =
    isRoot || colorSchemeFromUser ? ColorSchemeContextProvider : NoopComponent;

  const theme = themeFromUser ? themeFromUser : defaultTheme;
  const colorScheme = colorSchemeFromUser ? colorSchemeFromUser : "system";

  return (
    <TrackerContext.Provider value={count}>
      <ThemeContextComponent theme={theme}>
        <ColorSchemeContextComponent colorScheme={colorScheme}>
          <>
            <Style isRoot={isRoot} />
            {children}
          </>
        </ColorSchemeContextComponent>
      </ThemeContextComponent>
    </TrackerContext.Provider>
  );
}

/**
 * Create a theme to use for Easy UI.
 *
 * @param themeCreator function that returns a theme object
 * @returns theme creation function
 */
export function createTheme(themeCreator: ThemeCreator) {
  return themeCreator;
}

function useTheme() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error("useTheme() must be used within a ThemeProvier");
  }
  return themeContext;
}

function useColorScheme() {
  const colorSchemeContext = useContext(ColorSchemeContext);
  if (!colorSchemeContext) {
    throw new Error("useColorScheme() must be used within a ThemeProvider");
  }
  return colorSchemeContext;
}

function Style({ isRoot }: { isRoot: boolean }) {
  const parentContext = useContext(TrackerContext);
  const themeCreator = useTheme();
  const { resolvedColorScheme } = useColorScheme();

  const fingerprint = useMemo(() => {
    return `ezui-theme-style-level-${parentContext}`;
  }, [parentContext]);

  const selector = isRoot ? ":root" : `#${fingerprint} ~ *`;

  const css = useMemo(() => {
    return resolvedColorScheme === "system"
      ? `${selector} {
        ${renderThemeVariables(themeCreator({ colorScheme: "light" }))}
      }
      @media (prefers-color-scheme: dark) {
        ${selector} {
          ${renderThemeVariables(themeCreator({ colorScheme: "dark" }))}
        }
      }`
      : resolvedColorScheme === "inverted"
      ? `${selector} {
        ${renderThemeVariables(themeCreator({ colorScheme: "dark" }))}
      }
      @media (prefers-color-scheme: dark) {
        ${selector} {
          ${renderThemeVariables(themeCreator({ colorScheme: "light" }))}
        }
      }`
      : `${selector} {
        ${renderThemeVariables(
          themeCreator({ colorScheme: resolvedColorScheme }),
        )}
      }`;
  }, [resolvedColorScheme, selector, themeCreator]);

  return <style id={fingerprint} dangerouslySetInnerHTML={{ __html: css }} />;
}

function ThemeContextProvider({ theme, children }: ThemeContextProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

function ColorSchemeContextProvider({
  colorScheme,
  children,
}: ColorSchemeContextProviderProps) {
  const parentColorSchemeContext = useContext(ColorSchemeContext);

  const colorSchemeContextValue = useMemo(() => {
    const resolvedColorScheme =
      colorScheme === "inverted" && parentColorSchemeContext
        ? invertedColorSchemes[parentColorSchemeContext.resolvedColorScheme]
        : colorScheme;
    return { userColorScheme: colorScheme, resolvedColorScheme };
  }, [colorScheme, parentColorSchemeContext]);

  return (
    <ColorSchemeContext.Provider value={colorSchemeContextValue}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

function getThemeInstanceVariables(theme: Theme) {
  return Object.fromEntries(
    Object.entries(theme).map(([key, value]) => {
      const property = kebabCase(key);
      return [`--ezui-t-${property}`, value];
    }),
  );
}

function renderThemeVariables(theme: Theme) {
  const variables = getThemeInstanceVariables(theme);
  const css = Object.entries(variables)
    .map((entry) => entry.join(": ") + ";")
    .join("\n");
  return css;
}

function buildThemeFromTokenNamespace(prefix: string) {
  const theme = Object.fromEntries(
    Object.keys(themeDefinition).map((key) => {
      const value = `var(--ezui-${kebabCase(prefix)}-${kebabCase(key)})`;
      return [key, value];
    }),
  );
  return theme as Theme;
}
