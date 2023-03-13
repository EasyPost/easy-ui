import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import kebabCase from "lodash/kebabCase";

export type ColorScheme = "light" | "dark";

export type ThemeInstance = {
  textColor: string;
  backgroundColor: string;
};

export type Theme = {
  [key in ColorScheme]: ThemeInstance;
};

export type ThemeProviderProps = {
  children: ReactNode;
  theme: Theme;
  colorScheme?: ColorScheme;
};

export type ThemeVariables = Record<string, string>;

export type ColorSchemeContextSchema = readonly [
  ColorScheme | undefined,
  (colorScheme: ColorScheme) => void,
];

export type ColorSchemeProps = {
  children: (themeVariables: ThemeVariables) => ReactNode;
  mode: ColorScheme;
};

const ThemeContext = createContext<Theme | null>(null);
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

export function ThemeProvider({
  theme: themeFromUser,
  colorScheme: colorSchemeFromUser,
  children,
}: ThemeProviderProps) {
  const parentTheme = useContext(ThemeContext);

  if (parentTheme) {
    throw new Error("There can only be one theme defined in a project");
  }

  const [theme, setTheme] = useState<Theme>(() => themeFromUser);
  const [colorScheme, setColorScheme] = useState<ColorScheme | undefined>(
    () => colorSchemeFromUser,
  );

  const themeContextValue = useMemo(() => {
    return theme;
  }, [theme]);

  const colorSchemeContextValue = useMemo(() => {
    return [colorScheme, setColorScheme] as const;
  }, [colorScheme, setColorScheme]);

  useEffect(() => {
    setColorScheme(colorSchemeFromUser);
  }, [colorSchemeFromUser]);

  useEffect(() => {
    setTheme(themeFromUser);
  }, [themeFromUser]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ColorSchemeContext.Provider value={colorSchemeContextValue}>
        <style
          dangerouslySetInnerHTML={{
            __html: colorScheme
              ? renderRootThemeVariables(theme[colorScheme])
              : `${renderRootThemeVariables(theme.light)}
                @media (prefers-color-scheme: dark) {
                  ${renderRootThemeVariables(theme.dark)}
                }`,
          }}
        />
        {children}
      </ColorSchemeContext.Provider>
    </ThemeContext.Provider>
  );
}

export function ColorSchemeProvider({
  mode: modeFromUser,
  children,
}: ColorSchemeProps) {
  const theme = useTheme();
  const [mode, setMode] = useState<ColorScheme>(() => modeFromUser);

  const contextValue = useMemo(() => {
    return [mode, setMode] as const;
  }, [mode, setMode]);

  useEffect(() => {
    setMode(modeFromUser);
  }, [modeFromUser]);

  return (
    <ColorSchemeContext.Provider value={contextValue}>
      {children(getThemeInstanceVariables(theme[mode]))}
    </ColorSchemeContext.Provider>
  );
}

export function createTheme(theme: Theme) {
  return theme;
}

export function getThemeInstanceVariables(themeInstance: ThemeInstance) {
  return Object.fromEntries(
    Object.entries(themeInstance).map(([key, value]) => {
      const property = kebabCase(key);
      return [`--ezui-${property}`, value];
    }),
  );
}

export function renderRootThemeVariables(themeInstance: ThemeInstance) {
  const variables = getThemeInstanceVariables(themeInstance);
  const css = Object.entries(variables)
    .map((entry) => entry.join(": ") + ";")
    .join("\n");
  return `:root {
      ${css}
    }`;
}
