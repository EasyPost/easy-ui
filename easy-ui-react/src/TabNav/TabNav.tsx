import { AriaLabelingProps } from "@react-types/shared";
import React, { ReactNode } from "react";
import { Tabs } from "../Tabs";
import { TabNavItem } from "./TabNavItem";

export type TabNavProps = AriaLabelingProps & {
  /** The children of the `<TabNav>` element. Should include `<TabNav.Item>` elements. */
  children: ReactNode;
};

/**
 * A `TabNav` is a set of styled links that lets users navigate between
 * related pages.
 *
 * @remarks
 * Use a `TabNav` for tabs that navigate across URLs. For navigation within
 * the same URL, use `TabPanels`.
 *
 * @example
 * <TabNav aria-label="Account">
 *   <TabNav.Item href="/billing" isCurrentPage={true}>Billing</TabNav.Item>
 *   <TabNav.Item href="/members">Members</TabNav.Item>
 *   <TabNav.Item href="/api-keys">API Keys</TabNav.Item>
 *   <TabNav.Item href="/branded-tracker">Branded Tracker</TabNav.Item>
 *   <TabNav.Item href="/shipping-settings">Shipping Settings</TabNav.Item>
 * </TabNav>
 */
export function TabNav(props: TabNavProps) {
  const { children, ...labelingProps } = props;
  return (
    <Tabs
      containerComponent="nav"
      containerProps={labelingProps}
      listComponent="ul"
      listProps={{ role: "list" }}
    >
      {children}
    </Tabs>
  );
}

/**
 * Represents an item in a `<TabNav />`.
 */
TabNav.Item = TabNavItem;
