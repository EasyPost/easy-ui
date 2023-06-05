import React, { ReactNode } from "react";

import styles from "./Toggle.module.scss";

export type ToggleProps = {
  /**
   * The label for the toggle.
   */
  children?: ReactNode;

  /**
   * Whether the toggle should be selected (uncontrolled).
   */
  defaultSelected?: boolean;

  /**
   * Disables the toggle.
   */
  isDisabled?: boolean;

  /**
   * Marks the toggle as immutable.
   */
  isReadOnly?: boolean;

  /**
   * Whether the toggle should be selected (controlled).
   */
  isSelected?: boolean;

  /**
   * The name of the toggle, used when submitting an HTML form.
   */
  name?: string;

  /**
   * Handler that is called when the toggle's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;

  /**
   * The value of the toggle, used when submitting an HTML form.
   */
  value?: string;
};

export function Toggle(props: ToggleProps) {
  const { children } = props;
  return <span className={styles.Toggle}>{children}</span>;
}
