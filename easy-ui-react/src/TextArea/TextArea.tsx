import React from "react";
import { BaseInputProps } from "../TextField";
import { TextField } from "../TextField";

export type TextAreaSize = "md" | "lg";

export type TextAreaProps = BaseInputProps & {
  /**
   * The size of the TextArea.
   * @default md
   */
  size?: TextAreaSize;
};

/**
 * Allows users to input text on multiple lines.
 *
 * @remarks
 * Use this component when you want to allow users to enter a sizeable amount of free-form text.
 *
 * Labels should always be included as they describe the purpose of the textarea.
 * In situations when you may want the label to be visually hidden, use the `isLabelVisuallyHidden` prop.
 *
 * @example
 * _Description with helper text:_
 * ```tsx
 * import { TextArea } from "@easypost/easy-ui/TextArea";
 *
 * export function Component() {
 *  const [description, setDescription] = useState("");
 *  return (
 *    <>
 *      <TextArea
 *        label="Label"
 *        value={description}
 *        onChange={(inputValue) => setDescription(inputValue)} // value is returned automatically via react-aria
 *        helperText="Enter some text"
 *        isRequired
 *      />
 *      <span>description entered: {description}</span>
 *    </>
 *  );
 * }
 * ```
 * @example
 * _Visually hidden label with placeholder text:_
 * ```tsx
 * import { TextArea } from "@easypost/easy-ui/TextArea";
 *
 * export function Component() {
 *  const [description, setDescription] = useState("");
 *  return (
 *    <>
 *      <TextArea
 *        label="Label" // visually hidden but still accessible via isLabelVisuallyHidden prop
 *        isLabelVisuallyHidden
 *        value={description}
 *        onChange={(inputValue) => setDescription(inputValue)} // value is returned automatically via react-aria
 *        placeholder="Enter free-form text"
 *        isRequired
 *      />
 *      <span>description entered: {description}</span>
 *    </>
 *  );
 * }
 * ```
 * @example
 * _Invalid state with error text:_
 * ```tsx
 * import { TextArea } from "@easypost/easy-ui/TextArea";
 *
 * export function Component() {
 *  const [value, setValue] = useState("");
 *  return (
 *    <>
 *      <TextArea
 *        label="Label"
 *        validationState="invalid"
 *        helperText="Some text" // will be overriden in the presence of an invalid state with error text
 *        errorText="Some error text"
 *        value={value}
 *        onChange={(inputValue) => setDescription(inputValue)} // value is returned automatically via react-aria
 *        isRequired
 *      />
 *    </>
 *  );
 * }
 * ```
 */
export function TextArea(props: TextAreaProps) {
  const {
    size = "md",
    isLabelVisuallyHidden = false,
    isDisabled = false,
    isRequired = false,
    validationState = "valid",
    emphasizedLabel = false,
    autoFocus = false,
    label,
    errorText,
    helperText,
    placeholder,
    value,
    defaultValue,
    rows = 1,
  } = props;
  return (
    <TextField
      isMultiline
      size={size}
      isLabelVisuallyHidden={isLabelVisuallyHidden}
      isDisabled={isDisabled}
      isRequired={isRequired}
      validationState={validationState}
      emphasizedLabel={emphasizedLabel}
      autoFocus={autoFocus}
      label={label}
      errorText={errorText}
      helperText={helperText}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      rows={rows}
    />
  );
}
