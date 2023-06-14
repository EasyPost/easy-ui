import React, { ElementType, forwardRef } from "react";
import { DesignTokenNamespace } from "../types";
import {
  ResponsiveProp,
  getComponentToken,
  getResponsiveDesignToken,
} from "../utilities/css";

import styles from "./HorizontalStack.module.scss";

type SpaceScale = DesignTokenNamespace<"space">;

export type Gap = ResponsiveProp<SpaceScale>;
export type Align =
  | "start"
  | "center"
  | "end"
  | "space-around"
  | "space-between"
  | "space-evenly";
export type BlockAlign = "start" | "center" | "end" | "baseline" | "stretch";

export type HorizontalStackProps = {
  /**
   * HTML element type.
   * @default div
   */
  as?: ElementType;

  /** Horizontal alignment of children */
  align?: Align;

  /** Vertical alignment of children */
  blockAlign?: BlockAlign;

  /** Content of the horizontal stack. */
  children?: React.ReactNode;

  /** Whether or not the horizontal stack uses inline-flex instead of flex. */
  inline?: boolean;

  /** The spacing between elements. Accepts a spacing token or an object of spacing tokens for different screen sizes.
   * @example
   * gap='2'
   * gap={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
   */
  gap?: Gap;

  /** Wrap stack elements to additional rows as needed on small screens
   * @default true
   */
  wrap?: boolean;
};

/**
 * Use to display children horizontally. Based on CSS Flexbox.
 *
 * @remarks
 * Properties like `gap` use Easy UI's constraint system.
 *
 * @example
 * ```tsx
 * <HorizontalStack gap="2">
 *   <div />
 *   <div />
 * </HorizontalStack>
 * ```
 */
export const HorizontalStack = forwardRef<null, HorizontalStackProps>(
  (props, ref) => {
    const {
      as: As = "div",
      align,
      blockAlign,
      gap,
      wrap = true,
      children,
      inline,
      ...restProps
    } = props;
    const style = {
      ...getResponsiveDesignToken("horizontal-stack", "gap", "space", gap),
      ...getComponentToken("horizontal-stack", "align", align),
      ...getComponentToken("horizontal-stack", "block-align", blockAlign),
      ...getComponentToken(
        "horizontal-stack",
        "wrap",
        wrap ? "wrap" : "nowrap",
      ),
      ...getComponentToken(
        "horizontal-stack",
        "display",
        inline ? "inline-flex" : "flex",
      ),
    } as React.CSSProperties;
    return (
      <As
        className={styles.HorizontalStack}
        style={style}
        ref={ref}
        {...restProps}
      >
        {children}
      </As>
    );
  },
);

HorizontalStack.displayName = "HorizontalStack";
