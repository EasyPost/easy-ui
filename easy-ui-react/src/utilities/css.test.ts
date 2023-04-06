import {
  classNames,
  variationName,
  getResponsiveDesignToken,
  getResponsiveValue,
  getComponentDesignToken,
  getComponentThemeToken,
} from "./css";

describe("classNames", () => {
  it("returns a single string from multiple classes", () => {
    expect(classNames("btn", "btn-sm")).toBe("btn btn-sm");
  });

  it("filters out falsy values", () => {
    expect(
      classNames(
        "btn",
        true && "btn-sm",
        false && "b",
        undefined && "c",
        null && "d",
        0 && "e",
      ),
    ).toBe("btn btn-sm");
  });
});

describe("variationName", () => {
  it("returns a name with the first character in the value capitalized", () => {
    expect(variationName("size", "medium")).toBe("sizeMedium");
  });
});

describe("getComponentDesignToken", () => {
  it("takes a string and returns the custom token", () => {
    expect(
      getComponentDesignToken("stack", "space", "space", "4"),
    ).toMatchObject({
      "--ezui-c-stack-space": "var(--ezui-space-4)",
    });
  });
});

describe("getComponentThemeToken", () => {
  it("takes a string and returns the custom token", () => {
    expect(
      getComponentThemeToken("icon", "color", "color.text", "disabled"),
    ).toMatchObject({
      "--ezui-c-icon-color": "var(--ezui-t-color-text-disabled)",
    });
  });
});

describe("getResponsiveDesignToken", () => {
  it("takes a string and returns the custom token", () => {
    expect(
      getResponsiveDesignToken("stack", "space", "space", "4"),
    ).toMatchObject({
      "--ezui-c-stack-space-xs": "var(--ezui-space-4)",
    });
  });
  it("takes an object with a breakpoint and value and returns the token for each breakpoint", () => {
    expect(
      getResponsiveDesignToken("stack", "space", "space", {
        xs: "2",
        md: "8",
      }),
    ).toMatchObject({
      "--ezui-c-stack-space-xs": "var(--ezui-space-2)",
      "--ezui-c-stack-space-md": "var(--ezui-space-8)",
    });
  });
});

describe("getResponsiveValue", () => {
  it("takes a string and returns the custom value", () => {
    expect(getResponsiveValue("stack", "space", "4")).toMatchObject({
      "--ezui-c-stack-space-xs": "4",
    });
  });
  it("takes an object with a breakpoint and value and returns the value for each breakpoint", () => {
    expect(
      getResponsiveValue("stack", "space", { xs: "2", md: "8" }),
    ).toMatchObject({
      "--ezui-c-stack-space-xs": "2",
      "--ezui-c-stack-space-md": "8",
    });
  });
  it("takes an object with a breakpoint and null value and sanitizes its output", () => {
    expect(
      getResponsiveValue("stack", "space", { xs: "2", md: undefined }),
    ).toMatchObject({
      "--ezui-c-stack-space-xs": "2",
    });
  });
});
