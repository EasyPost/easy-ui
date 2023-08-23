import React, { ComponentProps, forwardRef } from "react";
import { PressHookProps, usePress } from "react-aria";

import styles from "./UnstyledPressButton.module.scss";

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
