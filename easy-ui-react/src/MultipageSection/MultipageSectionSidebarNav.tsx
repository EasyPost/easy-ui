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

import styles from "./MultipageSectionSidebarNav.module.scss";

export type MultipageSectionSidebarNavProps = {
  /** Selected href of sidebar nav link. */
  selectedHref?: AriaLinkOptions["href"];
  /** Multipage container children. */
  children: ReactNode;
};

export type MultipageSectionSidebarNavSectionProps = {
  /** Sidebar nav section title. */
  title: ReactNode;
  /** Sidebar nav section children. */
  children: ReactNode;
};

export type MultipageSectionSidebarNavLinkProps = {
  /** Nav link icon symbol. */
  iconSymbol: IconSymbol;
  /** Nav link children. */
  children: ReactNode;
} & AriaLinkOptions;

export type SidebarNavContextType = {
  selectedHref?: MultipageSectionSidebarNavProps["selectedHref"];
};

const SidebarNavContext = React.createContext<SidebarNavContextType | null>(
  null,
);

export const useMultipageSectionSidebarNav = () => {
  const context = useContext(SidebarNavContext);
  if (!context) {
    throw new Error(
      "useMultipageSectionSidebarNav must be used within a MultipageSectionSidebarNav",
    );
  }
  return context;
};

export function MultipageSectionSidebarNav(
  props: MultipageSectionSidebarNavProps,
) {
  const { selectedHref, children } = props;
  const titleId = useId();
  const context = useMemo(() => {
    return { selectedHref };
  }, [selectedHref]);
  return (
    <SidebarNavContext.Provider value={context}>
      <VerticalStack as="nav" gap="2" aria-labelledby={titleId}>
        {children}
      </VerticalStack>
    </SidebarNavContext.Provider>
  );
}

export function MultipageSectionSidebarNavSection(
  props: MultipageSectionSidebarNavSectionProps,
) {
  const { title, children } = props;
  return (
    <VerticalStack gap="2" inlineAlign="start">
      <Text variant="overline">{title}</Text>
      {children}
    </VerticalStack>
  );
}

export function MultipageSectionSidebarNavLink(
  props: MultipageSectionSidebarNavLinkProps,
) {
  const { href, iconSymbol, children } = props;
  const { selectedHref } = useMultipageSectionSidebarNav();

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
