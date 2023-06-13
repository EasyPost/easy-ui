import React from "react";
import { Icon } from "../Icon";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import styles from "./InputField.module.scss";
import { mapIconSize } from "./utilities";
import { InputSize } from "./InputField";

export type TextFieldIconAlignment = "start" | "end";

export type TextFieldIconProps = {
  /**
   * Input's icon alignment.
   * @default false
   */
  alignment?: TextFieldIconAlignment;
  /**
   * Size of associated input.
   * @default 'md'
   */
  size?: InputSize;
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
 * The InputIcon component has been designed for use on the InputField
 * component. Icons can appears either at the start or end of the input
 */
export function InputIcon(props: TextFieldIconProps) {
  const { alignment = "start", size = "md", isDisabled = false, icon } = props;
  return (
    <div
      className={classNames(
        styles.icon,
        alignment === "start" ? styles.iconStart : styles.iconEnd,
        isDisabled && styles.iconDisabled,
        styles[variationName("inputIconPlacement", size)],
      )}
    >
      <Icon symbol={icon} size={mapIconSize(size)} />
    </div>
  );
}
