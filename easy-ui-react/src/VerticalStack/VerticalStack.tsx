import React, { forwardRef } from "react";
import omit from "lodash/omit";
import {
  ResponsiveProp,
  classNames,
  getComponentToken,
  getResponsiveDesignToken,
  sanitizeCustomProperties,
} from "../utilities/css";
import { DesignTokenNamespace } from "../types";

import styles from "./VerticalStack.module.scss";

type Align =
  | "start"
  | "center"
  | "end"
  | "space-around"
  | "space-between"
  | "space-evenly";

type InlineAlign = "start" | "center" | "end" | "baseline" | "stretch";

type Element = "div" | "ul" | "ol" | "fieldset";

type SpaceScale = DesignTokenNamespace<"space">;

type Gap = ResponsiveProp<SpaceScale>;

export type VerticalStackProps = {
  /** HTML Element type
   * @default 'div'
   */
  as?: Element;

  /** Vertical alignment of children */
  align?: Align;

  /** Contents of the vertical stack. */
  children: React.ReactNode;

  /** Custom className for the vertical stack. */
  className?: string;

  /** The spacing between children */
  gap?: Gap;

  /** HTML id attribute */
  id?: string;

  /** Whether or not the vertical stack uses inline-flex instead of flex. */
  inline?: boolean;

  /** Horizontal alignment of children */
  inlineAlign?: InlineAlign;

  /** Reverse the render order of child items
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
      className: customClassName,
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
      customClassName,
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
        className={className}
        style={sanitizeCustomProperties(style)}
        ref={ref}
        {...omit(restProps, ["className", "style"])}
      >
        {children}
      </As>
    );
  },
);

VerticalStack.displayName = "VerticalStack";
