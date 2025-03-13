import { ReactNode } from "react";
import { Item } from "react-stately";

export type TabPanelsItemProps = {
  /** Rendered contents of the item or child items. */
  children: ReactNode;
};

/**
 * Represents an item in a `<TabPanels.Panels />` or
 * `<TabPanels.Tabs />` container.
 *
 * @privateRemarks
 * This is essentially a re-export of react stately's Item but where this
 * component can control the public interface.
 */
export function TabPanelsItem(_props: TabPanelsItemProps): ReactNode {
  return null;
}

Object.assign(TabPanelsItem, Item);
