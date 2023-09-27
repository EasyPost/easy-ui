import React, { ReactNode } from "react";
import CheckCircle from "@easypost/easy-ui-icons/CheckCircle";
import { AriaButtonProps } from "react-aria";
import { useInternalStepperContext } from "./StepperContext";
import { UnstyledButton } from "../UnstyledButton";
import { classNames, variationName } from "../utilities/css";
import { Icon } from "../Icon";

import styles from "./StepButton.module.scss";

export type StepStatus = "active" | "complete" | "incomplete";

export type StepButtonProps = AriaButtonProps & {
  /**
   * Applies complete styles to button.
   */
  status: StepStatus;
  /**
   * Applies active styles to button.
   */
  isDisabled: boolean;
  /**
   * Step content, the actual text itself.
   */
  children: ReactNode;
};

export function StepButton(props: StepButtonProps) {
  const { status, isDisabled, children, onPress, ...restProps } = props;
  const { color, orientation } = useInternalStepperContext();

  return (
    <div
      className={classNames(styles[variationName("container", orientation)])}
    >
      <UnstyledButton
        {...restProps}
        onPress={onPress}
        isDisabled={isDisabled}
        className={classNames(
          styles.StepButton,
          styles[variationName("status", status)],
          styles[variationName("color", color)],
        )}
      >
        {status === "complete" ? (
          <Icon
            symbol={CheckCircle}
            size={orientation === "horizontal" ? "md" : "xs"}
          />
        ) : (
          <div
            className={classNames(
              styles.indicator,
              styles[variationName("indicator", orientation)],
              styles[variationName("indicator", status)],
            )}
          />
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
