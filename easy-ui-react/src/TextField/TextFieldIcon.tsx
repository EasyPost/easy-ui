import React from "react";
import { Icon } from "../Icon";
import { IconSymbol } from "../types";
import { classNames, variationName } from "../utilities/css";
import styles from "./TextField.module.scss";
import { mapIconSize } from "./utilities";
import { TextFieldSize } from "./TextField";

export type TextFieldIconAlignment = "start" | "end";

export type TextFieldIconProps = {
  /**
   * TextField's icon alignment.
   * @default false
   */
  alignment?: TextFieldIconAlignment;
  /**
   * Size of associated TextField.
   * @default 'md'
   */
  size?: TextFieldSize;
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
 * The TextFieldIcon component has been designed for use on on the TextField
 * component. Icons can appears either at the start or end of the input
 */
export function TextFieldIcon(props: TextFieldIconProps) {
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
