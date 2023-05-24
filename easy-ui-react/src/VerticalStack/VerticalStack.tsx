import React, { forwardRef } from "react";
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
  /** Contents of the vertical stack. */
  children: React.ReactNode;

  /** HTML Element type
   * @default 'div'
   */
  as?: Element;

  /** Vertical alignment of children */
  align?: Align;

  /** Horizontal alignment of children */
  inlineAlign?: InlineAlign;

  /** The spacing between children */
  gap?: Gap;

  /** HTML id attribute */
  id?: string;

  /** Reverse the render order of child items
   * @default false
   */
  reverseOrder?: boolean;
};

export const VerticalStack = forwardRef<null, VerticalStackProps>(
  (props, ref) => {
    const {
      as = "div",
      children,
      align,
      inlineAlign,
      gap,
      reverseOrder = false,
      ...restProps
    } = props;

    const className = classNames(
      styles.VerticalStack,
      (as === "ul" || as === "ol") && styles.listReset,
      as === "fieldset" && styles.fieldsetReset,
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
    } as React.CSSProperties;

    return React.createElement(
      as,
      {
        className,
        style: sanitizeCustomProperties(style),
        ref,
        ...restProps,
      },
      children,
    );
  },
);

VerticalStack.displayName = "VerticalStack";
