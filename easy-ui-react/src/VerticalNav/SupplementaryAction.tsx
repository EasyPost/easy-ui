import ArrowForwardIosIcon from "@easypost/easy-ui-icons/ArrowForwardIos";
import { DOMRef } from "@react-types/shared";
import React, {
  ComponentProps,
  ElementType,
  ReactElement,
  ReactNode,
  forwardRef,
} from "react";
import { Icon } from "../Icon";
import { Text } from "../Text";

import styles from "./SupplementaryAction.module.scss";

export type SupplementaryActionProps<T extends ElementType = "button"> =
  ComponentProps<T> & {
    as?: T;
    children: ReactNode;
  };

type SupplementaryActionWithForwardRef = {
  <T extends ElementType = "button">(
    props: SupplementaryActionProps<T> & { ref?: DOMRef },
  ): ReactElement;
  displayName?: string;
};

export const SupplementaryAction = forwardRef<
  HTMLButtonElement,
  SupplementaryActionProps
>((props, ref) => {
  const { as: As = "button", children, ...elementProps } = props;
  return (
    <As ref={ref} className={styles.SupplementaryAction} {...elementProps}>
      <Text variant="subtitle2">{children}</Text>
      <Icon symbol={ArrowForwardIosIcon} size="xs" />
    </As>
  );
}) as SupplementaryActionWithForwardRef;

SupplementaryAction.displayName = "SupplementaryAction";
