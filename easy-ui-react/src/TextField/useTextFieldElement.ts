import { MutableRefObject } from "react";
import { useTextField } from "react-aria";
import { TextFieldProps } from "./TextField";

export function useTextFieldElement(
  props: TextFieldProps,
  ref: MutableRefObject<null>,
) {
  const { as: Elem } = props;
  const {
    labelProps: labelPropsTextArea,
    inputProps: inputPropsTextArea,
    descriptionProps: helperTextPropsTextArea,
    errorMessageProps: errorTextPropsTextArea,
  } = useTextField({ ...props, inputElementType: "textarea" }, ref);

  const {
    labelProps: labelPropsInput,
    inputProps: inputPropsInput,
    descriptionProps: helperTextPropsInput,
    errorMessageProps: errorTextPropsInput,
  } = useTextField(props, ref);

  let labelProps = {};
  let elementProps = {};
  let helperTextProps = {};
  let errorTextProps = {};

  if (Elem === "textarea") {
    labelProps = labelPropsTextArea;
    elementProps = inputPropsTextArea;
    helperTextProps = helperTextPropsTextArea;
    errorTextProps = errorTextPropsTextArea;
  } else {
    labelProps = labelPropsInput;
    elementProps = inputPropsInput;
    helperTextProps = helperTextPropsInput;
    errorTextProps = errorTextPropsInput;
  }
  return {
    labelProps,
    elementProps,
    helperTextProps,
    errorTextProps,
  };
}
