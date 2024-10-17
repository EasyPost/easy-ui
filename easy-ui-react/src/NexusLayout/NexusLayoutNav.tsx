import React, { Key, ReactNode, useRef } from "react";
import {
  AriaLinkOptions,
  mergeProps,
  useFocusRing,
  useHover,
  useLink,
} from "react-aria";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { classNames } from "../utilities/css";

import styles from "./NexusLayoutNav.module.scss";

export type NexusLayoutNavProps = {
  /**
   * Custom label for the primary navigation.
   *
   * @default Main
   */
  "aria-label"?: string;

  /** Selected key of primary navigation link. */
  selectedKey?: Key;

  /** Primary navigation children. */
  children: ReactNode;
};

export type NexusLayoutNavLinkProps = {
  /** Nav link icon symbol. */
  iconSymbol: IconSymbol;

  /** Nav link children. */
  children: ReactNode;
} & AriaLinkOptions;

export function NexusLayoutNav(props: NexusLayoutNavProps) {
  const { "aria-label": ariaLabel = "Main", children } = props;
  return (
    <HorizontalStack as="nav" aria-label={ariaLabel}>
      {children}
    </HorizontalStack>
  );
}

export function NexusLayoutNavLink(props: NexusLayoutNavLinkProps) {
  const { iconSymbol, children } = props;
  const ref = useRef(null);
  const { linkProps } = useLink(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing(props);
  const { hoverProps, isHovered } = useHover(props);
  const className = classNames(
    styles.link,
    isFocusVisible && styles.focused,
    isHovered && styles.hovered,
  );
  return (
    <a
      ref={ref}
      className={className}
      {...mergeProps(hoverProps, focusProps, linkProps)}
    >
      <Icon symbol={iconSymbol} />
      <Text variant="subtitle2">{children}</Text>
    </a>
  );
}
