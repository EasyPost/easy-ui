import React from "react";
import { InputField, InputFieldProps } from "../InputField";

export type TextareaSize = "md" | "lg";

export type TextareaProps = Omit<
  InputFieldProps,
  "type" | "iconAtStart" | "iconAtEnd" | "maxRows"
> & {
  /**
   * Size of textarea.
   * @default md
   */
  size?: TextareaSize;
  /** Icon pinned to the top left of the textarea. */
  iconAtStart?: InputFieldProps["iconAtStart"];
  /**
   * Grows the textarea with its content, from `rows` up to this many lines,
   * after which it scrolls. Disables manual resizing.
   */
  maxRows?: number;
};

/**
 * Allows users to input text on multiple lines.
 *
 * @remarks
 * Use this component when you want to allow users to enter a sizeable amount of free-form text.
 *
 * Labels should always be included as they describe the purpose of the textarea.
 * In situations when you may want the label to be visually hidden, omit the label and provide an
 * `aria-label`.
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
 *        aria-label="Label"
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
 * _Chat composer that grows to five lines, with a leading icon:_
 * ```tsx
 * import EmojiObjectsIcon from "@easypost/easy-ui-icons/EmojiObjects";
 * import { Textarea } from "@easypost/easy-ui/Textarea";
 *
 * export function Component() {
 *  return (
 *    <Textarea
 *      aria-label="Message"
 *      placeholder="Ask a question"
 *      iconAtStart={EmojiObjectsIcon}
 *      maxRows={5}
 *    />
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
