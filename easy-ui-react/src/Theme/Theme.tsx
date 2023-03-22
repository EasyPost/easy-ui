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

export type Theme = {
  "color.text": string;
  "color.background": string;
};

export type ThemePreferences = { colorScheme: ThemeableColorScheme };
export type ThemeFunction = (input: ThemePreferences) => Theme;

export type ThemeProviderProps = {
  children: ReactElement;
  theme?: ThemeFunction;
  colorScheme?: ColorScheme;
};

export type ThemeContextProviderProps = {
  children: ReactNode;
  theme: ThemeFunction;
};

export type ColorSchemeContextProviderProps = {
  children: ReactNode;
  colorScheme: ColorScheme;
};

export type ThemeVariables = Record<string, string>;

export type ThemeContextSchema = readonly [
  ThemeFunction,
  (themeFunction: ThemeFunction) => void,
];

export type ColorSchemeContextSchema = readonly [
  ColorScheme,
  (colorScheme: ColorScheme) => void,
  ColorScheme,
];

export type ColorSchemeProps = {
  children: ReactElement;
  mode: ColorScheme;
};

function NoopComponent(props: { children: ReactNode }) {
  return <>{props.children}</>;
}

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

export const defaultTheme = createTheme(() => ({
  "color.text": "var(--ezui-theme-base-color-text)",
  "color.background": "var(--ezui-theme-base-color-background)",
}));

export function ThemeContextProvider({
  theme: themeFunctionFromUser,
  children,
}: ThemeContextProviderProps) {
  const [themeFunction, setThemeFunction] = useState<ThemeFunction>(
    () => themeFunctionFromUser,
  );

  const themeContextValue = useMemo(() => {
    return [themeFunction, setThemeFunction] as const;
  }, [themeFunction, setThemeFunction]);

  useEffect(() => {
    setThemeFunction(() => themeFunctionFromUser);
  }, [themeFunctionFromUser]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export const invertedColorSchemes: Record<ColorScheme, ColorScheme> = {
  light: "dark",
  dark: "light",
  system: "inverted",
  inverted: "system",
};

export function ColorSchemeContextProvider({
  colorScheme: colorSchemeFromUser,
  children,
}: ColorSchemeContextProviderProps) {
  const parentColorSchemeContext = useContext(ColorSchemeContext);

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    () => colorSchemeFromUser,
  );

  const colorSchemeContextValue = useMemo(() => {
    const resolvedColorScheme =
      colorScheme === "inverted" && parentColorSchemeContext
        ? invertedColorSchemes[parentColorSchemeContext[2]]
        : colorScheme;
    return [colorScheme, setColorScheme, resolvedColorScheme] as const;
  }, [colorScheme, setColorScheme, parentColorSchemeContext]);

  useEffect(() => {
    setColorScheme(() => colorSchemeFromUser);
  }, [colorSchemeFromUser]);

  return (
    <ColorSchemeContext.Provider value={colorSchemeContextValue}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

const SharedContext = createContext(0);

export function ThemeProvider({
  theme: themeFunctionFromUser,
  colorScheme: colorSchemeFromUser,
  children,
}: ThemeProviderProps) {
  const parentTheme = useContext(ThemeContext);
  const isRoot = !parentTheme;

  if (!isRoot && !themeFunctionFromUser && !colorSchemeFromUser) {
    throw new Error("Must supply theme or colorScheme to ThemeProvider");
  }

  const parentContext = useContext(SharedContext);
  const [count] = useState(() => parentContext + 1);

  const ThemeContextComponent =
    isRoot || themeFunctionFromUser ? ThemeContextProvider : NoopComponent;

  const ColorSchemeContextComponent =
    isRoot || colorSchemeFromUser ? ColorSchemeContextProvider : NoopComponent;

  const theme = themeFunctionFromUser ? themeFunctionFromUser : defaultTheme;
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
  const [themeFunction] = useTheme();
  const [, , colorScheme] = useColorScheme();

  const fingerprint = useMemo(() => {
    return `ezui-theme-style-level-${parentContext}`;
  }, [parentContext]);

  const selector = isRoot ? ":root" : `#${fingerprint} ~ *`;

  const css = useMemo(() => {
    return colorScheme === "system"
      ? `${selector} {
        ${renderThemeVariables(themeFunction({ colorScheme: "light" }))}
      }
      @media (prefers-color-scheme: dark) {
        ${selector} {
          ${renderThemeVariables(themeFunction({ colorScheme: "dark" }))}
        }
      }`
      : colorScheme === "inverted"
      ? `${selector} {
        ${renderThemeVariables(themeFunction({ colorScheme: "dark" }))}
      }
      @media (prefers-color-scheme: dark) {
        ${selector} {
          ${renderThemeVariables(themeFunction({ colorScheme: "light" }))}
        }
      }`
      : `${selector} {
        ${renderThemeVariables(themeFunction({ colorScheme }))}
      }`;
  }, [colorScheme, selector, themeFunction]);

  return (
    <style
      id={isRoot ? undefined : fingerprint}
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}

export function createTheme(themeFunction: ThemeFunction) {
  return themeFunction;
}

export function getThemeInstanceVariables(theme: Theme) {
  return Object.fromEntries(
    Object.entries(theme).map(([key, value]) => {
      const property = kebabCase(key);
      return [`--ezui-t-${property}`, value];
    }),
  );
}

export function renderThemeVariables(theme: Theme) {
  const variables = getThemeInstanceVariables(theme);
  const css = Object.entries(variables)
    .map((entry) => entry.join(": ") + ";")
    .join("\n");
  return css;
}
