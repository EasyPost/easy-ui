import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import kebabCase from "lodash/kebabCase";

export type ColorScheme = "light" | "dark" | "system" | "inverted";
export type ThemeableColorScheme = "light" | "dark";

export type ThemeColors = {
  textColor: string;
  backgroundColor: string;
};

export type Theme = {
  fontFamily: string;
  colors: {
    [key in ThemeableColorScheme]: ThemeColors;
  };
};

export type ThemeProviderProps = {
  children: ReactElement;
  theme?: Theme;
  colorScheme?: ColorScheme;
};

export type ThemeContextProviderProps = {
  children: ReactNode;
  theme: Theme;
};

export type ColorSchemeContextProviderProps = {
  children: ReactNode;
  colorScheme: ColorScheme;
};

export type ThemeVariables = Record<string, string>;

export type ThemeContextSchema = readonly [Theme, (theme: Theme) => void];

export type ColorSchemeContextSchema = readonly [
  ColorScheme,
  (colorScheme: ColorScheme) => void,
  ColorScheme,
];

export type ColorSchemeProps = {
  children: ReactElement;
  mode: ColorScheme;
};

const ThemeContext = createContext<ThemeContextSchema | null>(null);
const ColorSchemeContext = createContext<ColorSchemeContextSchema | null>(null);

export function useTheme() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error("useTheme() must be used within a ThemeProvier");
  }
  return themeContext;
}

export function useColorScheme() {
  const colorSchemeContext = useContext(ColorSchemeContext);
  if (!colorSchemeContext) {
    throw new Error("useColorScheme() must be used within a ThemeProvider");
  }
  return colorSchemeContext;
}

export const DEFAULT_THEME = createTheme({
  fontFamily: "var(--ezui-theme-default-font-family)",
  colors: {
    light: {
      textColor: "var(--ezui-theme-default-colors-light-text-color)",
      backgroundColor:
        "var(--ezui-theme-default-colors-light-background-color)",
    },
    dark: {
      textColor: "var(--ezui-theme-default-colors-dark-text-color)",
      backgroundColor: "var(--ezui-theme-default-colors-dark-background-color)",
    },
  },
});

export function ThemeContextProvider({
  theme: themeFromUser,
  children,
}: ThemeContextProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => themeFromUser);

  const themeContextValue = useMemo(() => {
    return [theme, setTheme] as const;
  }, [theme, setTheme]);

  useEffect(() => {
    setTheme(themeFromUser);
  }, [themeFromUser]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

function Noop(props: { children: ReactNode }) {
  return <>{props.children}</>;
}

function getResolvedColorScheme(
  colorScheme: ColorScheme,
  parentColorSchemeContext: ColorSchemeContextSchema | null,
) {
  const invertedValues: Record<ColorScheme, ColorScheme> = {
    light: "dark",
    dark: "light",
    system: "inverted",
    inverted: "system",
  };

  if (colorScheme === "inverted" && parentColorSchemeContext) {
    const [, , prevResolvedColorScheme] = parentColorSchemeContext;
    return invertedValues[prevResolvedColorScheme];
  }

  return colorScheme;
}

export function ColorSchemeContextProvider({
  colorScheme: colorSchemeFromUser,
  children,
}: ColorSchemeContextProviderProps) {
  const parentColorSchemeContext = useContext(ColorSchemeContext);

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    () => colorSchemeFromUser,
  );

  const colorSchemeContextValue = useMemo(() => {
    const resolvedColorScheme = getResolvedColorScheme(
      colorScheme,
      parentColorSchemeContext,
    );
    return [colorScheme, setColorScheme, resolvedColorScheme] as const;
  }, [colorScheme, setColorScheme, parentColorSchemeContext]);

  useEffect(() => {
    setColorScheme(colorSchemeFromUser);
  }, [colorSchemeFromUser]);

  return (
    <ColorSchemeContext.Provider value={colorSchemeContextValue}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

const SharedContext = createContext(0);

export function ThemeProvider({
  theme: themeFromUser,
  colorScheme: colorSchemeFromUser,
  children,
}: ThemeProviderProps) {
  const parentTheme = useContext(ThemeContext);
  const isRoot = !parentTheme;

  if (!isRoot && !themeFromUser && !colorSchemeFromUser) {
    throw new Error("Must supply theme or colorScheme to ThemeProvider");
  }

  const parentContext = useContext(SharedContext);
  const [count] = useState(() => parentContext + 1);

  const ThemeContextComponent =
    isRoot || themeFromUser ? ThemeContextProvider : Noop;

  const ColorSchemeContextComponent =
    isRoot || colorSchemeFromUser ? ColorSchemeContextProvider : Noop;

  const theme = themeFromUser ? themeFromUser : DEFAULT_THEME;
  const colorScheme = colorSchemeFromUser ? colorSchemeFromUser : "system";

  return (
    <SharedContext.Provider value={count}>
      <ThemeContextComponent theme={theme}>
        <ColorSchemeContextComponent colorScheme={colorScheme}>
          <>
            <Style isRoot={isRoot} />
            {children}
          </>
        </ColorSchemeContextComponent>
      </ThemeContextComponent>
    </SharedContext.Provider>
  );
}

function Style({ isRoot }: { isRoot: boolean }) {
  const parentContext = useContext(SharedContext);
  const [theme] = useTheme();
  const [, , colorScheme] = useColorScheme();

  const fingerprint = useMemo(() => {
    return `ezui-theme-style-level-${parentContext}`;
  }, [parentContext]);

  const selector = isRoot ? ":root" : `#${fingerprint} ~ *`;

  const css = useMemo(() => {
    return colorScheme === "system"
      ? `${selector} {
        ${renderThemeVariables(theme, "light")}
      }
      @media (prefers-color-scheme: dark) {
        ${selector} {
          ${renderThemeVariables(theme, "dark")}
        }
      }`
      : colorScheme === "inverted"
      ? `${selector} {
        ${renderThemeVariables(theme, "dark")}
      }
      @media (prefers-color-scheme: dark) {
        ${selector} {
          ${renderThemeVariables(theme, "light")}
        }
      }`
      : `${selector} {
        ${renderThemeVariables(theme, colorScheme)}
      }`;
  }, [colorScheme, selector, theme]);

  return (
    <style
      id={isRoot ? undefined : fingerprint}
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}

export function createTheme(theme: Theme) {
  return theme;
}

export function getThemeInstanceVariables(
  theme: Theme,
  colorScheme: ThemeableColorScheme,
) {
  const { colors, ...restTheme } = theme;
  return Object.fromEntries(
    Object.entries({ ...restTheme, ...colors[colorScheme] }).map(
      ([key, value]) => {
        const property = kebabCase(key);
        return [`--ezui-t-${property}`, value];
      },
    ),
  );
}

export function renderThemeVariables(
  theme: Theme,
  colorScheme: ThemeableColorScheme,
) {
  const variables = getThemeInstanceVariables(theme, colorScheme);
  const css = Object.entries(variables)
    .map((entry) => entry.join(": ") + ";")
    .join("\n");
  return css;
}
