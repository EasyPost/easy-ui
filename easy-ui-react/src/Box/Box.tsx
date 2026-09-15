import omit from "lodash/omit";
import React, {
  AllHTMLAttributes,
  ElementType,
  ReactNode,
  forwardRef,
} from "react";
import {
  BorderRadius,
  BorderWidth,
  NegativeSpaceScale,
  Opacity,
  ResponsiveSpaceScale,
  ShadowLevel,
  SpaceScale,
  ThemeColorAliases,
  ZIndex,
} from "../types";
import {
  ResponsiveProp,
  classNames,
  getComponentDesignToken,
  getComponentThemeToken,
  getComponentToken,
  getResponsiveDesignToken,
  getResponsiveValue,
  sanitizeCustomProperties,
  tokenSafeKebabCase,
} from "../utilities/css";

import styles from "./Box.module.scss";

const COMPONENT_NAME = "box";
const DEFAULT_ELEMENT_TYPE = "div";
const DEFAULT_BORDER_WIDTH = "1";
const BORDER_RADIUS_FULL = "9999px";

/**
 * Matches a bare number, optionally negated—the shape of every space scale
 * alias (`0`, `0.5`, `1.5`, `10`). Anything with a unit, a keyword, or a
 * function is a free CSS value instead.
 */
const SPACE_SCALE_PATTERN = /^-?\d+(\.\d+)?$/;

/** Matches a bare, non-negative number, as in `flex: 2 1 auto`. */
const UNITLESS_NUMBER_PATTERN = /^\d+(\.\d+)?$/;

/** The `flex` shorthand's keywords, expanded to `[grow, shrink, basis]`. */
const FLEX_KEYWORDS: Record<string, [string, string, string]> = {
  none: ["0", "0", "auto"],
  auto: ["1", "1", "auto"],
  initial: ["0", "1", "auto"],
};

/**
 * A free CSS length. Numbers are treated as `px`; strings pass through
 * untouched, so percentages, viewport units, `calc()`, `fit-content`, and
 * `auto` all work.
 *
 * Easy UI has no size token scale, so sizing props cannot be constrained the
 * way space and color props are.
 */
export type Dimension = ResponsiveProp<number | string>;

/** A space scale alias, `auto`, or a negated space scale alias. */
export type BoxMargin = ResponsiveProp<
  SpaceScale | NegativeSpaceScale | "auto"
>;

/** A space scale alias or a free CSS length. */
export type BoxInset = ResponsiveProp<SpaceScale | number | string>;

export type BoxDisplay =
  | "block"
  | "inline-block"
  | "flex"
  | "inline-flex"
  | "grid"
  | "inline-grid"
  | "none"
  | "contents";
export type BoxFlexDirection =
  "row" | "row-reverse" | "column" | "column-reverse";
export type BoxFlexWrap = "wrap" | "nowrap" | "wrap-reverse";
export type BoxJustifyContent =
  | "start"
  | "center"
  | "end"
  | "space-around"
  | "space-between"
  | "space-evenly"
  | "stretch";
export type BoxAlignItems = "start" | "center" | "end" | "baseline" | "stretch";
export type BoxAlignSelf = "start" | "center" | "end" | "baseline" | "stretch";
export type BoxPosition =
  "static" | "relative" | "absolute" | "fixed" | "sticky";
export type BoxOverflow = "visible" | "hidden" | "clip" | "scroll" | "auto";
export type BoxObjectFit = "contain" | "cover" | "fill" | "none" | "scale-down";
export type BoxTextAlign = "start" | "center" | "end" | "justify";
export type BoxWhiteSpace =
  "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line";
export type BoxCursor =
  "auto" | "default" | "pointer" | "text" | "not-allowed" | "grab";
export type BoxPointerEvents = "auto" | "none";

/**
 * Common `flex` shorthands, with an escape for the rarer three-value forms.
 */
export type BoxFlex = "0" | "1" | "auto" | "none" | (string & {});

