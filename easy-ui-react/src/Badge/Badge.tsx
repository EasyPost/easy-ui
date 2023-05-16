import React, { ReactNode } from "react";
import { IconSymbol } from "../types";
import { Icon } from "../Icon";
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
  | "danger";

export type BadgeProps = {
  /**
   * Accessible label for badge if it differs from its content.
   * Required for icon-only badges.
   */
  accessibilityLabel?: string;

  /** Primary badge label. */
  children?: ReactNode;

  /** Badge icon */
  icon?: IconSymbol;

  /**
   * Any additional text to support the primary label.
   * Only for text-only badges.
   */
  supportText?: ReactNode;

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
 * _Simple icon:_
 * ```tsx
 * <Badge accessibilityLabel="Intent of badge" icon={IconSymbol} />
 * ```
 *
 * @example
 * _Detailed text:_
 * ```tsx
 * <Badge supportText="Last updated: Jan 3. 2023">
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
    supportText,
    icon,
    variant = DEFAULT_VARIANT,
  } = props;

  const className = classNames(
    styles.root,
    styles[variationName("variant", variant)],
  );

  // Ideally the below conditions could use discriminated type unions to enforce
  // constraints statically but as of now it makes for too rigorous of an API.
  // Can consider revisiting in the future.

  if (!icon && !children) {
    console.warn("Badge requires one of children or icon");
  }

  if (supportText && icon) {
    console.warn("supportText is not supported on a Badge with icon");
  }

  if (icon && !children && !accessibilityLabel) {
    console.warn("Badge with only icon must have accessibilityLabel");
  }

  return (
    <span
      className={className}
      role="presentation"
      {...(accessibilityLabel ? { "aria-label": accessibilityLabel } : {})}
    >
      <span
        className={styles.content}
        data-content-type={icon ? "icon" : "text"}
      >
        {icon ? (
          <Icon symbol={icon} size="sm" />
        ) : (
          <span className={styles.text}>{children}</span>
        )}
      </span>
      {children && (icon || supportText) && (
        <span className={styles.support}>
          <span className={styles.text}>
            {icon ? <>{children}</> : <>{supportText}</>}
          </span>
        </span>
      )}
    </span>
  );
}
