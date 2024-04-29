import { AriaLabelingProps, Key } from "@react-types/shared";
import React, { ReactNode, useMemo, useState } from "react";
import { TabListState } from "react-stately";
import { TabPanelsItem } from "./TabPanelsItem";
import { TabPanelsPanels } from "./TabPanelsPanels";
import { TabPanelsTabs } from "./TabPanelsTabs";
import { TabPanelsContext } from "./context";

export type TabPanelsProps = AriaLabelingProps & {
  /**
   * The children of the `<TabPanels>` element. Should include `<TabPanels.Tabs>`
   * and `<TabPanels.Panels>` elements.
   */
  children: ReactNode;

  /**
   * The initial selected key in the collection (uncontrolled).
   */
  defaultSelectedKey?: Key;

  /**
   * The keys of the tabs that are disabled. These tabs cannot be selected,
   * focused, or otherwise interacted with.
   */
  disabledKeys?: Iterable<Key>;

  /**
   * Whether the entire tab list is disabled.
   */
  isDisabled?: boolean;

  /**
   * Whether tabs are activated automatically on focus or manually.
   *
   * @default "automatic"
   */
  keyboardActivation?: "automatic" | "manual";

  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange?: (key: Key) => void;

  /**
   * The currently selected key in the collection (controlled).
   */
  selectedKey?: Key | null;
};

/**
 * `TabPanels` is a list of tabs that let users switch between multiple views
 * within a related context under the same URL.
 *
 * @remarks
 * Tabs in a tab panel should not be links that navigate the user to a new URL.
 * If you want tab-like navigation, use `TabNav` instead.
 *
 * @example
 * <TabPanels aria-label="History of Ancient Rome">
 *   <TabPanels.Tabs>
 *     <Item key="one">Founding of Rome</Item>
 *     <Item key="two">Monarchy and Republic</Item>
 *     <Item key="three">Empire</Item>
 *   </TabPanels.Tabs>
 *   <TabPanels.Panels>
 *     <Item key="one">Arma virumque cano, Troiae qui primus ab oris.</Item>
 *     <Item key="two">Senatus Populusque Romanus.</Item>
 *     <Item key="three">Alea jacta est.</Item>
 *   </TabPanels.Panels>
 * </TabPanels>
 */
export function TabPanels(props: TabPanelsProps) {
  const [tabListState, setTabListState] = useState<TabListState<object> | null>(
    null,
  );
  const context = useMemo(() => {
    return { tabProps: props, tabListState, setTabListState };
  }, [tabListState, props]);
  return (
    <TabPanelsContext.Provider value={context}>
      {props.children}
    </TabPanelsContext.Provider>
  );
}

/**
 * Represents a container of tabs in a `<TabPanels />`.
 */
TabPanels.Tabs = TabPanelsTabs;

/**
 * Represents a container of panels in a `<TabPanels />`.
 */
TabPanels.Panels = TabPanelsPanels;

/**
 * Represents an item in a `<TabPanels.Panels />` or
 * `<TabPanels.Tabs />` container.
 */
TabPanels.Item = TabPanelsItem;
