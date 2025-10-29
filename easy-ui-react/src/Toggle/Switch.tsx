import React from "react";
import { classNames, variationName } from "../utilities/css";

import styles from "./Switch.module.scss";

export type SwitchProps = {
  /**
   * The color variant for the background of the switch when enabled
   */
  variant: "primary" | "success" | "danger";

  /**
   * Whether the switch should be disabled.
   */
  isDisabled?: boolean;

  /**
   * Whether the switch should be focused.
   */
  isFocusVisible?: boolean;

  /**
   * Whether the switch should be hovered.
   */
  isHovered?: boolean;

  /**
   * Whether the switch should be selected.
   */
  isSelected?: boolean;
};

/**
 * A custom-styled control for displaying an "on/off" state.
 */
export function Switch(props: SwitchProps) {
  const { isDisabled, isFocusVisible, isHovered, isSelected, variant } = props;

  const className = classNames(
    styles.Switch,
    isDisabled && styles.disabled,
    styles[variationName("variant", variant)],
    isFocusVisible && styles.focusVisible,
    isHovered && styles.hovered,
    isSelected && styles.selected,
  );

  return (
    <span className={className}>
      <svg width={32} height={16} aria-hidden="true">
        <rect
          className={styles.track}
          x={0}
          y={0}
          width={32}
          height={16}
          rx={8}
        />
        <circle
          className={styles.thumb}
          cx={isSelected ? 32 - 8 : 8}
          cy={8}
          r={6}
        />
      </svg>
    </span>
  );
}
