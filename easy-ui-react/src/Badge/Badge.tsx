import React, { ReactNode } from "react";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";

import styles from "./Badge.module.scss";

export const DEFAULT_VARIANT = "primary";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "black"
  | "inverse"
  | "gray"
  | "success"
  | "warning"
  | "danger"
  | "primary.100"
  | "primary.500"
  | "primary.700"
  | "secondary.100"
  | "secondary.500"
  | "secondary.700"
  | "positive.100"
  | "positive.600"
  | "positive.700"
  | "negative.100"
  | "negative.400"
  | "negative.600"
  | "warning.100"
  | "warning.500"
  | "warning.600"
  | "neutral.050"
  | "neutral.500"
  | "neutral.600";

export type BadgeProps = {
  /**
   * Accessible label for the badge if it differs from its content.
   */
  accessibilityLabel?: string;

  /** Primary badge label. */
  children: ReactNode;

  /** Badge icon */
  icon?: IconSymbol;

  /**
   * Any additional text to support the primary label on text badges.
   */
  secondaryLabel?: ReactNode;

  /**
   * Badge variant.
   * @default primary
   */
  variant?: BadgeVariant;
};

/**
 * A visual text label for small bits of supporting information.
 *
 * @remarks
 * Badges can be used to support categorizing information, getting a user's
 * attention, and describing metadata.
 *
 * @example
 * _Simple text:_
 * ```tsx
 * <Badge>Badge text</Badge>
 * ```
 *
 * @example
 * _Detailed text:_
 * ```tsx
 * <Badge secondaryLabel="Last updated: Jan 3. 2023">
 *   Deprecated
 * </Badge>
 * ```
 *
 * @example
 * _Detailed icon:_
 * ```tsx
 * <Badge icon={IconSymbol}>Badge text</Badge>
 * ```
 */
export function Badge(props: BadgeProps) {
  const {
    accessibilityLabel,
    children,
    secondaryLabel,
    icon,
    variant = DEFAULT_VARIANT,
  } = props;

  const className = classNames(
    styles.root,
    styles[variationName("variant", variant)],
    (icon || secondaryLabel) && styles.hasIconOrSecondaryLabel,
  );

  // Ideally the below conditions could use discriminated type unions to enforce
  // constraints statically but as of now it makes for too rigorous of an API.
  // Can consider revisiting in the future.

  if (!children) {
    console.warn("Badge requires children");
  }

  if (secondaryLabel && icon) {
    console.warn("secondaryLabel is not supported on a Badge with icon");
  }

  return (
    <span className={className} data-testid="root">
      {accessibilityLabel && <Text visuallyHidden>{accessibilityLabel}</Text>}
      {icon && (
        <span className={styles.primary}>
          <Icon symbol={icon} size="sm" />
        </span>
      )}
      <span className={icon ? styles.secondary : styles.primary}>
        <span className={styles.text}>{children}</span>
      </span>
      {secondaryLabel && (
        <span className={styles.secondary}>
          <span className={styles.text}>{secondaryLabel}</span>
        </span>
      )}
    </span>
  );
}
