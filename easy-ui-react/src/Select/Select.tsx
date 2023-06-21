import React, { ReactNode, Key, useMemo } from "react";
import { CollectionChildren } from "@react-types/shared";
import { useSelectState } from "react-stately";
import { AriaSelectProps, useSelect } from "react-aria";
import { InternalSelectContext } from "./SelectContext";
import { SelectField } from "./SelectField";
import { SelectOption } from "./SelectOption";
import { SelectOverlay } from "./SelectOverlay";
import { useTriggerWidth } from "../Menu/useTriggerWidth";
import { IconSymbol } from "../types";

export type SelectSize = "sm" | "md" | "lg";
export type ValidationState = "valid" | "invalid";

export type SelectProps<T> = AriaSelectProps<T> & {
  /**
   * Visually hides the label, but keeps it accessible.
   * @default false
   */
  isLabelVisuallyHidden?: boolean;
  /**
   * Whether the select field is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether the select field should display its "valid" or "invalid" visual styling.
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
  size?: SelectSize;
  /** The content to display as the label. */
  label: ReactNode;
  /** Error text that appears below select field. */
  errorText?: ReactNode;
  /** Helper text that appears below select field. */
  helperText?: ReactNode;
  /** Left aligned icon on select field. */
  iconAtStart?: IconSymbol;
  /** Temporary text that occupies the text input when it is empty. */
  placeholder?: string;
  /** Method that is called when the open state of the select field changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** Sets the open state of the select field. */
  isOpen?: boolean;
  /** The currently selected key in the collection (controlled). */
  selectedKey?: Key | null;
  /** The initial selected key in the collection (uncontrolled). */
  defaultSelectedKey?: Key;
  /** Handler that is called when the selection changes. */
  onSelectionChange?: (key: Key) => void;
  /** The contents of the collection. */
  children: CollectionChildren<T>;
  /** The item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with. */
  disabledKeys?: Iterable<Key>;
};

export function Select<T extends object>(props: SelectProps<T>) {
  const {
    isLabelVisuallyHidden,
    isDisabled,
    validationState,
    isLabelEmphasized,
    size = "md",
    label,
    errorText,
    helperText,
    placeholder,
    iconAtStart,
  } = props;

  const triggerRef = React.useRef(null);
  const selectState = useSelectState(props);

  const {
    labelProps,
    valueProps,
    triggerProps,
    menuProps: listBoxPropsFromSelect,
    descriptionProps: helperTextProps,
    errorMessageProps: errorTextProps,
  } = useSelect(props, selectState, triggerRef);

  const triggerWidth = useTriggerWidth(triggerRef);

  const context = useMemo(() => {
    return {
      triggerProps,
      listBoxPropsFromSelect,
      triggerRef,
      selectState,
      triggerWidth,
    };
  }, [triggerProps, listBoxPropsFromSelect, selectState, triggerWidth]);

  return (
    <InternalSelectContext.Provider value={context}>
      <SelectField
        isLabelVisuallyHidden={isLabelVisuallyHidden}
        isDisabled={isDisabled}
        validationState={validationState}
        isLabelEmphasized={isLabelEmphasized}
        size={size}
        label={label}
        errorText={errorText}
        helperText={helperText}
        placeholder={placeholder}
        iconAtStart={iconAtStart}
        labelProps={labelProps}
        valueProps={valueProps}
        helperTextProps={helperTextProps}
        errorTextProps={errorTextProps}
      />
      <SelectOverlay />
    </InternalSelectContext.Provider>
  );
}

Select.Option = SelectOption;
