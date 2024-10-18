import React, { ComponentProps, forwardRef } from "react";
import { PressHookProps, usePress } from "react-aria";
import { classNames } from "../utilities/css";

import styles from "./UnstyledPressButton.module.scss";

/**
 * Simple button wrapper that just accommodates for press events sent in by
 * React Aria.
 *
 * @todo figure out how to supersede this with UnstyledButton
 */
export const UnstyledPressButton = forwardRef<
  null,
  ComponentProps<"button"> & PressHookProps
>((props, ref) => {
  const { pressProps } = usePress(props);
  return (
    <button
      {...pressProps}
      ref={ref}
      className={classNames(styles.UnstyledPressButton, pressProps.className)}
    />
  );
});

UnstyledPressButton.displayName = "UnstyledPressButton";
