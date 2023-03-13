import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import kebabCase from "lodash/kebabCase";

export type ColorSchemeMode = "light" | "dark";

export type ThemeInstance = {
  textColor: string;
  backgroundColor: string;
};

export type Theme = {
  [key in ColorSchemeMode]: ThemeInstance;
};

export type ThemeContextSchema = readonly [Theme, (theme: Theme) => void];

export type ThemeProviderProps = {
  children: ReactNode;
  theme: Theme;
};

export type ThemeVariables = {
  [k in string]: string;
};

export type ColorSchemeContextSchema = readonly [
  ColorSchemeMode | undefined,
  (colorScheme: ColorSchemeMode) => void,
];

export type RootColorSchemeProps = {
  children: ReactNode;
  mode?: ColorSchemeMode;
};

export type ColorSchemeProps = {
  children: (themeVariables: ThemeVariables) => ReactNode;
  mode: ColorSchemeMode;
};

const ThemeContext = createContext<ThemeContextSchema>([
  { light: {}, dark: {} } as Theme,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
]);

// Helper for providing type hints
export function createTheme(theme: Theme) {
  return theme;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  theme: themeFromUser,
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => themeFromUser);

  const contextValue = useMemo(() => {
    return [theme, setTheme] as const;
  }, [theme, setTheme]);

  useEffect(() => {
    setTheme(themeFromUser);
  }, [themeFromUser]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

const ColorSchemeContext = createContext<ColorSchemeContextSchema>([
  undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
]);

export function useColorScheme() {
  return useContext(ColorSchemeContext);
}

export function ColorScheme({
  mode: modeFromUser,
  children,
}: ColorSchemeProps) {
  const [theme] = useTheme();
  const [mode, setMode] = useState<ColorSchemeMode>(() => modeFromUser);

  const contextValue = useMemo(() => {
    return [mode, setMode] as const;
  }, [mode, setMode]);

  useEffect(() => {
    setMode(modeFromUser);
  }, [modeFromUser]);

  // In a non-root context, variables need to be written to the React
  // component directly in order for it to come through on the server:
  //
  // <ColorScheme mode="dark">
  //   {(style) => (
  //     <div style={style} />
  //   )}
  // </ColorScheme>
  return (
    <ColorSchemeContext.Provider value={contextValue}>
      {children(getThemeInstanceVariables(theme[mode]))}
    </ColorSchemeContext.Provider>
  );
}

export function RootColorScheme({
  mode: modeFromUser,
  children,
}: RootColorSchemeProps) {
  const [theme] = useTheme();
  const [mode, setMode] = useState<ColorSchemeMode | undefined>(
    () => modeFromUser,
  );

  const contextValue = useMemo(() => {
    return [mode, setMode] as const;
  }, [mode, setMode]);

  useEffect(() => {
    setMode(modeFromUser);
  }, [modeFromUser]);

  // In a root context, write the variables to a style tag under the :root
  // scope. No need to attach styles directly
  //
  // <ColorScheme>
  //   <div />
  // </ColorScheme>
  return (
    <ColorSchemeContext.Provider value={contextValue}>
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: mode
              ? renderRootThemeVariables(theme[mode])
              : `${renderRootThemeVariables(theme.light)}
                @media (prefers-color-scheme: dark) {
                  ${renderRootThemeVariables(theme.dark)}
                }`,
          }}
        />
        {children}
      </>
    </ColorSchemeContext.Provider>
  );
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