export type BoxStyleProps = {
  // -- Space (token, responsive) ---------------------------------------------

  /**
   * Spacing around children. Accepts a space token or an object of space
   * tokens for different screen sizes.
   *
   * @example
   * padding="2"
   * padding={{ xs: "2", md: "4" }}
   */
  padding?: ResponsiveSpaceScale;

  /** Horizontal spacing around children. */
  paddingX?: ResponsiveSpaceScale;

  /** Vertical spacing around children. */
  paddingY?: ResponsiveSpaceScale;

  /** Top spacing around children. */
  paddingTop?: ResponsiveSpaceScale;

  /** Right spacing around children. */
  paddingRight?: ResponsiveSpaceScale;

  /** Bottom spacing around children. */
  paddingBottom?: ResponsiveSpaceScale;

  /** Left spacing around children. */
  paddingLeft?: ResponsiveSpaceScale;

  /**
   * Spacing outside the box. Accepts a space token, a negated space token,
   * or `auto`.
   *
   * @example
   * marginX="auto"
   * marginTop="-2"
   */
  margin?: BoxMargin;

  /** Horizontal spacing outside the box. */
  marginX?: BoxMargin;

  /** Vertical spacing outside the box. */
  marginY?: BoxMargin;

  /** Top spacing outside the box. */
  marginTop?: BoxMargin;

  /** Right spacing outside the box. */
  marginRight?: BoxMargin;

  /** Bottom spacing outside the box. */
  marginBottom?: BoxMargin;

  /** Left spacing outside the box. */
  marginLeft?: BoxMargin;

  // -- Size (free, responsive) ----------------------------------------------

  /**
   * Width of the box. Numbers are treated as `px`.
   *
   * @example
   * width="100%"
   * width={240}
   * width="calc(100vh - 96px)"
   */
  width?: Dimension;

  /** Minimum width of the box. */
  minWidth?: Dimension;

  /** Maximum width of the box. */
  maxWidth?: Dimension;

  /** Height of the box. */
  height?: Dimension;

  /** Minimum height of the box. */
  minHeight?: Dimension;

  /** Maximum height of the box. */
  maxHeight?: Dimension;

  /** Aspect ratio of the box. */
  aspectRatio?: ResponsiveProp<string | number>;

  // -- Surface (token) ------------------------------------------------------

  /** Background color of the box. */
  background?: ResponsiveProp<ThemeColorAliases>;

  /** Text color of the box's content. */
  color?: ThemeColorAliases;

  /** Border radius of the box. `full` fully rounds the box. */
  borderRadius?: ResponsiveProp<BorderRadius | "full">;

  /**
   * Border color of the box. Setting this implies a solid `1` border width
   * unless a width is given.
   */
  borderColor?: ThemeColorAliases;

  /** Border width on every side of the box. */
  borderWidth?: BorderWidth;

  /** Top border width of the box. */
  borderTopWidth?: BorderWidth;

  /** Right border width of the box. */
  borderRightWidth?: BorderWidth;

  /** Bottom border width of the box. */
  borderBottomWidth?: BorderWidth;

  /** Left border width of the box. */
  borderLeftWidth?: BorderWidth;

  /** Shadow cast by the box. */
  boxShadow?: ShadowLevel;

  // -- Self-in-parent -------------------------------------------------------

  /**
   * How the box flexes within a flex parent, such as a `<HorizontalStack />`
   * or `<VerticalStack />`.
   *
   * @example
   * flex="1"
   */
  flex?: ResponsiveProp<BoxFlex>;

  /** How much the box grows within a flex parent. */
  flexGrow?: ResponsiveProp<number>;

  /** How much the box shrinks within a flex parent. */
  flexShrink?: ResponsiveProp<number>;

  /** Initial main size of the box within a flex parent. */
  flexBasis?: Dimension;

  /** Alignment of the box along its parent's cross axis. */
  alignSelf?: ResponsiveProp<BoxAlignSelf>;

  /** Order of the box among its siblings. */
  order?: ResponsiveProp<number>;

  // -- Children layout ------------------------------------------------------

  /**
   * Display of the box.
   *
   * @remarks
   * Prefer `<HorizontalStack />`, `<VerticalStack />`, or
   * `<HorizontalGrid />` for laying out children.
   */
  display?: ResponsiveProp<BoxDisplay>;

  /** Direction children flow when the box is a flex container. */
  flexDirection?: ResponsiveProp<BoxFlexDirection>;

  /** Whether children wrap when the box is a flex container. */
  flexWrap?: ResponsiveProp<BoxFlexWrap>;

  /** Alignment of children along the box's main axis. */
  justifyContent?: ResponsiveProp<BoxJustifyContent>;

  /** Alignment of children along the box's cross axis. */
  alignItems?: ResponsiveProp<BoxAlignItems>;

  /** Spacing between children. */
  gap?: ResponsiveSpaceScale;

  /** Horizontal spacing between children. */
  columnGap?: ResponsiveSpaceScale;

  /** Vertical spacing between children. */
  rowGap?: ResponsiveSpaceScale;

  // -- Position -------------------------------------------------------------

  /** Positioning scheme of the box. */
  position?: ResponsiveProp<BoxPosition>;

  /**
   * Distance from all edges of the box's containing block. Accepts a space
   * token or a free CSS length.
   *
   * @example
   * inset="0"
   */
  inset?: BoxInset;

  /** Distance from the top edge of the box's containing block. */
  top?: BoxInset;

  /** Distance from the right edge of the box's containing block. */
  right?: BoxInset;

  /** Distance from the bottom edge of the box's containing block. */
  bottom?: BoxInset;

  /** Distance from the left edge of the box's containing block. */
  left?: BoxInset;

  /** Stacking order of the box. */
  zIndex?: ZIndex;

  // -- Content behavior -----------------------------------------------------

  /** How overflowing content is handled on both axes. */
  overflow?: ResponsiveProp<BoxOverflow>;

  /** How horizontally overflowing content is handled. */
  overflowX?: ResponsiveProp<BoxOverflow>;

  /** How vertically overflowing content is handled. */
  overflowY?: ResponsiveProp<BoxOverflow>;

  /** How replaced content such as an `img` is fitted to the box. */
  objectFit?: BoxObjectFit;

  /** Alignment of the box's inline content. */
  textAlign?: ResponsiveProp<BoxTextAlign>;

  /** How whitespace in the box's content is handled. */
  whiteSpace?: BoxWhiteSpace;

  // -- Interaction ----------------------------------------------------------

  /** Cursor shown over the box. */
  cursor?: BoxCursor;

  /** Whether the box is a target for pointer events. */
  pointerEvents?: BoxPointerEvents;

  /** Opacity of the box. */
  opacity?: Opacity;
};

