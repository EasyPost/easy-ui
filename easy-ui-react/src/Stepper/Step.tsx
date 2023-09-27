import React, { ReactNode } from "react";
import ArrowForwardIos from "@easypost/easy-ui-icons/ArrowForwardIos";
import { AriaButtonProps } from "react-aria";
import { useInternalStepperContext } from "./StepperContext";
import { StepButton } from "./StepButton";
import { classNames, variationName } from "../utilities/css";
import { Icon } from "../Icon";

import styles from "./Step.module.scss";

export type StepProps = AriaButtonProps & {
  /**
   * Step index, the ith step in the sequence.
   */
  stepIndex: number;
  /**
   * Step index, the ith step in the sequence.
   */
  isComplete: boolean;
  /**
   * Step index, the ith step in the sequence.
   */
  isAccessible: boolean;
  /**
   * Step content, the actual step text itself.
   */
  children: ReactNode;
};

export function Step(props: StepProps) {
  const {
    stepIndex,
    isComplete,
    isAccessible,
    children,
    onPress,
    ...restProps
  } = props;
  const { orientation, color, totalSteps, activeStepIndex } =
    useInternalStepperContext();

  const isActive = stepIndex === activeStepIndex;
  const isLastStep = totalSteps - 1 === stepIndex;
  const isDisabled = !isActive && !isComplete && !isAccessible;

  return (
    <>
      <StepButton
        status={mapToStatus(isActive, isComplete)}
        isDisabled={isDisabled}
        onPress={onPress}
        {...restProps}
      >
        {children}
      </StepButton>
      {!isLastStep &&
        (orientation === "horizontal" ? (
          <Icon size="xs" symbol={ArrowForwardIos} color="primary" />
        ) : (
          <span
            className={classNames(
              styles.separator,
              styles[variationName("separator", color)],
            )}
          />
        ))}
    </>
  );
}

function mapToStatus(isActive: boolean, isComplete: boolean) {
  if (isActive) return "active";
  if (isComplete) return "complete";
  return "incomplete";
}
