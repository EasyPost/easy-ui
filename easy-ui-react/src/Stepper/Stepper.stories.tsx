import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Stepper } from "./Stepper";
import { Button } from "../Button";
import { HorizontalStack } from "../HorizontalStack";
import { Step } from "./Step";
import { VerticalStack } from "../VerticalStack";

/* eslint-disable react-hooks/rules-of-hooks */
type Story = StoryObj;

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  argTypes: {},
};

export default meta;

/* eslint-disable react-hooks/rules-of-hooks */

export const HorizontalStepper: Story = {
  render: () => {
    const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
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
            <Step
              key={step}
              stepIndex={index}
              onPress={goToStep(index)}
              isComplete={stepsState[index]?.isComplete || false}
              isAccessible={stepsState[index]?.isAccessible || false}
            >
              {step}
            </Step>
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
};

export const VerticalStepper: Story = {
  render: () => {
    const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
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
      <div style={{ padding: "20px", backgroundColor: "#061340" }}>
        <VerticalStack gap="5">
          <Stepper
            orientation="vertical"
            activeStepIndex={activeStep}
            color="inverse"
          >
            {steps.map((step, index) => (
              <Step
                key={step}
                stepIndex={index}
                onPress={goToStep(index)}
                isComplete={stepsState[index]?.isComplete || false}
                isAccessible={stepsState[index]?.isAccessible || false}
              >
                {step}
              </Step>
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
      </div>
    );
  },
};
