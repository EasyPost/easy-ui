import React from "react";
import { InputField, InputFieldProps } from "../InputField";

export type TextareaSize = "md" | "lg";

export type TextareaProps = Omit<
  InputFieldProps,
  "type" | "iconAtStart" | "iconAtEnd"
> & {
  /**
   * Size of textarea.
   * @default md
   */
  size?: TextareaSize;
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
 * import { Textarea } from "@easypost/easy-ui/Textarea";
 *
 * export function Component() {
 *  const [description, setDescription] = useState("");
 *  return (
 *    <>
 *      <Textarea
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
 * import { Textarea } from "@easypost/easy-ui/Textarea";
 *
 * export function Component() {
 *  const [description, setDescription] = useState("");
 *  return (
 *    <>
 *      <Textarea
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
 * import { Textarea } from "@easypost/easy-ui/Textarea";
 *
 * export function Component() {
 *  const [value, setValue] = useState("");
 *  return (
 *    <>
 *      <Textarea
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
export function Textarea(props: TextareaProps) {
  const {
    size = "md",
    isLabelVisuallyHidden = false,
    isDisabled = false,
    isRequired = false,
    validationState = "valid",
    isLabelEmphasized = false,
    autoFocus = false,
    rows = 1,
    ...restProps
  } = props;
  return (
    <InputField
      isMultiline
      size={size}
      isLabelVisuallyHidden={isLabelVisuallyHidden}
      isDisabled={isDisabled}
      isRequired={isRequired}
      validationState={validationState}
      isLabelEmphasized={isLabelEmphasized}
      autoFocus={autoFocus}
      rows={rows}
      {...restProps}
    />
  );
}
