import {
  InputHTMLAttributes,
  MutableRefObject,
  TextareaHTMLAttributes,
} from "react";
import { useTextField } from "react-aria";
import { getElementType } from "./utilities";
import { InputFieldProps } from "./InputField";

export function useInputField(
  props: InputFieldProps,
  ref: MutableRefObject<null>,
) {
  const { isMultiline = false } = props;
  const {
    labelProps,
    inputProps,
    descriptionProps: helperTextProps,
    errorMessageProps: errorTextProps,
  } = useTextField(
    { ...props, inputElementType: getElementType(isMultiline) },
    ref,
  );

  let elementProps = {};
  if (isMultiline) {
    elementProps = inputProps as TextareaHTMLAttributes<HTMLTextAreaElement>;
  } else {
    elementProps = inputProps as InputHTMLAttributes<HTMLInputElement>;
  }
  return {
    labelProps,
    elementProps,
    helperTextProps,
    errorTextProps,
  };
}
