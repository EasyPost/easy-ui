import React, { useMemo } from "react";
import { CollectionChildren, Key } from "@react-types/shared";
import { useSelectState } from "react-stately";
import { AriaSelectProps, useSelect } from "react-aria";
import { InternalSelectContext } from "./SelectContext";
import { SelectField, BaseSelectFieldProps } from "./SelectField";
import { SelectOption } from "./SelectOption";
import { SelectSection } from "./SelectSection";
import { SelectOverlay } from "./SelectOverlay";
import { useTriggerWidth } from "../Menu/useTriggerWidth";
import { logWarningForMissingAriaLabel } from "../InputField/utilities";

export type BaseSelectProps<T, K extends Key = Key> = {
  /** Method that is called when the open state of the select field changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** Sets the open state of the select field. */
  isOpen?: boolean;
  /** The currently selected key in the collection (controlled). */
  selectedKey?: K | null;
  /** The initial selected key in the collection (uncontrolled). */
  defaultSelectedKey?: K;
  /** Handler that is called when the selection changes. */
  onSelectionChange?: (key: K) => void;
  /** The contents of the collection. */
  children: CollectionChildren<T>;
  /** The option keys that are disabled. These options cannot be selected, focused, or otherwise interacted with. */
  disabledKeys?: Iterable<K>;
};

export type SelectProps<T, K extends Key> = Omit<
  AriaSelectProps<T>,
  keyof BaseSelectProps<T, K>
> &
  BaseSelectFieldProps &
  BaseSelectProps<T, K>;

/**
 * The `<Select />` component allows users to select a value from a set of options.
 *
 * @remarks
 * A common use-case for this component is to be used on forms as a traditional
 * select.
 *
 * @example
 * _Simple controlled selection:_
*```tsx
* import { Select } from "@easypost/easy-ui/Select";
*
* export function Component() {
*  const [selectedOption, setSelectedOption] = React.useState("Option 1");
*
*  return (
*    <Select
*      label="Label"
*      selectedKey={selectedOption}
*      onSelectionChange={(selected) => setSelectedOption(selected)}
*      helperText="Helper text"
*    >
*      <Select.Option key="Option 1">Option 1</Select.Option>
*      <Select.Option key="Option 2">Option 2</Select.Option>
*      <Select.Option key="Option 3">Option 3</Select.Option>
*    </Select>
*  );
* }
```
*
* @example
* _Simple controlled selection with separator:_
*```tsx
* import { Select } from "@easypost/easy-ui/Select";
*
* export function Component() {
*  const [selectedOption, setSelectedOption] = React.useState("Option 1");
*
*  return (
*    <Select
*      label="Label"
*      selectedKey={selectedOption}
*      onSelectionChange={(selected) => setSelectedOption(selected)}
*      helperText="Helper text"
*    >
*      <Select.Section aria-label="Primary options">
*       <Select.Option key="Option 1">Option 1</Select.Option>
*       <Select.Option key="Option 2">Option 2</Select.Option>
*       <Select.Option key="Option 3">Option 3</Select.Option>
*       </Select.Section>
*      <Select.Section aria-label="Secondary options">
*       <Select.Option key="Option 4">Option 4</Select.Option>
*       <Select.Option key="Option 5">Option 5</Select.Option>
*       <Select.Option key="Option 6">Option 6</Select.Option>
*       </Select.Section>
*    </Select>
*  );
* }
```
 */
export function Select<T extends object, K extends Key>(
  props: SelectProps<T, K>,
) {
  const {
    isDisabled,
    validationState,
    isLabelEmphasized,
    size = "md",
    "aria-label": ariaLabel,
    label,
    errorText,
    helperText,
    placeholder,
    iconAtStart,
  } = props;

  const triggerRef = React.useRef(null);

  // hate to do this, but react-aria doesn't support generics, but it would
  // really be ideal to have the select be generic. FIXME when react-aria's
  // types around `Key` are fixed.
  const castProps = props as SelectProps<object, Key>;

  const selectState = useSelectState(castProps);

  logWarningForMissingAriaLabel(label, ariaLabel);

  const {
    labelProps,
    valueProps,
    triggerProps,
    menuProps: listBoxPropsFromSelect,
    descriptionProps: helperTextProps,
    errorMessageProps: errorTextProps,
  } = useSelect(castProps, selectState, triggerRef);

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
/**
 * Represents a section in a `<Select />`.
 *
 * @remarks
 * Should be used as a wrapper for `<Select.Option />` and
 * as `<Select.Section />`
 */
Select.Section = SelectSection;

/**
 * Represents an option for `<Select />`.
 *
 * @remarks
 * Should be rendered as a child of `<Select />` as
 * `<Select.Option />`.
 */
Select.Option = SelectOption;
