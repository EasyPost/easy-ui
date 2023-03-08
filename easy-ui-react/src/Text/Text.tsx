import React, { ReactNode } from "react";
import { TokenNamespace, TokenNamespaceWithSuffix } from "../types";
import { classNames, getComponentToken } from "../utilities/css";

import styles from "./Text.module.scss";

export type TextAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
export type TextColor = TokenNamespace<"color">;
export type TextVariant = TokenNamespaceWithSuffix<"font-style", "family">;
export type TextWeight = "normal" | "medium" | "semibold" | "bold";

export type TextProps = {
  /* Adjusts horizontal alignment of text */
  alignment?: "start" | "center" | "end" | "justify";
  /* Adjusts the underlying element of the text */
  as?: TextAs;
  /* Prevent text from overflowing inline container */
  breakWord?: boolean;
  /** Text to display */
  children: ReactNode;
  /* Adjust color of text */
  color?: TextColor;
  /* HTML id attribute */
  id?: string;
  /** Truncate text overflow with ellipsis */
  truncate?: boolean;
  /* Adjusts the style of text that's rendered */
  variant?: TextVariant;
  /* Visually hide the text but keep it accessible */
  visuallyHidden?: boolean;
  /** Adjust weight of text */
  weight?: TextWeight;
};

export function Text({
  alignment,
  as: Component = "span",
  breakWord = false,
  children,
  color,
  id,
  truncate = false,
  variant,
  visuallyHidden = false,
  weight,
}: TextProps) {
  const className = classNames(
    styles.Text,
    variant && styles[variant],
    weight && styles[weight],
    (alignment || truncate) && styles.block,
    alignment && styles[alignment],
    breakWord && styles.break,
    truncate && styles.truncate,
    visuallyHidden && styles.visuallyHidden,
  );

  const style = {
    ...getComponentToken("text", "color", "color", color),
  } as React.CSSProperties;

  return (
    <Component className={className} style={style} id={id ? id : undefined}>
      {children}
    </Component>
  );
}