export type BoxProps = {
  /**
   * HTML element type.
   *
   * @remarks
   * `button`, `a`, `ul`, `ol`, `fieldset`, and `legend` receive an automatic
   * unstyled reset, so there is no need to strip their default styles.
   *
   * @default div
   */
  as?: ElementType;

  /** Content of the box. */
  children?: ReactNode;
} & BoxStyleProps &
  Omit<
    AllHTMLAttributes<HTMLElement>,
    keyof BoxStyleProps | "as" | "children" | "className" | "style"
  >;

/**
 * Maps the values of a responsive prop through a resolver, preserving the
 * breakpoint structure so the result can be handed to `getResponsiveValue()`.
 *
 * Values are resolved to finished CSS strings, which means
 * `getResponsiveValue()` passes them through without inferring units.
 */
function mapResponsiveProp<T extends string | number>(
  responsiveProp: ResponsiveProp<T> | undefined,
  resolve: (value: T) => string,
): ResponsiveProp<string> | undefined {
  if (responsiveProp == null) {
    return undefined;
  }
  if (
    typeof responsiveProp === "string" ||
    typeof responsiveProp === "number"
  ) {
    return resolve(responsiveProp);
  }
  return Object.fromEntries(
    Object.entries(responsiveProp)
      .filter(([, value]) => value != null)
      .map(([breakpointAlias, value]) => [
        breakpointAlias,
        resolve(value as T),
      ]),
  );
}

/** Shorthand for writing a resolved responsive prop to component tokens. */
function getResponsiveResolvedValue<T extends string | number>(
  componentProp: string,
  responsiveProp: ResponsiveProp<T> | undefined,
  resolve: (value: T) => string,
) {
  return getResponsiveValue(
    COMPONENT_NAME,
    componentProp,
    mapResponsiveProp(responsiveProp, resolve),
  );
}

