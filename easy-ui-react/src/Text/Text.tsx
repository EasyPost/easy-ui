import React, { HTMLAttributes, ReactNode } from "react";
import { DesignTokenNamespace, ThemeColorAliases } from "../types";
import {
  backwardsCompatibleColorToken,
  classNames,
  getComponentThemeToken,
  variationName,
} from "../utilities/css";

import styles from "./Text.module.scss";

export type TextAs =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "legend"
  | "p"
  | "span"
  | "strong";
export type TextColor =
  | ThemeColorAliases
  | "action"
  | "danger"
  | "disabled"
  | "gray.bold"
  | "gray.resting"
  | "inverse"
  | "primary"
  | "subdued";
export type TextVariant = DesignTokenNamespace<"font.style", "family">;
export type TextWeight = "normal" | "medium" | "semibold" | "bold";
export type TextTransform = "none" | "capitalize" | "uppercase" | "lowercase";
export type TextWhiteSpace =
  | "normal"
  | "pre"
  | "nowrap"
  | "pre-wrap"
  | "break-spaces"
  | "pre-line";
export type FontVariantNumeric = "normal" | "tabular-nums";

export type TextProps = {
  /** Adjusts horizontal alignment of text */
  alignment?: "start" | "center" | "end" | "justify";
  /* Adjusts the underlying element of the text */
  as?: TextAs;
  /** Prevent text from overflowing inline container */
  breakWord?: boolean;
  /** Text to display */
  children: ReactNode;
  /** Adjust color of text */
  color?: TextColor;
  /** Adjust the font variant */
  fontVariantNumeric?: FontVariantNumeric;
  /** HTML id attribute */
  id?: string;
  /** HTML role attribute */
  role?: HTMLAttributes<"span">["role"];
  /** Transform text */
  transform?: TextTransform;
  /** Truncate text overflow with ellipsis */
  truncate?: boolean;
  /** Adjusts the style of text that's rendered */
  variant?: TextVariant;
  /** Visually hide the text but keep it accessible */
  visuallyHidden?: boolean;
  /** Adjust weight of text */
  weight?: TextWeight;
  /** Adjust white space of text */
  whiteSpace?: TextWhiteSpace;
};

/**
 * A typography helper that will apply text styles to the text inside.
 *
 * @remarks
 * Accepts an Easy UI text variant along with other font-related props to adjust
 * the rendered text within Easy UI's constraint system.
 *
 * This component is helpful in product-facing scenarios where components tend
 * to be used all the way down the stack, it may be less helpful in
 * marketing-facing situations where long-form prose is required.
 *
 * @example
 * Standard body text:
 * ```tsx
 * <Text variant="body1">Standard body text rendered as a span</Text>
 * ```
 *
 * @example
 * Working with alignment and color:
 * ```tsx
 * <Text variant="body1" alignment="center" color="primary.800">
 *   Standard body text rendered as a span, centered, and colored blue 500
 * </Text>
 * ```
 *
 * @example
 * Working with headings:
 * ```tsx
 * <Text variant="heading2" as="h2" id="unique-heading-id">
 *   Heading level 2 text
 * </Text>
 * ```
 *
 * @example
 * Visually hidden for accessibility purposes:
 * ```tsx
 * <Text visuallyHidden>
 *   Description of icon or image visually hidden but still in tree
 * </Text>
 * ```
 */
export function Text({
  alignment,
  as: Component = "span",
  breakWord = false,
  children,
  color,
  fontVariantNumeric,
  id,
  transform = "none",
  truncate = false,
  variant,
  visuallyHidden = false,
  weight,
  whiteSpace,
}: TextProps) {
  const className = classNames(
    styles.Text,
    variant && styles[cleanVariant(variant)],
    weight && styles[weight],
    (alignment || truncate) && styles.block,
    alignment && styles[alignment],
    breakWord && styles.break,
    truncate && styles.truncate,
    visuallyHidden && styles.visuallyHidden,
    transform && styles[variationName("transform", transform)],
    whiteSpace && styles[variationName("whiteSpace", whiteSpace)],
    fontVariantNumeric &&
      styles[variationName("fontVariantNumeric", fontVariantNumeric)],
  );

  const style = {
    ...getComponentThemeToken(
      "text",
      "color",
      "color",
      backwardsCompatibleColorToken(color),
    ),
  } as React.CSSProperties;

  return (
    <Component className={className} style={style} id={id ? id : undefined}>
      {children}
    </Component>
  );
}

function cleanVariant(variant: string) {
  return variant.replace(/_/, "-");
}
