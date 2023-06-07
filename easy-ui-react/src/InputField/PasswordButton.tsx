import React from "react";
import VisibilityIcon from "@easypost/easy-ui-icons/Visibility";
import VisibilityOffIcon from "@easypost/easy-ui-icons/VisibilityOff";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { InputSize } from "./InputField";
import { classNames, variationName } from "../utilities/css";
import { UnstyledButton } from "../UnstyledButton";
import { mapIconSize } from "./utilities";
import styles from "./InputField.module.scss";

export type PasswordButtonProps = {
  /**
   * Controls visual styles in the presence of an error.
   * @default false
   */
  hasError?: boolean;
  /**
   * Size of associated input.
   * @default 'md'
   */
  inputSize?: InputSize;
  /**
   * Whether the button is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether the password is visible to the user.
   * @default false
   */
  isPasswordVisible?: boolean;
  /** Callback function when password button is clicked. */
  toggleVisibility?: () => void;
};

/**
 * @privateRemarks
 * The PasswordButton component has been designed for use on on the InputField
 * component. Renders a button with a visibility toggle that aligns at
 * the end of the input.
 */
export function PasswordButton(props: PasswordButtonProps) {
  const {
    hasError = false,
    inputSize = "md",
    isDisabled = false,
    isPasswordVisible = false,
    toggleVisibility,
  } = props;
  return (
    <UnstyledButton
      className={classNames(
        styles.passwordBtn,
        hasError && styles.passwordBtnError,
        styles[variationName("passwordBtn", inputSize)],
      )}
      onPress={toggleVisibility}
      isDisabled={isDisabled}
    >
      <Text visuallyHidden>password visibility</Text>
      <Icon
        symbol={isPasswordVisible ? VisibilityIcon : VisibilityOffIcon}
        size={mapIconSize(inputSize)}
      />
    </UnstyledButton>
  );
}
