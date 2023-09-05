import React, { ComponentProps, forwardRef } from "react";
import { PressHookProps, usePress } from "react-aria";

import styles from "./UnstyledPressButton.module.scss";

/**
 * Simple button wrapper that just accommodates for press events sent in by
 * React Aria.
 *
 * @todo figure out how to supersed this with UnstyledButton
 */
export const UnstyledPressButton = forwardRef<null, ComponentProps<"button">>(
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
