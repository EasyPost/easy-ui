import ArrowForwardIosIcon from "@easypost/easy-ui-icons/ArrowForwardIos";
import React, { ComponentProps, ElementType, ReactNode } from "react";
import { Icon } from "../Icon";
import { Text } from "../Text";

import styles from "./VerticalNav.module.scss";

export type SupplementaryActionProps<T extends ElementType = "button"> =
  ComponentProps<T> & {
    as?: T;
    children: ReactNode;
  };

export function SupplementaryAction(props: SupplementaryActionProps) {
  const { as: As = "button", children, ...elementProps } = props;
  return (
    <As className={styles.supplementaryAction} {...elementProps}>
      <Text variant="subtitle2">{children}</Text>
      <Icon symbol={ArrowForwardIosIcon} size="xs" />
    </As>
  );
}
