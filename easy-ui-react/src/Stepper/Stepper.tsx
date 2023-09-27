import React, { ReactNode, useMemo, Children } from "react";
import { InternalStepperContext } from "./StepperContext";
import { HorizontalStack } from "../HorizontalStack";
import { VerticalStack } from "../VerticalStack";
import { Step } from "./Step";

export type StepperColor = "primary" | "inverse";

export type StepperOrientation = "horizontal" | "vertical";

export type StepperProps = {
  /**
   * Color scheme that applies to stepper in various states.
   * @default primary
   */
  color?: StepperColor;
  /**
   * Orientation of stepper, vertical replaces arrow icon with line.
   * @default horizontal
   */
  orientation?: StepperOrientation;
  /**
   * The current step, represented as an index of the sequence.
   */
  activeStepIndex: number;
  /**
   * The steps to render, individual Step components.
   */
  children: ReactNode;
};

export function Stepper(props: StepperProps) {
  const {
    color = "primary",
    orientation = "horizontal",
    activeStepIndex,
    children,
  } = props;

  const totalSteps = Children.toArray(children).filter(Boolean).length;
  const isVertical = orientation === "vertical";
  const Component = isVertical ? VerticalStack : HorizontalStack;

  const context = useMemo(() => {
    return {
      color,
      orientation,
      activeStepIndex,
      totalSteps,
    };
  }, [color, orientation, activeStepIndex, totalSteps]);

  return (
    <InternalStepperContext.Provider value={context}>
      <Component
        blockAlign="center"
        gap={isVertical ? "0.5" : undefined}
        data-testid="root"
      >
        {children}
      </Component>
    </InternalStepperContext.Provider>
  );
}

/**
 * Represents a step in a `<Stepper />`.
 *
 * @remarks
 * Should be used to render individual steps and wrapped by
 * `<Stepper />`
 */
Stepper.Step = Step;