/**
 * Resolves a space scale alias to its token, negating it when the alias is
 * prefixed with `-`. Anything else—`auto`, a free length—passes through.
 */
function resolveSpace(value: string | number): string {
  if (typeof value === "number") {
    return `${value}px`;
  }
  if (!SPACE_SCALE_PATTERN.test(value)) {
    return value;
  }
  const isNegative = value.startsWith("-");
  const alias = isNegative ? value.slice(1) : value;
  const token = `var(--ezui-space-${tokenSafeKebabCase(alias)})`;
  return isNegative ? `calc(${token} * -1)` : token;
}

/** Resolves a free CSS length, treating numbers as `px`. */
function resolveDimension(value: string | number): string {
  return typeof value === "number" ? `${value}px` : value;
}

/** Resolves a value that is already valid CSS, without inferring units. */
function resolveRaw(value: string | number): string {
  return String(value);
}

function resolveBorderRadius(value: string): string {
  return value === "full"
    ? BORDER_RADIUS_FULL
    : `var(--ezui-shape-border-radius-${tokenSafeKebabCase(value)})`;
}

function resolveThemeColor(value: string): string {
  return `var(--ezui-color-${tokenSafeKebabCase(value)})`;
}

/**
 * Expands the `flex` shorthand into `[flex-grow, flex-shrink, flex-basis]`.
 *
 * @remarks
 * Box declares the three longhands rather than the shorthand. A component token
 * that goes unset resolves to `unset`, which resets a property to its initial
 * value—so a `flex-grow` declaration sitting alongside a `flex` declaration
 * would undo whatever the shorthand had just set.
 */
function expandFlex(value: string): [string, string, string] {
  const trimmed = value.trim();
  if (FLEX_KEYWORDS[trimmed]) {
    return FLEX_KEYWORDS[trimmed];
  }
  const [first, second, third] = trimmed.split(/\s+/);
  if (second == null) {
    return UNITLESS_NUMBER_PATTERN.test(first)
      ? [first, "1", "0%"]
      : ["1", "1", first];
  }
  if (third == null) {
    return UNITLESS_NUMBER_PATTERN.test(second)
      ? [first, second, "0%"]
      : [first, "1", second];
  }
  return [first, second, third];
}

/**
 * A general-purpose container that exposes Easy UI's design tokens as props.
 *
 * @remarks
 * Properties backed by a token scale—space, color, border radius, shadow,
 * z-index—are constrained to that scale. Sizing and positioning accept free
 * CSS values, because Easy UI has no size token scale.
 *
 * `<Box />` deliberately accepts neither `className` nor `style`. If it cannot
 * express something you need, that is a gap in `<Box />` worth filing.
 *
 * Prefer `<HorizontalStack />`, `<VerticalStack />`, and `<HorizontalGrid />`
 * for laying out children; reach for `display` on `<Box />` only when those
 * do not fit.
 *
 * @example
 * _Surface:_
 * ```tsx
 * <Box background="neutral.050" padding="4" borderRadius="lg">
 *   Content
 * </Box>
 * ```
 *
 * @example
 * _Constrained, centered container:_
 * ```tsx
 * <Box width="100%" maxWidth={700} marginX="auto" padding="2">
 *   Content
 * </Box>
 * ```
 *
 * @example
 * _Flexing within a stack:_
 * ```tsx
 * <HorizontalStack gap="2">
 *   <Box flex="1">Fills the remaining space</Box>
 * </HorizontalStack>
 * ```
 *
 * @example
 * _Overlay:_
 * ```tsx
 * <Box position="absolute" inset="0" display="flex" alignItems="center">
 *   <Spinner />
 * </Box>
 * ```
 */
