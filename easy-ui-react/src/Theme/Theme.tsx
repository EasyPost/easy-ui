import tokens from "@easypost/easy-ui-tokens/js/tokens";
import React, {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import type { TokenNamespaceWithSuffix } from "../types";

export type Theme = TokenNamespaceWithSuffix<"theme", "name">;
export type ThemeContextSchema = readonly [Theme, (theme: Theme) => void];
export type ThemeVariables = {
  [k in string]: string;
};

export type ColorSchemeProviderProps = { children: ReactNode };
export type ThemeColorSchemeProvider = ComponentType<ColorSchemeProviderProps>;

export type RootThemeProviderProps = {
  children: ReactNode;
  colorSchemeProvider?: ThemeColorSchemeProvider;
};

export type ChildThemeProviderProps = {
  children: (themeVariables: ThemeVariables) => ReactNode;
  theme?: Theme;
};

const DEFAULT_THEME = "base";
// eslint-disable-next-line @typescript-eslint/no-empty-function
const DEFAULT_THEME_FN = () => {};

const ThemeContext = createContext<ThemeContextSchema>([
  DEFAULT_THEME,
  DEFAULT_THEME_FN,
]);

export function useTheme() {
  return useContext(ThemeContext);
}

export function RootThemeProvider({
  colorSchemeProvider: ColorSchemeProvider = BrowserColorSchemeProvider,
  children,
}: RootThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => DEFAULT_THEME);

  const contextValue = useMemo(() => {
    return [theme, setTheme] as const;
  }, [theme, setTheme]);

  // In a root context, the theme is set in CSS from the server. Any changes
  // will be set solely on the client
  useEffect(() => {
    const themeVariables = getThemeVariables(theme);
    Object.entries(themeVariables).forEach(([property, value]) => {
      window.document.documentElement.style.setProperty(property, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <ColorSchemeProvider>{children}</ColorSchemeProvider>
    </ThemeContext.Provider>
  );
}

export function ChildThemeProvider({
  theme: inTheme = DEFAULT_THEME,
  children,
}: ChildThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => inTheme);

  const contextValue = useMemo(() => {
    return [theme, setTheme] as const;
  }, [theme, setTheme]);

  useEffect(() => {
    setTheme(inTheme);
  }, [inTheme]);

  // In a child context, theme variables need to be written to the React
  // component directly in order for it to come through on the server:
  //
  // <ChildThemeProvider>
  //   {(vars) => (
  //     <div style={vars} />
  //   )}
  // </ChildThemeProvider>
  return (
    <ThemeContext.Provider value={contextValue}>
      {children(getThemeVariables(theme))}
    </ThemeContext.Provider>
  );
}

// Determines the color scheme set by the browser using media query detection
export function BrowserColorSchemeProvider({
  children,
}: ColorSchemeProviderProps) {
  const [, setTheme] = useTheme();
  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mq.matches ? "dark" : "base");
    function onChange(e: MediaQueryListEvent) {
      setTheme(e.matches ? "dark" : "base");
    }
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
    };
  }, [setTheme]);
  return <>{children}</>;
}

function getThemeVariables(theme: Theme) {
  return Object.fromEntries(
    Object.entries(tokens)
      .filter(([alias]) => alias.startsWith(`theme-${theme}-`))
      .map(([key]) => {
        const property = key.replace(`theme-${theme}-`, "");
        return [`--ezui-${property}`, `var(--ezui-theme-${theme}-${property})`];
      }),
  );
}
