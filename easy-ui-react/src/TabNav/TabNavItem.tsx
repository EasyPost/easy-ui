import React, { ComponentProps, ElementType, ReactNode } from "react";
import { mergeProps } from "react-aria";
import { Tabs } from "../Tabs";
import { RouterLinkProps, useRouterLinkProps } from "../utilities/router";

type TabNavItemProps<T extends ElementType = "a"> = ComponentProps<T> &
  RouterLinkProps & {
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
  const {
    as: As = "a",
    children,
    isCurrentPage,
    routerOptions: _routerOptions,
    ...linkProps
  } = props;
  const routerLinkProps = useRouterLinkProps(props, As === "a");
  return (
    <Tabs.Item
      containerComponent="li"
      tabComponent={As}
      isSelected={isCurrentPage}
      {...mergeProps(linkProps as object, routerLinkProps)}
      aria-current={isCurrentPage ? "page" : undefined}
    >
      {children}
    </Tabs.Item>
  );
}
