# `Stepper` Component Specification

## Overview

A `Stepper` component is used to indicate progress as the user goes through a multi-step process.

### Use Cases

- Guide a user through a large form where parts of the form can be separated into logical steps.
- Guide a user through a sequence of steps where the next step depends on data from the previous step.

### Features

- The `orientation` property can be used to display a vertical or horizontal stepper.
- The `color` property can be used to display a stepper with primary or inverse colors; inverse is suitable on darker backgrounds.
- The step sequence is non-linear, which means users can navigate to previously completed steps.
- On small screens, the step label is not visible.

---

## Design

In contrast to most Easy UI components, the `Stepper` component does not have an immediate `react-aria` primitive to build on top of.

The `Stepper` component has two considerations: The outer container and individual steps. The outer container will handle orientation and spacing concerns with each individual step with respect to another. Individual steps will be represented as `Stepper.Step` and each `Stepper.Step` behind the scenes renders a `StepButton` and a separator. The `StepButton` will make use of the `UnstyledButton` component and the clickable area will not only include the label, but a left aligned icon as well. Representing each step as a button is necessary to support a non-linear step sequence where previously completed steps can be clicked and returned to.

### API

```ts
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
```

### Example Usage

_Basic usage_:

```tsx
import { Stepper } from "@easypost/easy-ui/Stepper";

export function Component() {
  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
  const [activeStep, setActiveStep] = useState(0);
  const [stepsState, setStepsState] = useState<
    { isComplete: boolean; isAccessible: boolean }[]
  >([{ isComplete: false, isAccessible: true }]);

  const goToStep = (index: number) => () => {
    setActiveStep(index);
  };

  return (
    <Stepper activeStepIndex={activeStep}>
      {steps.map((step, index) => (
        <Stepper.Step
          key={step}
          stepIndex={index}
          onPress={goToStep(index)}
          isComplete={stepsState[index]?.isComplete || false}
          isAccessible={stepsState[index]?.isAccessible || false}
        >
          {step}
        </Stepper.Step>
      ))}
    </Stepper>
  );
}
```
