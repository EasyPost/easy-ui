import React, { ComponentProps, forwardRef } from "react";
import { PressHookProps, usePress } from "react-aria";

export const UnstyledPressButton = forwardRef<null, ComponentProps<"button">>(
  (props, ref) => {
    const { pressProps } = usePress(props as PressHookProps);
    return <button ref={ref} {...pressProps} />;
  },
);

UnstyledPressButton.displayName = "UnstyledPressButton";
