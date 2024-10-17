import React, { ReactNode } from "react";
import CloseIcon from "@easypost/easy-ui-icons/Close";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { UnstyledButton } from "../UnstyledButton";
import styles from "./Pill.module.scss";

export type PillProps = {
  /** Text label */
  children: ReactNode;
  /** Left aligned icon */
  icon?: IconSymbol;
  /** Callback function when dismissing Pill */
  onDismiss?: () => void;
};

export function Pill(props: PillProps) {
  const { children, icon, onDismiss } = props;

  return (
    <span className={styles.Pill}>
      {icon && <Icon size="xs" symbol={icon} color="primary.700" />}
      <Text color="primary.800" variant="subtitle2">
        {children}
      </Text>
      {onDismiss && (
        <UnstyledButton className={styles.dismiss} onPress={onDismiss}>
          <Icon size="xs" symbol={CloseIcon} color="primary.600" />
        </UnstyledButton>
      )}
    </span>
  );
}
