import React, { Key } from "react";
import { AriaButtonProps } from "react-aria";
import { UnstyledButton } from "../UnstyledButton";
import { IconSymbol } from "../types";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { classNames } from "../utilities/css";

import styles from "./CTAItem.module.scss";

export type CTAItemProps = AriaButtonProps<"button"> & {
  /**
   * Icon symbol SVG source from @easypost/easy-ui-icons.
   */
  symbol?: IconSymbol;
  /**
   * Text content to display.
   */
  label: string;
  /**
   * Hides label on desktop.
   */
  hideLabelOnDesktop?: boolean;
  /**
   * Key to link to <Menu.Item />
   */
  key: Key;
};

export function CTAItem(props: CTAItemProps) {
  const { symbol, label, hideLabelOnDesktop = false, ...restProps } = props;

  return (
    <UnstyledButton {...restProps} className={classNames(styles.cta)}>
      {hideLabelOnDesktop && <Text visuallyHidden>{label}</Text>}
      {symbol && <Icon symbol={symbol} />}
      {!hideLabelOnDesktop && label}
    </UnstyledButton>
  );
}

CTAItem.displayName = "CTAItem";
