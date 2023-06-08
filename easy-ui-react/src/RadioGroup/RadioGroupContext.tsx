import React, { useContext } from "react";
import { RadioGroupState } from "react-stately";

export const RadioGroupContext = React.createContext<RadioGroupState | null>(
  null,
);

export const useRadioGroupContext = () => {
  const radioGroupContext = useContext(RadioGroupContext);
  if (!radioGroupContext) {
    throw new Error("Must be within a RadioGroup");
  }
  return radioGroupContext;
};
