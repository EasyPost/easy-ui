import React, { ReactNode, useMemo, Children } from "react";
import { InternalStepperContext } from "./StepperContext";
import { HorizontalStack } from "../HorizontalStack";
import { VerticalStack } from "../VerticalStack";
import { Step } from "./Step";

export type StepperColor = "primary" | "inverse";

export type StepperOrientation = "horizontal" | "vertical";

export type StepperProps = {
  /**
   * Color scheme that applies to steps in various states.
   * @default primary
   */
  color?: StepperColor;
  /**
   * Orientation of stepper, vertical replaces arrow icon with line.
   * @default horizontal
   */
  orientation?: StepperOrientation;
  /**
   * The active step, represented as an index of the sequence.
   */
  activeStepIndex: number;
  /**
   * The steps to render, represented as `<Stepper.Step/ >`.
   */
  children: ReactNode;
};

/**
* The `<Stepper />` component is used to indicate progress as the user goes 
* through a multi-step process.
*
* @remarks
* A common use-case for this component is to guide a user through a large 
* form where parts of the form can be separated into logical steps.
*
* @example
* _Default:_
*```tsx
* import { Stepper } from "@easypost/easy-ui/Stepper";
*
* export function Component() {
*  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"]
*  const [activeStep, setActiveStep] = useState(0);
*  const [stepsState, setStepsState] = useState<
*   { isComplete: boolean; isAccessible: boolean }[]
*  >([{ isComplete: false, isAccessible: true }]);
*
*  const goToStep = (index: number) => () => {
*     setActiveStep(index);
*  }
*
*  return (
*   <Stepper activeStepIndex={activeStep}>
*     {steps.map((step, index) => (
*       <Stepper.Step
*         key={step}
*         stepIndex={index}
*         onPress={goToStep(index)}
*         isComplete={stepsState[index]?.isComplete || false}
*         isAccessible={stepsState[index]?.isAccessible || false}
*        >
*         {step}
*       </Stepper.Step>
*     ))}
*   </Stepper>
*  );
* }
```
*
* @example
* _Vertical orientation and inverse color:_
*```tsx
* import { Stepper } from "@easypost/easy-ui/Stepper";
*
* export function Component() {
*  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"]
*  const [activeStep, setActiveStep] = useState(0);
*  const [stepsState, setStepsState] = useState<
*   { isComplete: boolean; isAccessible: boolean }[]
*  >([{ isComplete: false, isAccessible: true }]);
*
*  const goToStep = (index: number) => () => {
*     setActiveStep(index);
*  }
*
*  return (
*   <Stepper color="inverse" orientation="vertical" activeStepIndex={activeStep}>
*     {steps.map((step, index) => (
*       <Stepper.Step
*         key={step}
*         stepIndex={index}
*         onPress={goToStep(index)}
*         isComplete={stepsState[index]?.isComplete || false}
*         isAccessible={stepsState[index]?.isAccessible || false}
*        >
*         {step}
*       </Stepper.Step>
*     ))}
*   </Stepper>
*  );
* }
```
 */
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
