import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Stepper, StepperProps } from "./Stepper";
import { Button } from "../Button";
import { HorizontalStack } from "../HorizontalStack";
import { VerticalStack } from "../VerticalStack";
import {
  InlineStoryDecorator,
  InlineStoryOnDarkBackgroundDecorator,
} from "../utilities/storybook";

type Story = StoryObj<typeof Stepper>;

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  argTypes: {},
};

const Template = (args: StepperProps) => {
  const steps = [
    "Addresses",
    "Parcel & Label Options",
    "Carrier & Service",
    "Print Label",
  ];
  return (
    <Stepper {...args} activeStepIndex={2}>
      {steps.map((step, index) => (
        <Stepper.Step
          key={step}
          stepIndex={index}
          isComplete={index < 2}
          isAccessible={index <= 2}
        >
          {step}
        </Stepper.Step>
      ))}
    </Stepper>
  );
};

export default meta;

export const HorizontalStepper: Story = {
  render: () => {
    const steps = [
      "Addresses",
      "Parcel & Label Options",
      "Carrier & Service",
      "Print Label",
    ];
    const [activeStep, setActiveStep] = useState(0);
    const [stepsState, setStepsState] = useState<
      { isComplete: boolean; isAccessible: boolean }[]
    >([{ isComplete: false, isAccessible: true }]);

    const goToStep = (index: number) => () => {
      setActiveStep(index);
    };

    const completeStep = () => {
      const newStepsState = stepsState;
      // mark current step as complete
      newStepsState[activeStep] = {
        ...stepsState[activeStep],
        isComplete: true,
      };
      // next step mark as accessible
      newStepsState[activeStep + 1] = {
        ...stepsState[activeStep + 1],
        isAccessible: true,
      };
      // update state
      setStepsState(newStepsState);
      setActiveStep(activeStep + 1);
    };

    const handleReset = () => {
      setActiveStep(0);
      setStepsState([{ isComplete: false, isAccessible: true }]);
    };

    return (
      <VerticalStack gap="5">
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
        <HorizontalStack gap="5">
          <Button color="warning" onPress={handleReset}>
            Reset
          </Button>
          <Button color="primary" onPress={completeStep}>
            Complete step
          </Button>
        </HorizontalStack>
      </VerticalStack>
    );
  },
  decorators: [InlineStoryDecorator],
};

export const VerticalStepper: Story = {
  render: Template.bind({}),
  args: {
    orientation: "vertical",
  },
  decorators: [InlineStoryDecorator],
};

export const HorizontalInverseStepper: Story = {
  render: Template.bind({}),
  args: {
    color: "inverse",
  },
  decorators: [InlineStoryOnDarkBackgroundDecorator],
};

export const VerticalInverseStepper: Story = {
  render: Template.bind({}),
  args: {
    orientation: "vertical",
    color: "inverse",
  },
  decorators: [InlineStoryOnDarkBackgroundDecorator],
};
