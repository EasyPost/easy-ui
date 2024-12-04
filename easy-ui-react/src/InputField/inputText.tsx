import React from "react";
import { Text } from "../Text";
import { InputSize } from "./InputField";
import styles from "./InputField.module.scss";
import { classNames, variationName } from "../utilities/css";

export type TextFieldTextAlignment = "start" | "end";

export type TextFieldTextProps = {
  /**
   * Input's text alignment.
   * @default false
   */
  alignment?: TextFieldTextAlignment;
  /**
   * Size of associated input.
   * @default 'md'
   */
  size?: InputSize;
  /** Text to display alongside input. */
  text: string;
};

/**
 * @privateRemarks
 * The InputText component has been designed for use on the InputField
 * component. Text can appears either at the start or end of the input
 */

export function InputText(props: TextFieldTextProps) {
  const { alignment = "start", size = "md", text } = props;
  return (
    <div
      className={classNames(
        styles.text,
        alignment === "start" ? styles.textStart : styles.textEnd,
        styles[variationName("inputTextPlacement", size)],
      )}
    >
      <Text>{text}</Text>
    </div>
  );
}
