import React from "react";
import { InputField, InputFieldProps } from "../InputField";

export type TextFieldProps = Omit<InputFieldProps, "isMultiline" | "rows">;

/**
 * Allows users to input text on a single line and has the essentials
 * to be used as a form control element.
 *
 * @remarks
 * Use this component when building forms that require `text`, `email`, `password`,
 * and `tel` inputs. Can also be used as the basis for a `search` input.
 *
 * Setting `type` to `password` adds a clickable and focusable right aligned
 * visibility icon.
 *
 * When `errorText` is supplied with `validationState="invalid"`, `helperText` is overriden.
 *
 * Labels should be included on all text fields as they describe the purpose of the form control.
 * In situations when you may want the label to be visually hidden, omit the label and provide an
 * `aria-label`.
 *
 * @example
 * _Email with autoFocus:_
 * ```tsx
 * import { TextField } from "@easypost/easy-ui/TextField";
 *
 * export function Component() {
 *  const [email, setEmail] = useState("");
 *  return (
 *    <>
 *      <TextField
 *        type="email"
 *        label="Email address"
 *        autoFocus
 *        value={email}
 *        onChange={(inputValue) => setEmail(inputValue)} // value is returned automatically via react-aria
 *        isRequired
 *      />
 *      <span>email entered: {email}</span>
 *    </>
 *  );
 * }
 * ```
 * @example
 * _Password variation with helper text:_
 * ```tsx
 * import { TextField } from "@easypost/easy-ui/TextField";
 *
 * export function Component() {
 *  const [password, setPassword] = useState("");
 *  return (
 *    <>
 *      <TextField
 *        type="password"
 *        label="Password"
 *        helperText={<a href={RESET_URL}>Forgot password? </a>}
 *        value={password}
 *        onChange={(inputValue) => setPassword(inputValue)} // value is returned automatically via react-aria
 *        isRequired
 *      />
 *    </>
 *  );
 * }
 * ```
 * @example
 * _Visually hidden label with left aligned icon and placeholder text:_
 * ```tsx
 * import { TextField } from "@easypost/easy-ui/TextField";
 *
 * export function Component() {
 *  const [searchedValue, setSearchedValue] = useState("");
 *  return (
 *    <>
 *      <TextField
 *        type="search"
 *        aria-label="Search for carriers"
 *        iconAtStart={SearchIcon}
 *        value={searchedValue}
 *        onChange={(inputValue) => setSearchedValue(inputValue)} // value is returned automatically via react-aria
 *        placeholder="FedEx, UPS, USPS"
 *        isRequired
 *      />
 *    </>
 *  );
 * }
 * ```
 * @example
 * _Invalid state with error text:_
 * ```tsx
 * import { TextField } from "@easypost/easy-ui/TextField";
 *
 * export function Component() {
 *  const [value, setValue] = useState("");
 *  return (
 *    <>
 *      <TextField
 *        label="Error"
 *        validationState="invalid"
 *        helperText="Some text" // will be overriden in the presence of an invalid state with error text
 *        errorText="Some error text"
 *        value={value}
 *        onChange={(inputValue) => setValue(inputValue)} // value is returned automatically via react-aria
 *        isRequired
 *      />
 *    </>
 *  );
 * }
 * ```
 */
export function TextField(props: TextFieldProps) {
  const {
    type = "text",
    size = "md",
    isDisabled = false,
    isRequired = false,
    validationState = "valid",
    isLabelEmphasized = false,
    autoFocus = false,
    ...restProps
  } = props;
  return (
    <InputField
      type={type}
      size={size}
      isDisabled={isDisabled}
      isRequired={isRequired}
      validationState={validationState}
      isLabelEmphasized={isLabelEmphasized}
      autoFocus={autoFocus}
      {...restProps}
    />
  );
}
