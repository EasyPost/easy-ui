import React, { ReactNode } from "react";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";

import styles from "./AlertBadge.module.scss";

export const DEFAULT_VARIANT = "danger";

export const DEFAULT_PLACEMENT = "top right";

export type AlertBadgeVariant = "primary" | "secondary" | "success" | "danger";

export type AlertBadgePlacement = "top right" | "bottom right";

export type AlertBadgeProps = {
  /** AlertBadge placement
   * @default top right
   */
  placement?: AlertBadgePlacement;

  /** AlertBadge icon (IconSymbol)
   * @default undefined
   */
  icon?: IconSymbol;

  /**
   * Accessible label for the AlertBadge.
   * @default Alert Badge
   */
  accessibilityLabel?: string;

  /**
   * AlertBadge variant.
   * @default danger
   */
  variant?: AlertBadgeVariant;

  /** AlertBadge attachment target. */
  children: ReactNode;

  /**  Show/hide AlertBadge. */
  show: boolean;
};

export function AlertBadge(props: AlertBadgeProps) {
  const {
    accessibilityLabel = "Alert Badge",
    placement = DEFAULT_PLACEMENT,
    variant = DEFAULT_VARIANT,
    icon,
    show,
    children,
  } = props;

  const className = classNames(
    styles.root,
    styles[variationName("variant", variant)],
    ...placement.split(" ").map((position) => styles[position]),
  );

  if (!show) {
    return children;
  }

  return (
    <span className={styles.container}>
      <Text visuallyHidden>{accessibilityLabel}</Text>
      {children}
      <span className={className} data-testid="root">
        <span className={styles.badge} role="status">
          {icon && <Icon symbol={icon} size="2xs" />}
        </span>
      </span>
    </span>
  );
}
