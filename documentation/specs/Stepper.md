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
- A step that is not completed or active is considered disabled.

---

## Design

In contrast to most Easy UI components, the `Stepper` component does not have an immediate `react-aria` primitive to build on top of.

The `Stepper` component has two considerations: The outer container and individual steps. The outer container will handle orientation and spacing concerns with each individual step with respect to another. Individual steps will be represented as `Stepper.Step` and each `Stepper.Step` renders a `Stepper.StepButton` and behind the scenes a `Stepper.StepSeparator`. The `Stepper.StepButton` will make use of the `UnstyledButton` component and the clickable area will not only include the label, but a left aligned icon as well. Representing each step as a button is necessary to support a non-linear step sequence where previously completed steps can be clicked and returned to. The `Stepper.StepSeparator` will not be exposed to the consumer, and will be omitted for the last step in the collection.

### API

```ts
type StepperColor = "primary" | "inverse";
type StepperOrientation = "horizontal" | "vertical";

type Stepper = {
  /**
   * Color scheme that applies to stepper in various states.
   */
  color?: StepperColor;
  /**
   * Orientation of stepper, vertical replaces arrow icon with line.
   */
  orientation?: StepperOrientation;
  /**
   * The current step, other steps are either in a disabled or completed state.
   */
  activeStep: number;
  /**
   * The steps to render, individual Step components.
   */
  children: ReactNode;
};

type Step = {
  /**
   * Whether or not the step should have completed styles.
   */
  isCompleted: boolean;
  /**
   * Renders StepButton and StepSeparator.
   */
  children: ReactNode;
};

type StepButton = AriaButtonProps & {
  /**
   * StepButton content, the actual step text itself.
   */
  children: ReactNode;
};
```

### Example Usage

_Basic usage_:

```tsx
import { useState } from "react";
import { Stepper } from "@easypost/easy-ui/Stepper";

const steps = ["Step 1", "Step 2", "Step 3"];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = React.useState<{
    [index: number]: boolean;
  }>({});

  const handleStep = (index) => setActiveStep(index);

  return (
    <Stepper color="primary" orientation="horizontal" activeStep={activeStep}>
      {steps.map((stepLabel, index) => (
        <Stepper.Step key={stepLabel} isCompleted={status[index]}>
          <Stepper.StepButton onPress={handleStep(index)}>
            {stepLabel}
          </Stepper.StepButton>
        </Stepper.Step>
      ))}
    </Stepper>
  );
}
```
