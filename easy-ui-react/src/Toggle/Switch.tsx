import React from "react";
import { classNames } from "../utilities/css";

import styles from "./Switch.module.scss";

export type SwitchProps = {
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

export function Switch(props: SwitchProps) {
  const { isDisabled, isFocusVisible, isHovered, isSelected } = props;

  const className = classNames(
    styles.Switch,
    isDisabled && styles.disabled,
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
