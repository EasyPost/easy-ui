import React, { Key, ReactNode, useId, useRef } from "react";
import {
  AriaLinkOptions,
  mergeProps,
  useFocusRing,
  useHover,
  useLink,
} from "react-aria";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { IconSymbol } from "../types";
import { classNames } from "../utilities/css";

import styles from "./NexusLayoutMultipageSidebarNav.module.scss";

export type NexusLayoutMultipageSidebarNavProps = {
  /** Sidebar nav title. */
  title: ReactNode;

  /** Selected key of sidebar nav link. */
  selectedKey?: Key;

  /** Multipage container children. */
  children: ReactNode;
};

export type NexusLayoutMultipageSidebarNavSectionProps = {
  /** Sidebar nav section title. */
  title: ReactNode;

  /** Sidebar nav section children. */
  children: ReactNode;
};

export type NexusLayoutMultipageSidebarNavLinkProps = {
  /** Nav link icon symbol. */
  iconSymbol: IconSymbol;

  /** Nav link children. */
  children: ReactNode;
} & AriaLinkOptions;

export function NexusLayoutMultipageSidebarNav(
  props: NexusLayoutMultipageSidebarNavProps,
) {
  const { title, children } = props;
  const titleId = useId();
  return (
    <VerticalStack as="nav" gap="2" aria-labelledBy={titleId}>
      <Text as="h2" variant="heading4" id={titleId}>
        {title}
      </Text>
      {children}
    </VerticalStack>
  );
}

export function NexusLayoutMultipageSidebarNavSection(
  props: NexusLayoutMultipageSidebarNavSectionProps,
) {
  const { title, children } = props;
  return (
    <VerticalStack gap="2">
      <Text variant="overline">{title}</Text>
      {children}
    </VerticalStack>
  );
}

export function NexusLayoutMultipageSidebarNavLink(
  props: NexusLayoutMultipageSidebarNavLinkProps,
) {
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
      <Text variant="body2">{children}</Text>
    </a>
  );
}
