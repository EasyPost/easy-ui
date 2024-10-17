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
  title: ReactNode;
  selectedKey?: Key;
  children: ReactNode;
};

export type NexusLayoutMultipageSidebarNavSectionProps = {
  title: ReactNode;
  children: ReactNode;
};

export type NexusLayoutMultipageSidebarNavLinkProps = {
  iconSymbol: IconSymbol;
  children: ReactNode;
} & AriaLinkOptions;

export function NexusLayoutMultipageSidebarNav(
  props: NexusLayoutMultipageSidebarNavProps,
) {
  const { title, children } = props;
  const titleId = useId();
  return (
    <VerticalStack as="nav" gap="2" aria-labelledBy={titleId}>
      <Text variant="heading4" id={titleId}>
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
