import React, { ReactNode, forwardRef } from "react";
import { ResponsiveSpaceScale } from "../types";
import {
  classNames,
  getComponentToken,
  getResponsiveDesignToken,
  sanitizeCustomProperties,
} from "../utilities/css";

import styles from "./VerticalStack.module.scss";

export type Align =
  | "start"
  | "center"
  | "end"
  | "space-around"
  | "space-between"
  | "space-evenly";
export type InlineAlign = "start" | "center" | "end" | "baseline" | "stretch";
export type Element = "div" | "ul" | "ol" | "fieldset";

export type VerticalStackProps = {
  /**
   * HTML Element type
   * @default 'div'
   */
  as?: Element;

  /** Vertical alignment of children */
  align?: Align;

  /** Contents of the vertical stack. */
  children: ReactNode;

  /** The spacing between children */
  gap?: ResponsiveSpaceScale;

  /** Whether or not the vertical stack uses inline-flex instead of flex. */
  inline?: boolean;

  /** Horizontal alignment of children */
  inlineAlign?: InlineAlign;

  /**
   * Reverse the render order of child items
   * @default false
   */
  reverseOrder?: boolean;
};

/**
 * Use to display children vertically. Based on CSS Flexbox.
 *
 * @remarks
 * Properties like `gap` use Easy UI's constraint system.
 *
 * @example
 * ```tsx
 * <VerticalStack gap="2">
 *   <div />
 *   <div />
 * </VerticalStack>
 * ```
 */
export const VerticalStack = forwardRef<null, VerticalStackProps>(
  (props, ref) => {
    const {
      as: As = "div",
      align,
      children,
      gap,
      inline,
      inlineAlign,
      reverseOrder = false,
      ...restProps
    } = props;

    const className = classNames(
      styles.VerticalStack,
      (As === "ul" || As === "ol") && styles.listReset,
      As === "fieldset" && styles.fieldsetReset,
    );

    const style = {
      ...getResponsiveDesignToken("vertical-stack", "gap", "space", gap),
      ...getComponentToken("vertical-stack", "align", align),
      ...getComponentToken("vertical-stack", "inline-align", inlineAlign),
      ...getComponentToken(
        "vertical-stack",
        "order",
        reverseOrder ? "column-reverse" : "column",
      ),
      ...getComponentToken(
        "vertical-stack",
        "display",
        inline ? "inline-flex" : "flex",
      ),
    } as React.CSSProperties;

    return (
      <As
        {...restProps}
        className={className}
        style={sanitizeCustomProperties(style)}
        ref={ref}
      >
        {children}
      </As>
    );
  },
);

VerticalStack.displayName = "VerticalStack";
