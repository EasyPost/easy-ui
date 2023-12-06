import React, { ReactNode, DOMAttributes } from "react";
import { FocusableElement } from "@react-types/shared";
import { HiddenSelect } from "react-aria";
import { useInternalSelectContext } from "./SelectContext";
import { classNames } from "../utilities/css";
import { IconSymbol } from "../types";
import { Label } from "../InputField/Label";
import { InputCaption } from "../InputField/InputCaption";
import styles from "./Select.module.scss";
import { Text } from "../Text";
import { SelectTrigger } from "./SelectTrigger";

export type SelectFieldSize = "sm" | "md" | "lg";
export type ValidationState = "valid" | "invalid";

export type BaseSelectFieldProps = {
  /**
   * Accessibility label for select field.
   */
  "aria-label"?: string;
  /**
   * Whether the select field is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether user input is required on the select field before form submission.
   * @default false
   */
  isRequired?: boolean;
  /**
   * Whether the input should display its "valid" or "invalid" visual styling.
   * @default valid
   */
  validationState?: ValidationState;
  /**
   * Label text displays with emphasis.
   * @default false
   */
  isLabelEmphasized?: boolean;
  /**
   * Size affects the overall size of the select field, but it also influences
   * the size of iconAtStart.
   * @default md
   */
  size?: SelectFieldSize;
  /** The content to display as the label. */
  label?: ReactNode;
  /** Error text that appears below select field. */
  errorText?: ReactNode;
  /** Helper text that appears below select field. */
  helperText?: ReactNode;
  /** Temporary text that occupies select field when it is empty. */
  placeholder?: string;
  /** Left aligned icon on the select field. */
  iconAtStart?: IconSymbol;
};

type SelectFieldAttributeProps = {
  /** Label props associated with field. */
  labelProps?: DOMAttributes<FocusableElement>;
  /** Helper text props associated with field. */
  helperTextProps?: DOMAttributes<FocusableElement>;
  /** Error text props associated with field. */
  errorTextProps?: DOMAttributes<FocusableElement>;
  /** Field value props. */
  valueProps?: DOMAttributes<FocusableElement>;
};

type SelectFieldProps = BaseSelectFieldProps & SelectFieldAttributeProps;

export function SelectField(props: SelectFieldProps) {
  const {
    isDisabled = false,
    validationState = "valid",
    isLabelEmphasized = false,
    size = "md",
    label,
    errorText,
    helperText,
    placeholder,
    iconAtStart,
    labelProps,
    valueProps,
    errorTextProps,
    helperTextProps,
  } = props;
  const { triggerRef, selectState } = useInternalSelectContext();

  const hasError = validationState === "invalid";
  const showErrorText = hasError && errorText;
  const showHelperText = !showErrorText && helperText;
  const captionProps = showHelperText ? helperTextProps : errorTextProps;
  const captionText = showHelperText ? helperText : errorText;

  return (
    <div className={classNames(styles.fieldRoot)}>
      {label && (
        <Label
          fieldSize={size}
          hasError={hasError}
          isLabelEmphasized={isLabelEmphasized}
          {...labelProps}
        >
          {label}
        </Label>
      )}
      <HiddenSelect
        isDisabled={isDisabled}
        state={selectState}
        triggerRef={triggerRef}
        label={label}
      />
      <SelectTrigger
        valueProps={valueProps}
        iconAtStart={iconAtStart}
        hasError={hasError}
        isDisabled={isDisabled}
        size={size}
      >
        {selectState.selectedItem ? (
          selectState.selectedItem.rendered
        ) : (
          <Text color="neutral.600">{placeholder}</Text>
        )}
      </SelectTrigger>
      {(showErrorText || showHelperText) && (
        <InputCaption
          variant={showHelperText ? "helper" : "error"}
          {...captionProps}
        >
          {captionText}
        </InputCaption>
      )}
    </div>
  );
}
