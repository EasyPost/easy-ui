import React from "react";
import { Icon } from "../Icon";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import styles from "./TextField.module.scss";
import { mapIconSize } from "./utilities";
import { InputSize } from "./TextField";

export type InputIconAlignment = "start" | "end";

export type InputIconProps = {
  /**
   * Input's icon alignment.
   * @default false
   */
  alignment?: InputIconAlignment;
  /**
   * Size of associated input.
   * @default 'md'
   */
  inputSize?: InputSize;
  /**
   * Apply disabled styles to icon.
   * @default 'false
   */
  isDisabled?: boolean;
  /** Icon to display alongside input. */
  icon: IconSymbol;
};

/**
 * @privateRemarks
 * The InputIcon component has been designed for use on on the TextField
 * component. Icons can appears either at the start or end of the input
 */
export function InputIcon(props: InputIconProps) {
  const {
    alignment = "start",
    inputSize = "md",
    isDisabled = false,
    icon,
  } = props;
  return (
    <div
      className={classNames(
        styles.icon,
        alignment === "start" ? styles.iconStart : styles.iconEnd,
        isDisabled && styles.iconDisabled,
        styles[variationName("inputIconPlacement", inputSize)],
      )}
    >
      <Icon symbol={icon} size={mapIconSize(inputSize)} />
    </div>
  );
}
