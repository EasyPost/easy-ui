import React, { ReactNode } from "react";
import { Text } from "../Text";
import { InputSize } from "./TextField";
import styles from "./TextField.module.scss";
import { classNames } from "../utilities/css";

export type LabelProps = {
  /**
   * Visually hides the label, but keeps it accessible.
   * @default false
   */
  isLabelVisuallyHidden?: boolean;
  /**
   * Label text displays with emphasis.
   * @default false
   */
  emphasizedLabel?: boolean;
  /**
   * Size of associated input.
   * @default 'md'
   */
  inputSize?: InputSize;
  /**
   * Label text displays with error styles.
   * @default false
   */
  hasError?: boolean;
  /** Label content. */
  children: ReactNode;
};

/**
 * @privateRemarks
 * The Label component has been designed for use on the TextField
 * and TextArea components. Appears above inputs and handles sizing,
 * visual styles for emphasis and error states, and can be visually hidden.
 */
export function Label(props: LabelProps) {
  const {
    isLabelVisuallyHidden = false,
    emphasizedLabel = false,
    inputSize = "md",
    hasError = false,
    children,
    ...labelProps
  } = props;

  const textVariant = emphasizedLabel
    ? "subtitle1"
    : inputSize === "sm"
    ? "body2"
    : "body1";
  const as = emphasizedLabel ? "strong" : "span";
  const color = hasError ? "danger" : undefined;
  return (
    <label
      {...labelProps}
      className={classNames(
        styles.label,
        isLabelVisuallyHidden && styles.labelHidden,
      )}
    >
      <Text
        variant={textVariant}
        as={as}
        color={color}
        visuallyHidden={isLabelVisuallyHidden}
      >
        {children}
      </Text>
    </label>
  );
}
