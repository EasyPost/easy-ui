import ArrowForwardIcon from "@easypost/easy-ui-icons/ArrowForwardIos";
import React from "react";
import { Icon } from "../Icon";
import { UnstyledButton, UnstyledButtonProps } from "../UnstyledButton";
import { classNames } from "../utilities/css";

import styles from "./ExpandButton.module.scss";

export type ExpandButtonProps = UnstyledButtonProps & {
  isExpanded: boolean;
};

export function ExpandButton({ isExpanded, ...props }: ExpandButtonProps) {
  return (
    <UnstyledButton
      className={classNames(styles.ExpandButton, isExpanded && styles.expanded)}
      {...props}
    >
      <Icon symbol={ArrowForwardIcon} size="2xs" />
    </UnstyledButton>
  );
}
