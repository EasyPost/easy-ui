import React, { ReactNode } from "react";
import CheckCircle from "@easypost/easy-ui-icons/CheckCircle";
import { AriaButtonProps, useFocusRing, mergeProps } from "react-aria";
import { useInternalStepperContext } from "./StepperContext";
import { UnstyledButton } from "../UnstyledButton";
import { classNames, variationName } from "../utilities/css";
import { Icon } from "../Icon";

import styles from "./StepButton.module.scss";

export type StepStatus = "active" | "complete" | "incomplete";

export type StepButtonProps = AriaButtonProps & {
  /**
   * Represents status for each step.
   */
  status: StepStatus;
  /**
   * Whether or not button should be disabled.
   */
  isDisabled: boolean;
  /**
   * Step content, the actual text itself.
   */
  children: ReactNode;
};

/**
 * @privateRemarks
 * This component serves as the button for individual steps.
 * For each step, the button is not only the step text content,
 * but also the associated left-aligned status icon.
 */
export function StepButton(props: StepButtonProps) {
  const { status, isDisabled, children, onPress, ...restProps } = props;
  const { color, orientation } = useInternalStepperContext();
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <div
      className={classNames(
        styles.container,
        styles[variationName("container", orientation)],
      )}
    >
      <UnstyledButton
        {...mergeProps(focusProps, restProps)}
        onPress={onPress}
        isDisabled={isDisabled}
        className={classNames(
          styles.StepButton,
          styles[variationName("status", status)],
          styles[variationName("color", color)],
          styles[variationName("orientation", orientation)],
          isFocusVisible && styles.focusVisible,
        )}
      >
        {status === "complete" ? (
          <Icon
            symbol={CheckCircle}
            size={orientation === "horizontal" ? "md" : "sm"}
          />
        ) : (
          <div className={classNames(styles.indicatorContainer)}>
            <div
              className={classNames(
                styles.indicator,
                styles[variationName("indicator", orientation)],
                styles[variationName("indicator", status)],
              )}
            />
          </div>
        )}
        <span
          className={classNames(styles[variationName("text", orientation)])}
        >
          {children}
        </span>
      </UnstyledButton>
    </div>
  );
}
