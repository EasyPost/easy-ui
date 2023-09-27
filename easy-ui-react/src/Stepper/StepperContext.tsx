import { createContext, useContext } from "react";
import { StepperColor, StepperOrientation } from "./Stepper";

type InternalStepperContextType = {
  color: StepperColor;
  orientation: StepperOrientation;
  activeStepIndex: number;
  totalSteps: number;
};

export const InternalStepperContext =
  createContext<InternalStepperContextType | null>(null);

export function useInternalStepperContext() {
  const stepperContext = useContext(InternalStepperContext);
  if (!stepperContext) {
    throw new Error("InternalStepperContext must be used inside a <Stepper />");
  }
  return stepperContext;
}
