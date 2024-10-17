import React, { ReactNode, useContext, useMemo, useRef } from "react";
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

  /** Selected href of primary navigation link. */
  selectedHref?: AriaLinkOptions["href"];

  /** Primary navigation children. */
  children: ReactNode;
};

export type NexusLayoutNavLinkProps = {
  /** Nav link icon symbol. */
  iconSymbol: IconSymbol;

  /** Nav link children. */
  children: ReactNode;
} & AriaLinkOptions;

export type NexusLayoutNavContextType = {
  selectedHref?: NexusLayoutNavProps["selectedHref"];
};

const NexusLayoutNavContext =
  React.createContext<NexusLayoutNavContextType | null>(null);

export const useNexusLayoutNav = () => {
  const context = useContext(NexusLayoutNavContext);
  if (!context) {
    throw new Error("useNexusLayoutNav must be used within a NexusLayoutNav");
  }
  return context;
};

export function NexusLayoutNav(props: NexusLayoutNavProps) {
  const { "aria-label": ariaLabel = "Main", selectedHref, children } = props;
  const context = useMemo(() => {
    return { selectedHref };
  }, [selectedHref]);
  return (
    <NexusLayoutNavContext.Provider value={context}>
      <HorizontalStack as="nav" aria-label={ariaLabel}>
        {children}
      </HorizontalStack>
    </NexusLayoutNavContext.Provider>
  );
}

export function NexusLayoutNavLink(props: NexusLayoutNavLinkProps) {
  const { href, iconSymbol, children } = props;
  const { selectedHref } = useNexusLayoutNav();
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
      <Text variant="subtitle2" weight="semibold">
        {children}
      </Text>
    </a>
  );
}
