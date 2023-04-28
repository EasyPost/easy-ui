import React, { ReactNode } from "react";
import { Text } from "../Text";
import { classNames, variationName } from "../utilities/css";
import styles from "./Banner.module.scss";

export type BannerVariant = "primary" | "success" | "neutral";
export type BannerProps = {
  /**
   * Banner variant color
   * @default "success"
   */
  variant?: BannerVariant;
  /** Banner emphasis text */
  emphasis?: ReactNode;
  /** Banner content */
  children?: ReactNode;
};
/**
 * Displays a prominent message that cannot be dismissed.
 *
 * @remarks
 * The variant property controls presentational color while emphasis and children are
 * for the text content within the banner.
 *
 * The difference between the text rendered as children vs the text rendered with the
 * emphasis prop is the style of text applied. With respect to Easy UI, emphasis text
 * is semibold1 and the text rendered via children is body1. Behind the scenes, emphasis
 * and children are being wrapped by Easy UI's Text component.
 *
 * This component is useful when wanting to inform users of new features, promotions and
 * other offerings.
 *
 * @example
 * Default success variant with emphasis and body:
 * ```tsx
 *  <Banner emphasis={<>Limited Time Only:</>}>
 *    Get your first $250 of labels free!
 *  </Banner>
 * ```
 *
 * @example
 * Primary variant with body only:
 * ```tsx
 *   <Banner variant="primary">No fees on 120,000 packages per year.</Banner>;
 * ```
 */

export function Banner(props: BannerProps) {
  const { variant = "success", emphasis = null, children = null } = props;
  return (
    <div
      className={classNames(
        styles.Banner,
        styles[variationName("variant", variant)],
      )}
    >
      <Text variant="subtitle1" alignment="center">
        {emphasis}
      </Text>
      <Text variant="body1" alignment="center">
        {children}
      </Text>
    </div>
  );
}
