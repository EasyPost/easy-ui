import { render, screen } from "@testing-library/react";
import React from "react";
import {
  getComponentDesignToken,
  getComponentThemeToken,
  getComponentToken,
  getResponsiveDesignToken,
} from "../utilities/css";
import { Box } from "./Box";

describe("<Box />", () => {
  const props = { children: <div>Content</div> };

  function getBox() {
    return screen.getByText("Content").parentElement as HTMLElement;
  }

  /**
   * Box declares the four corner longhands rather than the `border-radius`
   * shorthand, so a radius assertion names the corners it expects. Corners left
   * out of `corners` are left out of the expectation too, which is what an
   * unset corner looks like.
   */
  function borderRadiusStyle(corners: {
    topLeft?: string;
    topRight?: string;
    bottomRight?: string;
    bottomLeft?: string;
  }) {
    const properties = {
      topLeft: "border-top-left-radius",
      topRight: "border-top-right-radius",
      bottomRight: "border-bottom-right-radius",
      bottomLeft: "border-bottom-left-radius",
    } as const;
    return Object.entries(corners).reduce(
      (style, [corner, value]) => ({
        ...style,
        ...getComponentToken(
          "box",
          `${properties[corner as keyof typeof properties]}-xs`,
          value,
        ),
      }),
      {},
    );
  }

  it("should render its content", () => {
    render(<Box {...props} />);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("should render a div by default", () => {
    render(<Box {...props} />);
    expect(getBox().tagName).toBe("DIV");
  });

  it("should support as", () => {
    render(<Box {...props} as="section" />);
    expect(getBox().tagName).toBe("SECTION");
  });

  it("should support a ref", () => {
    const ref = React.createRef<HTMLElement>();
    render(<Box {...props} ref={ref} />);
    expect(ref.current).toBe(getBox());
  });

  it("should pass through html attributes", () => {
    render(<Box {...props} id="content-box" aria-label="Content box" />);
    expect(getBox()).toHaveAttribute("id", "content-box");
    expect(getBox()).toHaveAccessibleName("Content box");
  });

  describe("space", () => {
    it("should support padding", () => {
      render(<Box {...props} padding="2" />);
      for (const side of ["top", "right", "bottom", "left"]) {
        expect(getBox()).toHaveStyle(
          getResponsiveDesignToken("box", `padding-${side}`, "space", "2"),
        );
      }
    });

    it("should support responsive padding", () => {
      render(<Box {...props} padding={{ xs: "2", md: "4" }} />);
      expect(getBox()).toHaveStyle(
        getResponsiveDesignToken("box", "padding-top", "space", {
          xs: "2",
          md: "4",
        }),
      );
    });

    it("should support axis padding", () => {
      render(<Box {...props} paddingX="2" paddingY="4" />);
      expect(getBox()).toHaveStyle({
        ...getResponsiveDesignToken("box", "padding-left", "space", "2"),
        ...getResponsiveDesignToken("box", "padding-right", "space", "2"),
        ...getResponsiveDesignToken("box", "padding-top", "space", "4"),
        ...getResponsiveDesignToken("box", "padding-bottom", "space", "4"),
      });
    });

    it("should let a specific side win over an axis and a shorthand", () => {
      render(<Box {...props} padding="1" paddingY="2" paddingTop="3" />);
      expect(getBox()).toHaveStyle({
        ...getResponsiveDesignToken("box", "padding-top", "space", "3"),
        ...getResponsiveDesignToken("box", "padding-bottom", "space", "2"),
        ...getResponsiveDesignToken("box", "padding-left", "space", "1"),
      });
    });

    it("should support a zero space token", () => {
      render(<Box {...props} padding="0" />);
      expect(getBox()).toHaveStyle(
        getResponsiveDesignToken("box", "padding-top", "space", "0"),
      );
    });

    it("should support margin", () => {
      render(<Box {...props} margin="2" />);
      expect(getBox()).toHaveStyle(
        getComponentToken("box", "margin-top-xs", "var(--ezui-space-2)"),
      );
    });

    it("should support negative margin", () => {
      render(<Box {...props} marginTop="-1.5" />);
      expect(getBox()).toHaveStyle(
        getComponentToken(
          "box",
          "margin-top-xs",
          "calc(var(--ezui-space-1-5) * -1)",
        ),
      );
    });

    it("should support auto margin", () => {
      render(<Box {...props} marginX="auto" />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "margin-left-xs", "auto"),
        ...getComponentToken("box", "margin-right-xs", "auto"),
      });
    });

    it("should support gap", () => {
      render(<Box {...props} gap="2" />);
      expect(getBox()).toHaveStyle({
        ...getResponsiveDesignToken("box", "column-gap", "space", "2"),
        ...getResponsiveDesignToken("box", "row-gap", "space", "2"),
      });
    });

    it("should let an axis gap win over gap", () => {
      render(<Box {...props} gap="2" rowGap="4" />);
      expect(getBox()).toHaveStyle({
        ...getResponsiveDesignToken("box", "column-gap", "space", "2"),
        ...getResponsiveDesignToken("box", "row-gap", "space", "4"),
      });
    });
  });

  describe("size", () => {
    it("should treat numbers as px", () => {
      render(<Box {...props} width={240} />);
      expect(getBox()).toHaveStyle(
        getComponentToken("box", "width-xs", "240px"),
      );
    });

    it("should pass strings through untouched", () => {
      render(<Box {...props} height="calc(100vh - 96px)" />);
      expect(getBox()).toHaveStyle(
        getComponentToken("box", "height-xs", "calc(100vh - 96px)"),
      );
    });

    it("should support a constrained centered container", () => {
      render(<Box {...props} width="100%" maxWidth={700} marginX="auto" />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "width-xs", "100%"),
        ...getComponentToken("box", "max-width-xs", "700px"),
        ...getComponentToken("box", "margin-left-xs", "auto"),
      });
    });

    it("should support responsive sizes", () => {
      render(<Box {...props} maxWidth={{ xs: "100%", lg: 900 }} />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "max-width-xs", "100%"),
        ...getComponentToken("box", "max-width-lg", "900px"),
      });
    });

    it("should support aspect ratio without inferring px", () => {
      render(<Box {...props} aspectRatio="16 / 9" minHeight={0} />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "aspect-ratio-xs", "16 / 9"),
        ...getComponentToken("box", "min-height-xs", "0px"),
      });
    });
  });

  describe("surface", () => {
    it("should support background", () => {
      render(<Box {...props} background="primary.500" />);
      expect(getBox()).toHaveStyle(
        getComponentToken(
          "box",
          "background-xs",
          "var(--ezui-color-primary-500)",
        ),
      );
    });

    it("should support color", () => {
      render(<Box {...props} color="neutral.900" />);
      expect(getBox()).toHaveStyle(
        getComponentThemeToken("box", "color", "color", "neutral.900"),
      );
    });

    it("should support border radius", () => {
      render(<Box {...props} borderRadius="lg" />);
      expect(getBox()).toHaveStyle(
        borderRadiusStyle({
          topLeft: "var(--ezui-shape-border-radius-lg)",
          topRight: "var(--ezui-shape-border-radius-lg)",
          bottomRight: "var(--ezui-shape-border-radius-lg)",
          bottomLeft: "var(--ezui-shape-border-radius-lg)",
        }),
      );
    });

    it("should support a fully rounded border radius", () => {
      render(<Box {...props} borderRadius="full" />);
      expect(getBox()).toHaveStyle(
        borderRadiusStyle({
          topLeft: "9999px",
          topRight: "9999px",
          bottomRight: "9999px",
          bottomLeft: "9999px",
        }),
      );
    });

    it("should support border radius on an edge pair", () => {
      render(<Box {...props} borderRadiusBottom="md" />);
      expect(getBox()).toHaveStyle(
        borderRadiusStyle({
          bottomRight: "var(--ezui-shape-border-radius-md)",
          bottomLeft: "var(--ezui-shape-border-radius-md)",
        }),
      );
    });

    it("should support border radius on a single corner", () => {
      render(<Box {...props} borderRadiusTopRight="sm" />);
      expect(getBox()).toHaveStyle(
        borderRadiusStyle({ topRight: "var(--ezui-shape-border-radius-sm)" }),
      );
    });

    it("should let a corner border radius win over an edge and a shorthand", () => {
      render(
        <Box
          {...props}
          borderRadius="lg"
          borderRadiusTop="md"
          borderRadiusTopLeft="sm"
        />,
      );
      expect(getBox()).toHaveStyle(
        borderRadiusStyle({
          topLeft: "var(--ezui-shape-border-radius-sm)",
          topRight: "var(--ezui-shape-border-radius-md)",
          bottomRight: "var(--ezui-shape-border-radius-lg)",
          bottomLeft: "var(--ezui-shape-border-radius-lg)",
        }),
      );
    });

    it("should let a horizontal edge border radius win over a vertical one", () => {
      render(<Box {...props} borderRadiusTop="md" borderRadiusLeft="sm" />);
      expect(getBox()).toHaveStyle(
        borderRadiusStyle({
          topLeft: "var(--ezui-shape-border-radius-md)",
          topRight: "var(--ezui-shape-border-radius-md)",
          bottomLeft: "var(--ezui-shape-border-radius-sm)",
        }),
      );
    });

    it("should support box shadow", () => {
      render(<Box {...props} boxShadow="2" />);
      expect(getBox()).toHaveStyle(
        getComponentDesignToken("box", "box-shadow", "shadow.level", "2"),
      );
    });

    it("should infer a solid border width from a border color", () => {
      render(<Box {...props} borderColor="neutral.100" />);
      expect(getBox()).toHaveStyle({
        ...getComponentThemeToken(
          "box",
          "border-color",
          "color",
          "neutral.100",
        ),
        ...getComponentToken("box", "border-style", "solid"),
        ...getComponentDesignToken(
          "box",
          "border-top-width",
          "shape.border_width",
          "1",
        ),
      });
    });

    it("should apply a border width to every side", () => {
      render(<Box {...props} borderWidth="1" />);
      for (const side of ["top", "right", "bottom", "left"]) {
        expect(getBox()).toHaveStyle(
          getComponentDesignToken(
            "box",
            `border-${side}-width`,
            "shape.border_width",
            "1",
          ),
        );
      }
    });

    it("should leave other sides unset for a single-side border width", () => {
      render(
        <Box {...props} borderBottomWidth="1" borderColor="neutral.100" />,
      );
      expect(getBox()).toHaveStyle(
        getComponentDesignToken(
          "box",
          "border-bottom-width",
          "shape.border_width",
          "1",
        ),
      );
      expect(
        getBox().style.getPropertyValue("--ezui-c-box-border-top-width"),
      ).toBe("");
    });

    it("should not infer a border style without a border", () => {
      render(<Box {...props} background="neutral.000" />);
      expect(getBox().style.getPropertyValue("--ezui-c-box-border-style")).toBe(
        "",
      );
    });
  });

  describe("self in parent", () => {
    it("should expand a numeric flex shorthand into longhands", () => {
      render(<Box {...props} flex="1" />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "flex-grow-xs", "1"),
        ...getComponentToken("box", "flex-shrink-xs", "1"),
        ...getComponentToken("box", "flex-basis-xs", "0%"),
      });
    });

    it("should expand the flex keywords", () => {
      render(<Box {...props} flex="none" />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "flex-grow-xs", "0"),
        ...getComponentToken("box", "flex-shrink-xs", "0"),
        ...getComponentToken("box", "flex-basis-xs", "auto"),
      });
    });

    it("should expand a multi-value flex shorthand", () => {
      render(<Box {...props} flex="0 0 200px" />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "flex-grow-xs", "0"),
        ...getComponentToken("box", "flex-shrink-xs", "0"),
        ...getComponentToken("box", "flex-basis-xs", "200px"),
      });
    });

    it("should let a flex longhand win over the shorthand", () => {
      render(<Box {...props} flex="1" flexShrink={0} />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "flex-grow-xs", "1"),
        ...getComponentToken("box", "flex-shrink-xs", "0"),
      });
    });

    it("should support unitless flex grow, shrink, and order", () => {
      render(<Box {...props} flexGrow={2} flexShrink={0} order={1} />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "flex-grow-xs", "2"),
        ...getComponentToken("box", "flex-shrink-xs", "0"),
        ...getComponentToken("box", "order-xs", "1"),
      });
    });

    it("should support align self", () => {
      render(<Box {...props} alignSelf="center" />);
      expect(getBox()).toHaveStyle(
        getComponentToken("box", "align-self-xs", "center"),
      );
    });
  });

  describe("children layout", () => {
    it("should support display", () => {
      render(<Box {...props} display="inline-flex" />);
      expect(getBox()).toHaveStyle(
        getComponentToken("box", "display-xs", "inline-flex"),
      );
    });

    it("should support responsive display", () => {
      render(<Box {...props} display={{ xs: "none", md: "block" }} />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "display-xs", "none"),
        ...getComponentToken("box", "display-md", "block"),
      });
    });

    it("should support flex container props", () => {
      render(
        <Box
          {...props}
          display="flex"
          flexDirection="column"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
        />,
      );
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "flex-direction-xs", "column"),
        ...getComponentToken("box", "flex-wrap-xs", "wrap"),
        ...getComponentToken("box", "justify-content-xs", "space-between"),
        ...getComponentToken("box", "align-items-xs", "center"),
      });
    });
  });

  describe("position", () => {
    it("should support position", () => {
      render(<Box {...props} position="sticky" />);
      expect(getBox()).toHaveStyle(
        getComponentToken("box", "position-xs", "sticky"),
      );
    });

    it("should expand inset to every edge", () => {
      render(<Box {...props} position="absolute" inset="0" />);
      for (const edge of ["top", "right", "bottom", "left"]) {
        expect(getBox()).toHaveStyle(
          getComponentToken("box", `${edge}-xs`, "var(--ezui-space-0)"),
        );
      }
    });

    it("should let an edge win over inset", () => {
      render(<Box {...props} inset="0" top="50%" />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "top-xs", "50%"),
        ...getComponentToken("box", "bottom-xs", "var(--ezui-space-0)"),
      });
    });

    it("should support free lengths for edges", () => {
      render(<Box {...props} top={-4} left="calc(50% - 8px)" />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "top-xs", "-4px"),
        ...getComponentToken("box", "left-xs", "calc(50% - 8px)"),
      });
    });

    it("should support z index", () => {
      render(<Box {...props} zIndex="modal" />);
      expect(getBox()).toHaveStyle(
        getComponentDesignToken("box", "z-index", "z-index", "modal"),
      );
    });
  });

  describe("content behavior", () => {
    it("should expand overflow to both axes", () => {
      render(<Box {...props} overflow="hidden" />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "overflow-x-xs", "hidden"),
        ...getComponentToken("box", "overflow-y-xs", "hidden"),
      });
    });

    it("should let an axis win over overflow", () => {
      render(<Box {...props} overflow="hidden" overflowY="auto" />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "overflow-x-xs", "hidden"),
        ...getComponentToken("box", "overflow-y-xs", "auto"),
      });
    });

    it("should support object fit", () => {
      render(<Box as="img" src="/logo.png" alt="" objectFit="contain" />);
      expect(screen.getByAltText("")).toHaveStyle(
        getComponentToken("box", "object-fit", "contain"),
      );
    });

    it("should support text align and white space", () => {
      render(<Box {...props} textAlign="center" whiteSpace="nowrap" />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "text-align-xs", "center"),
        ...getComponentToken("box", "white-space", "nowrap"),
      });
    });
  });

  describe("interaction", () => {
    it("should support cursor and pointer events", () => {
      render(<Box {...props} cursor="pointer" pointerEvents="none" />);
      expect(getBox()).toHaveStyle({
        ...getComponentToken("box", "cursor", "pointer"),
        ...getComponentToken("box", "pointer-events", "none"),
      });
    });

    it("should support opacity", () => {
      render(<Box {...props} opacity="underlay" />);
      expect(getBox()).toHaveStyle(
        getComponentDesignToken("box", "opacity", "opacity", "underlay"),
      );
    });
  });

  describe("resets", () => {
    it("should reset a button", () => {
      render(<Box as="button" onClick={() => {}} {...props} />);
      expect(screen.getByRole("button")).toHaveAttribute(
        "class",
        expect.stringContaining("_buttonReset_"),
      );
    });

    it("should reset a link", () => {
      render(<Box as="a" href="/home" {...props} />);
      expect(screen.getByRole("link")).toHaveAttribute(
        "class",
        expect.stringContaining("_linkReset_"),
      );
    });

    it.each(["ul", "ol"] as const)("should reset a %s", (as) => {
      render(<Box as={as} {...props} />);
      expect(getBox()).toHaveAttribute(
        "class",
        expect.stringContaining("_listReset_"),
      );
    });

    it("should reset a fieldset", () => {
      render(<Box as="fieldset" {...props} />);
      expect(getBox()).toHaveAttribute(
        "class",
        expect.stringContaining("_fieldsetReset_"),
      );
    });

    it("should reset a legend", () => {
      render(<Box as="legend" {...props} />);
      expect(getBox()).toHaveAttribute(
        "class",
        expect.stringContaining("_legendReset_"),
      );
    });

    it("should not reset a div", () => {
      render(<Box {...props} />);
      expect(getBox()).not.toHaveAttribute(
        "class",
        expect.stringContaining("Reset"),
      );
    });
  });

  describe("escape hatches", () => {
    it("should not support className", () => {
      // @ts-expect-error testing className omission
      render(<Box {...props} className="extend" />);
      expect(getBox()).not.toHaveAttribute(
        "class",
        expect.stringContaining("extend"),
      );
      expect(getBox()).toHaveAttribute(
        "class",
        expect.stringContaining("_Box_"),
      );
    });

    it("should not support style", () => {
      // @ts-expect-error testing style omission
      render(<Box {...props} style={{ color: "red" }} padding="2" />);
      expect(getBox().style.color).toBe("");
      expect(getBox()).toHaveStyle(
        getResponsiveDesignToken("box", "padding-top", "space", "2"),
      );
    });
  });

  // A custom property left unset is guaranteed-invalid, which resolves the
  // declaration that reads it to `unset`—and for a non-inherited property that
  // is the CSS initial value, not "no declaration at all". For most of Box's
  // properties the initial value is already the right default, but for these it
  // is not: `display` would make every `<Box />` inline, `overflow` would let an
  // `objectFit="cover"` image paint outside an `<img />`, and `text-align` would
  // drop a `<button />`'s centering. Each has to fall back to `revert` so an
  // unstyled `<Box />` keeps its element's own default. jsdom cannot resolve
  // `var()`, so this asserts the stylesheet rather than a computed style.
  describe("element defaults", () => {
    function getBoxDeclarations(property: string) {
      return Array.from(document.styleSheets)
        .flatMap((sheet) => Array.from(sheet.cssRules))
        .map((rule) => rule.cssText)
        .filter((cssText) => cssText.includes("_Box_"))
        .flatMap((cssText) => cssText.split(";"))
        .filter((declaration) => declaration.includes(`${property}: var(`));
    }

    it.each(["display", "overflow-x", "overflow-y", "text-align"])(
      "should fall back to the user agent's %s rather than the CSS initial value",
      (property) => {
        const declarations = getBoxDeclarations(property);
        expect(declarations.length).toBeGreaterThan(0);
        declarations.forEach((declaration) => {
          expect(declaration).toContain("revert)");
        });
      },
    );
  });
});
