import React, { ReactNode } from "react";
import { Text } from "../Text";
import styles from "./InputField.module.scss";

export type InputCaptionVariant = "error" | "helper";
export type InputCaptionProps = {
  /** Determines styles to apply to text. */
  variant: InputCaptionVariant;
  /** Caption text content to render. */
  children: ReactNode;
};

/**
 * @privateRemarks
 * The InputCaption component has been designed for use on on the InputField component.
 * Appears below input and handles visual styles for helper and error states.
 */
export function InputCaption(props: InputCaptionProps) {
  const { variant, children, ...captionTextProps } = props;

  return (
    <div {...captionTextProps} className={styles.caption}>
      <Text
        variant="caption"
        color={variant === "helper" ? "subdued" : "danger"}
      >
        {children}
      </Text>
    </div>
  );
}
