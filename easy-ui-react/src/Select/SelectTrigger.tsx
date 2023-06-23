import React, { DOMAttributes, ReactNode } from "react";
import ExpandMoreIcon400 from "@easypost/easy-ui-icons/ExpandMore400";
import { FocusableElement } from "@react-types/shared";
import { useInternalSelectContext } from "./SelectContext";
import { SelectFieldSize } from "./SelectField";
import { UnstyledButton } from "../UnstyledButton";
import { classNames, variationName } from "../utilities/css";
import { IconSymbol } from "../types";
import { InputIcon } from "../InputField/InputIcon";
import styles from "./Select.module.scss";

export type SelectTriggerProps = {
  /**
   * Size affects the overall size of the select field, but it also influences
   * the size of iconAtStart.
   * @default md
   */
  size?: SelectFieldSize;
  /**
   * Whether the select field is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether or not to apply error styles to field.
   * @default false
   */
  hasError?: boolean;
  /** Left aligned icon on the select field. */
  iconAtStart?: IconSymbol;
  /** Field value props. */
  valueProps?: DOMAttributes<FocusableElement>;
  /** Text to render. */
  children: ReactNode;
};

export function SelectTrigger(props: SelectTriggerProps) {
  const {
    size = "md",
    valueProps,
    iconAtStart,
    hasError,
    isDisabled,
    children,
  } = props;
  const { triggerProps, triggerRef } = useInternalSelectContext();

  const hasStartIcon = !!iconAtStart;
  const className = classNames(
    styles.selectField,
    styles.selectFieldIconEnd,
    hasError && styles.selectFieldError,
    hasStartIcon && styles.selectFieldIconStart,
    styles[variationName("selectSize", size)],
  );
  return (
    <div className={styles.selectFieldIconContainer}>
      {hasStartIcon && (
        <InputIcon
          alignment="start"
          icon={iconAtStart}
          size={size}
          isDisabled={isDisabled}
        />
      )}
      <UnstyledButton {...triggerProps} ref={triggerRef} className={className}>
        <span {...valueProps} className={styles.selectFieldText}>
          {children}
        </span>
      </UnstyledButton>
      <InputIcon
        alignment="end"
        icon={ExpandMoreIcon400}
        size={size}
        isDisabled={isDisabled}
      />
    </div>
  );
}
