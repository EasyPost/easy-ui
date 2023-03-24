import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import kebabCase from "lodash/kebabCase";
import tokens from "@easypost/easy-ui-tokens/js/tokens";

export type Theme = {
  "font.family": string;
  "color.text": string;
  "color.text.heading": string;
  "color.background.disabled": string;
  "color.background.support": string;
  "color.background.primary": string;
  "color.background.primary.hovered": string;
  "color.background.primary.pressed": string;
  "color.background.secondary": string;
  "color.background.secondary.hovered": string;
  "color.background.secondary.pressed": string;
  "color.background.neutral": string;
  "color.background.neutral.hovered": string;
  "color.background.neutral.pressed": string;
  "color.background.success": string;
  "color.background.success.hovered": string;
  "color.background.success.pressed": string;
  "color.background.danger": string;
  "color.background.danger.hovered": string;
  "color.background.danger.pressed": string;
};
export type ColorScheme = "light" | "dark" | "system" | "inverted";

export const defaultThemeCreator = createTheme(() => {
  return buildThemeFromTokens(tokens, "theme.light");
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

  const theme = themeFromUser ? themeFromUser : defaultThemeCreator;
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

function buildThemeFromTokens(tokens: object, prefix: string) {
  const cleanedPrefix = prefix.replace(/\./g, "-");
  const theme = Object.fromEntries(
    Object.keys(tokens)
      .filter((key) => key.startsWith(cleanedPrefix))
      .map((key) => {
        const prop = key.replace(`${cleanedPrefix}-`, "").replace("-", ".");
        const value = `var(--ezui-${key})`;
        return [prop, value];
      }),
  );
  return theme as Theme;
}
