import React, { Key } from "react";
import { UnstyledButton } from "../UnstyledButton";
import { CTAItemProps } from "./PrimaryCTAItem";
import { IconSymbol } from "../types";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { classNames } from "../utilities/css";

import styles from "./SecondaryCTAItem.module.scss";

export type SecondaryCTAItemProps = CTAItemProps & {
  /**
   * Icon symbol SVG source from @easypost/easy-ui-icons.
   */
  symbol?: IconSymbol;
  /**
   * Hides label on desktop.
   * @default false
   */
  hideLabelOnDesktop?: boolean;
  /**
   * Key to link to <Menu.Item />
   */
  key: Key;
};

export function SecondaryCTAItem(props: SecondaryCTAItemProps) {
  const { symbol, label, hideLabelOnDesktop = false, ...restProps } = props;

  return (
    <UnstyledButton {...restProps} className={classNames(styles.cta)}>
      {symbol && <Icon symbol={symbol} />}
      {hideLabelOnDesktop ? <Text visuallyHidden>{label}</Text> : label}
    </UnstyledButton>
  );
}

SecondaryCTAItem.displayName = "SearchNav.SecondaryCTAItem";
