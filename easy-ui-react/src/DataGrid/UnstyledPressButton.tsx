import React, { forwardRef } from "react";
import { AriaButtonProps, PressHookProps, usePress } from "react-aria";

import styles from "./UnstyledPressButton.module.scss";

/**
 * Simple button wrapper that just accommodates for press events sent in by
 * React Aria.
 *
 * @todo figure out how to supersede this with UnstyledButton
 */
export const UnstyledPressButton = forwardRef<null, AriaButtonProps>(
  (props, ref) => {
    const { pressProps } = usePress(props as PressHookProps);
    return (
      <button
        className={styles.UnstyledPressButton}
        ref={ref}
        {...pressProps}
      />
    );
  },
);

UnstyledPressButton.displayName = "UnstyledPressButton";
