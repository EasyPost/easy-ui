import React, { ComponentProps, ElementType, ReactNode } from "react";
import { Tabs } from "../Tabs";

type TabNavItemProps<T extends ElementType = "a"> = ComponentProps<T> & {
  /** Override the default element with a custom one to provide unique behavior. Useful for client-side navigation link components in app frameworks. */
  as?: T;

  /** The children of the `<TabNav.Item>` element. */
  children: ReactNode;

  /** Sets the `<TavNav.Item>` as the current page and adds `aria-current="page"`. */
  isCurrentPage?: boolean;
};

export function TabNavItem<T extends ElementType = "a">(
  props: TabNavItemProps<T>,
) {
  const { as: As = "a", children, isCurrentPage, ...linkProps } = props;
  return (
    <Tabs.Item
      outerComponent="li"
      as={As}
      isSelected={isCurrentPage}
      {...linkProps}
      aria-current={isCurrentPage ? "page" : undefined}
    >
      {children}
    </Tabs.Item>
  );
}
