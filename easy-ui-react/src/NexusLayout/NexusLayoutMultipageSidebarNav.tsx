import React, { ReactNode, useContext, useId, useMemo, useRef } from "react";
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

  /** Selected href of sidebar nav link. */
  selectedHref?: AriaLinkOptions["href"];

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

export type SidebarNavContextType = {
  selectedHref?: NexusLayoutMultipageSidebarNavProps["selectedHref"];
};

const SidebarNavContext = React.createContext<SidebarNavContextType | null>(
  null,
);

export const useNexusLayoutMultipageSidebarNav = () => {
  const context = useContext(SidebarNavContext);
  if (!context) {
    throw new Error(
      "useNexusLayoutMultipageSidebarNav must be used within a NexusLayoutMultipageSidebarNav",
    );
  }
  return context;
};

export function NexusLayoutMultipageSidebarNav(
  props: NexusLayoutMultipageSidebarNavProps,
) {
  const { selectedHref, title, children } = props;
  const titleId = useId();
  const context = useMemo(() => {
    return { selectedHref };
  }, [selectedHref]);
  return (
    <SidebarNavContext.Provider value={context}>
      <VerticalStack as="nav" gap="2" aria-labelledby={titleId}>
        <Text as="h2" variant="heading4" id={titleId}>
          {title}
        </Text>
        {children}
      </VerticalStack>
    </SidebarNavContext.Provider>
  );
}

export function NexusLayoutMultipageSidebarNavSection(
  props: NexusLayoutMultipageSidebarNavSectionProps,
) {
  const { title, children } = props;
  return (
    <VerticalStack gap="2" inlineAlign="start">
      <Text variant="overline">{title}</Text>
      {children}
    </VerticalStack>
  );
}

export function NexusLayoutMultipageSidebarNavLink(
  props: NexusLayoutMultipageSidebarNavLinkProps,
) {
  const { href, iconSymbol, children } = props;
  const { selectedHref } = useNexusLayoutMultipageSidebarNav();

  const ref = useRef(null);
  const { linkProps } = useLink(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing(props);
  const { hoverProps, isHovered } = useHover(props);
  const isSelected = href === selectedHref;
  const className = classNames(
    styles.link,
    isFocusVisible && styles.focused,
    isHovered && styles.hovered,
    isSelected && styles.selected,
  );
  return (
    <a
      ref={ref}
      className={className}
      {...mergeProps(hoverProps, focusProps, linkProps)}
      aria-current={isSelected ? "page" : undefined}
    >
      <Icon symbol={iconSymbol} />
      <Text variant="body2" weight={isSelected ? "semibold" : undefined}>
        {children}
      </Text>
    </a>
  );
}