export const Box = forwardRef<HTMLElement, BoxProps>((props, ref) => {
  const {
    as: As = DEFAULT_ELEMENT_TYPE,
    children,

    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,

    margin,
    marginX,
    marginY,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,

    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    aspectRatio,

    background,
    color,
    borderRadius,
    borderColor,
    borderWidth,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
    boxShadow,

    flex,
    flexGrow,
    flexShrink,
    flexBasis,
    alignSelf,
    order,

    display,
    flexDirection,
    flexWrap,
    justifyContent,
    alignItems,
    gap,
    columnGap,
    rowGap,

    position,
    inset,
    top,
    right,
    bottom,
    left,
    zIndex,

    overflow,
    overflowX,
    overflowY,
    objectFit,
    textAlign,
    whiteSpace,

    cursor,
    pointerEvents,
    opacity,

    ...restProps
  } = props;

  const hasAnyBorderWidth =
    borderWidth != null ||
    borderTopWidth != null ||
    borderRightWidth != null ||
    borderBottomWidth != null ||
    borderLeftWidth != null;

  // Mirrors Polaris: a border only needs a color or a width to be intended,
  // so the style is inferred rather than exposed as a prop.
  const borderStyle =
    hasAnyBorderWidth || borderColor != null ? "solid" : undefined;

  // A color on its own would otherwise render at CSS's `medium` default.
  const baseBorderWidth =
    borderWidth ??
    (borderColor != null && !hasAnyBorderWidth
      ? DEFAULT_BORDER_WIDTH
      : undefined);

  // `flex` is expanded here rather than declared as a shorthand in CSS; see
  // `expandFlex()`. An explicit longhand wins over the shorthand outright,
  // matching how `paddingTop` wins over `padding`.
  const flexGrowValue =
    mapResponsiveProp(flexGrow, resolveRaw) ??
    mapResponsiveProp(flex, (value) => expandFlex(value)[0]);
  const flexShrinkValue =
    mapResponsiveProp(flexShrink, resolveRaw) ??
    mapResponsiveProp(flex, (value) => expandFlex(value)[1]);
  const flexBasisValue =
    mapResponsiveProp(flexBasis, resolveDimension) ??
    mapResponsiveProp(flex, (value) => expandFlex(value)[2]);

  const style = {
    // -- Space --------------------------------------------------------------
    ...getResponsiveDesignToken(
      COMPONENT_NAME,
      "padding-top",
      "space",
      paddingTop ?? paddingY ?? padding,
    ),
    ...getResponsiveDesignToken(
      COMPONENT_NAME,
      "padding-right",
      "space",
      paddingRight ?? paddingX ?? padding,
    ),
    ...getResponsiveDesignToken(
      COMPONENT_NAME,
      "padding-bottom",
      "space",
      paddingBottom ?? paddingY ?? padding,
    ),
    ...getResponsiveDesignToken(
      COMPONENT_NAME,
      "padding-left",
      "space",
      paddingLeft ?? paddingX ?? padding,
    ),

    ...getResponsiveResolvedValue(
      "margin-top",
      marginTop ?? marginY ?? margin,
      resolveSpace,
    ),
    ...getResponsiveResolvedValue(
      "margin-right",
      marginRight ?? marginX ?? margin,
      resolveSpace,
    ),
    ...getResponsiveResolvedValue(
      "margin-bottom",
      marginBottom ?? marginY ?? margin,
      resolveSpace,
    ),
    ...getResponsiveResolvedValue(
      "margin-left",
      marginLeft ?? marginX ?? margin,
      resolveSpace,
    ),

    // -- Size ---------------------------------------------------------------
    ...getResponsiveResolvedValue("width", width, resolveDimension),
    ...getResponsiveResolvedValue("min-width", minWidth, resolveDimension),
    ...getResponsiveResolvedValue("max-width", maxWidth, resolveDimension),
    ...getResponsiveResolvedValue("height", height, resolveDimension),
    ...getResponsiveResolvedValue("min-height", minHeight, resolveDimension),
    ...getResponsiveResolvedValue("max-height", maxHeight, resolveDimension),
    ...getResponsiveResolvedValue("aspect-ratio", aspectRatio, resolveRaw),

    // -- Surface ------------------------------------------------------------
    ...getResponsiveResolvedValue("background", background, resolveThemeColor),
    ...getComponentThemeToken(COMPONENT_NAME, "color", "color", color),
    ...getResponsiveResolvedValue(
      "border-radius",
      borderRadius,
      resolveBorderRadius,
    ),
    ...getComponentThemeToken(
      COMPONENT_NAME,
      "border-color",
      "color",
      borderColor,
    ),
    ...getComponentToken(COMPONENT_NAME, "border-style", borderStyle),
    ...getComponentDesignToken(
      COMPONENT_NAME,
      "border-top-width",
      "shape.border_width",
      borderTopWidth ?? baseBorderWidth,
    ),
    ...getComponentDesignToken(
      COMPONENT_NAME,
      "border-right-width",
      "shape.border_width",
      borderRightWidth ?? baseBorderWidth,
    ),
    ...getComponentDesignToken(
      COMPONENT_NAME,
      "border-bottom-width",
      "shape.border_width",
      borderBottomWidth ?? baseBorderWidth,
    ),
    ...getComponentDesignToken(
      COMPONENT_NAME,
      "border-left-width",
      "shape.border_width",
      borderLeftWidth ?? baseBorderWidth,
    ),
    ...getComponentDesignToken(
      COMPONENT_NAME,
      "box-shadow",
      "shadow.level",
      boxShadow,
    ),

    // -- Self-in-parent -----------------------------------------------------
    ...getResponsiveValue(COMPONENT_NAME, "flex-grow", flexGrowValue),
    ...getResponsiveValue(COMPONENT_NAME, "flex-shrink", flexShrinkValue),
    ...getResponsiveValue(COMPONENT_NAME, "flex-basis", flexBasisValue),
    ...getResponsiveResolvedValue("align-self", alignSelf, resolveRaw),
    ...getResponsiveResolvedValue("order", order, resolveRaw),

    // -- Children layout ----------------------------------------------------
    ...getResponsiveResolvedValue("display", display, resolveRaw),
    ...getResponsiveResolvedValue("flex-direction", flexDirection, resolveRaw),
    ...getResponsiveResolvedValue("flex-wrap", flexWrap, resolveRaw),
    ...getResponsiveResolvedValue(
      "justify-content",
      justifyContent,
      resolveRaw,
    ),
    ...getResponsiveResolvedValue("align-items", alignItems, resolveRaw),
    ...getResponsiveDesignToken(
      COMPONENT_NAME,
      "column-gap",
      "space",
      columnGap ?? gap,
    ),
    ...getResponsiveDesignToken(
      COMPONENT_NAME,
      "row-gap",
      "space",
      rowGap ?? gap,
    ),

    // -- Position -----------------------------------------------------------
    ...getResponsiveResolvedValue("position", position, resolveRaw),
    ...getResponsiveResolvedValue("top", top ?? inset, resolveSpace),
    ...getResponsiveResolvedValue("right", right ?? inset, resolveSpace),
    ...getResponsiveResolvedValue("bottom", bottom ?? inset, resolveSpace),
    ...getResponsiveResolvedValue("left", left ?? inset, resolveSpace),
    ...getComponentDesignToken(COMPONENT_NAME, "z-index", "z-index", zIndex),

    // -- Content behavior ---------------------------------------------------
    ...getResponsiveResolvedValue(
      "overflow-x",
      overflowX ?? overflow,
      resolveRaw,
    ),
    ...getResponsiveResolvedValue(
      "overflow-y",
      overflowY ?? overflow,
      resolveRaw,
    ),
    ...getComponentToken(COMPONENT_NAME, "object-fit", objectFit),
    ...getResponsiveResolvedValue("text-align", textAlign, resolveRaw),
    ...getComponentToken(COMPONENT_NAME, "white-space", whiteSpace),

    // -- Interaction --------------------------------------------------------
    ...getComponentToken(COMPONENT_NAME, "cursor", cursor),
    ...getComponentToken(COMPONENT_NAME, "pointer-events", pointerEvents),
    ...getComponentDesignToken(COMPONENT_NAME, "opacity", "opacity", opacity),
  } as React.CSSProperties;

  const className = classNames(
    styles.Box,
    As === "button" && styles.buttonReset,
    As === "a" && styles.linkReset,
    (As === "ul" || As === "ol") && styles.listReset,
    As === "fieldset" && styles.fieldsetReset,
    As === "legend" && styles.legendReset,
  );

  return (
    <As
      {...omit(restProps, ["className", "style"])}
      className={className}
      style={sanitizeCustomProperties(style)}
      ref={ref}
    >
      {children}
    </As>
  );
});

Box.displayName = "Box";
