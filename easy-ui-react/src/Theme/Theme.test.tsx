import { render, screen } from "@testing-library/react";
import React from "react";
import { createTheme, defaultTheme, ThemeProvider } from "./Theme";

const baseTheme = defaultTheme({ colorScheme: "light" });
const redTheme = createTheme(() => ({ ...baseTheme, "color.text": "red" }));
const greenTheme = createTheme(() => ({ ...baseTheme, "color.text": "green" }));
const theme = createTheme(({ colorScheme }) =>
  colorScheme === "dark"
    ? { ...baseTheme, "color.text": "white" }
    : { ...baseTheme, "color.text": "black" },
);

describe("<ThemeProvider />", () => {
  it("should render specified theme", () => {
    render(
      <ThemeProvider theme={theme}>
        <div>Child</div>
      </ThemeProvider>,
    );
    expect(getThemeForElement(screen.getByText("Child"))).toMatchObject({
      "--ezui-theme-color-text": "black",
    });
  });

  it("should render specified color scheme", () => {
    render(
      <ThemeProvider theme={theme} colorScheme="dark">
        <div>Child</div>
      </ThemeProvider>,
    );
    expect(getThemeForElement(screen.getByText("Child"))).toMatchObject({
      "--ezui-theme-color-text": "white",
    });
  });

  it("should support nesting color scheme", () => {
    render(
      <ThemeProvider theme={theme} colorScheme="light">
        <div>Outer</div>
        <ThemeProvider colorScheme="dark">
          <div>Inner</div>
        </ThemeProvider>
      </ThemeProvider>,
    );
    expect(getThemeForElement(screen.getByText("Outer"))).toMatchObject({
      "--ezui-theme-color-text": "black",
    });
    expect(getThemeForElement(screen.getByText("Inner"))).toMatchObject({
      "--ezui-theme-color-text": "white",
    });
  });

  it("should support nesting theme", () => {
    render(
      <ThemeProvider theme={redTheme}>
        <div>Outer</div>
        <ThemeProvider theme={greenTheme}>
          <div>Inner</div>
        </ThemeProvider>
      </ThemeProvider>,
    );
    expect(getThemeForElement(screen.getByText("Outer"))).toMatchObject({
      "--ezui-theme-color-text": "red",
    });
    expect(getThemeForElement(screen.getByText("Inner"))).toMatchObject({
      "--ezui-theme-color-text": "green",
    });
  });

  it("should render inverted color scheme", () => {
    render(
      <ThemeProvider theme={theme}>
        <div>Outer</div>
        <ThemeProvider colorScheme="inverted">
          <div>Middle</div>
          <ThemeProvider colorScheme="inverted">
            <div>Inner</div>
          </ThemeProvider>
        </ThemeProvider>
      </ThemeProvider>,
    );
    expect(getThemeForElement(screen.getByText("Outer"))).toMatchObject({
      "--ezui-theme-color-text": "black",
    });
    expect(getThemeForElement(screen.getByText("Middle"))).toMatchObject({
      "--ezui-theme-color-text": "white",
    });
    expect(getThemeForElement(screen.getByText("Inner"))).toMatchObject({
      "--ezui-theme-color-text": "black",
    });
  });

  it("should support changing theme", () => {
    const { rerender } = render(
      <ThemeProvider theme={greenTheme}>
        <div>Child</div>
      </ThemeProvider>,
    );
    rerender(
      <ThemeProvider theme={redTheme}>
        <div>Child</div>
      </ThemeProvider>,
    );
    expect(getThemeForElement(screen.getByText("Child"))).toMatchObject({
      "--ezui-theme-color-text": "red",
    });
  });

  it("should support changing color scheme", () => {
    const { rerender } = render(
      <ThemeProvider theme={theme} colorScheme="light">
        <div>Child</div>
      </ThemeProvider>,
    );
    rerender(
      <ThemeProvider theme={theme} colorScheme="dark">
        <div>Child</div>
      </ThemeProvider>,
    );
    expect(getThemeForElement(screen.getByText("Child"))).toMatchObject({
      "--ezui-theme-color-text": "white",
    });
  });
});

/**
 * Returns the closest theme for the given element.
 *
 * @remarks
 * jsdom and jest-dom have poor support for dynamic CSS variables, which we're
 * using in our theming, so we need a helper for testing them. Ideally we would
 * just use `toHaveStyle` on the elements instead of having to worry about
 * implementation details.
 *
 * {@link https://github.com/testing-library/jest-dom/issues/322}
 * {@link https://github.com/jsdom/jsdom/pull/3299}
 * {@link https://github.com/jsdom/cssstyle/pull/127}
 *
 * @param $el Element from where to start searching for theme
 * @returns Theme object styles
 */
function getThemeForElement($el: Node): object {
  const $parent = $el.parentNode;
  if (!$parent) {
    throw new Error("Theme not found");
  }
  const $children = $parent.children;
  const $elIndex = [...$children].findIndex(($child) => $child === $el);
  const $style =
    $elIndex > 0 &&
    $children
      .item($elIndex - 1)
      ?.getAttribute("id")
      ?.startsWith("ezui-theme-style-")
      ? $children.item($elIndex - 1)
      : null;
  if ($style) {
    const contents = $style.innerHTML;
    const matches = contents.match(/\{([^}]+)\}/g);
    if (!matches) {
      throw new Error("Invalid theme object");
    }
    const selectors = Object.fromEntries(
      matches[0]
        .replace(/[{}]/g, "")
        .trim()
        .split(";")
        .filter((s) => Boolean(s))
        .map((s) => s.trim().split(": ")),
    );
    return selectors;
  }
  return getThemeForElement($parent);
}
