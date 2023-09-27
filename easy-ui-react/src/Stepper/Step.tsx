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
   * Wheter or not the step is complete; a completed
   * step is a visual indication and does not make any
   * assumptions behind the scenes about the state of the
   * step sequence.
   */
  isComplete: boolean;
  /**
   * Whether or not the step is accessible; an accessible
   * step is one that is not active or complete, but can be
   * reached by the user.
   */
  isAccessible: boolean;
  /**
   * Step content, the actual step text itself.
   */
  children: ReactNode;
};

/**
 * @privateRemarks
 * This component is what is exposed as `<Stepper.Step />`. It handles
 * the clickable area of a step and with the exception of the last step,
 * it renders a separator.
 */
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
          <Icon size="xs" symbol={ArrowForwardIos} color={color} />
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
