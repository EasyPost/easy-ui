# `TabPanels` Component Specification

## Overview

A `TabPanels` is a set of tabs that let users switch between multiple views within a related context under the same URL.

Tabs in a tab panel should not be links that navigate the user to a new URL. If you want tab-like navigation, use `TabNav` instead.

### Features

- Support for mouse, touch, and keyboard interactions on tabs
- Support for LTR and RTL keyboard navigation
- Support for disabled tabs
- Follows the tabs ARIA pattern, semantically linking tabs and their associated tab panels
- Focus management for tab panels without any focusable children

---

## Design

`TabPanels` uses React Aria's [`useTabsList`](https://react-spectrum.adobe.com/react-aria/useTabList.html) under the hood. `useTabsList` provides the behavior and accessibility for a tab list, a faithful implementation of the [W3C ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

Conforming to the W3C ARIA Tabs pattern, the markup for `TabPanels` uses a container with a `tablist` role, along with styled tabs that have a `tab` role, connected to panels that have a `tabpanel` role. `TabPanels` are not intended to be used for navigation, and as such, are missing critical accessibility information for navigational behavior.

`TabPanels` is a compound component. `TabPanels` is used to setup the container. `TabPanels.Tabs` is used to list the tab items. `TabPanels.Panels` is used to list the panel contents for each tab. `TabPanel.Tabs` and `TabPanels.Panels` accepts a list of `<Item />`s as their children with `key`s that must correspond to each other's tab/panel combination.

### API

```ts
type TabPanels = AriaLabelingProps & {
  /**
   * The children of the <TabPanels> element. Should include <TabPanels.Tabs>
   * and <TabPanels.Panels> elements.
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

type TabPanelsTabs = {
  /**
   * The tab items to display. Item keys should match the key of the
   * corresponding <Item> within the <TabPanels.Panels> element.
   */
  children: ReactNode;
}

type TabPanelsPanels = {
  /**
   * The contents of each tab. Item keys should match the key of the
   * corresponding <Item> within the <TabPanels.Tabs> element.
   */
  children: ReactNode;
}
```

### Example Usage

_Basic usage_:

```tsx
import { TabPanels } from "@easypost/easy-ui/TabPanels";

function BasicTabPanels() {
  return (
    <TabPanels
      aria-label="History of Ancient Rome"
      // managing selection (uncontrolled)
      defaultSelectedKey="one"
      // managing selection (controlled)
      selectedKey="one"
      onSelectionChange={(key) => {}}
      // keyboard activation can either be automatic or manual
      keyboardActivation="manual"
    >
      <TabPanels.Tabs>
        <Item key="one">Founding of Rome</Item>
        <Item key="two">Monarchy and Republic</Item>
        <Item key="three">Empire</Item>
      </TabPanels.Tabs>
      <TabPanels.Panels>
        <Item key="one">Arma virumque cano, Troiae qui primus ab oris.</Item>
        <Item key="two">Senatus Populusque Romanus.</Item>
        <Item key="three">Alea jacta est.</Item>
      </TabPanels.Panels>
    </TabPanels>
  );
}
```

_Custom layout_:

`TabPanels.Tabs` and `TabPanels.Panels` are not required to be the immediate children of `TabPanels`. If you need additional structure in-between, `TabPanels` supports this.

```tsx
import { TabPanels } from "@easypost/easy-ui/TabPanels";

function CustomLayoutTabPanels() {
  return (
    <TabPanels aria-label="History of Ancient Rome">
      <div>
        <div>
          <TabPanels.Tabs>
            <Item key="one">Founding of Rome</Item>
            <Item key="two">Monarchy and Republic</Item>
            <Item key="three">Empire</Item>
          </TabPanels.Tabs>
        </div>
        <div>
          <TabPanels.Panels>
            <Item key="one">Arma virumque cano, Troiae qui primus ab oris.</Item>
            <Item key="two">Senatus Populusque Romanus.</Item>
            <Item key="three">Alea jacta est.</Item>
          </TabPanels.Panels>
        </div>
      </div>
    </TabPanels>
  );
}
```

---

## Behavior

### Accessibility

- A tab should never contain an interactive element, as doing so makes it difficult for users of assistive technologies to focus or click on the tabs. Interactive elements may live within the panels.
- When the user is focused on a tab in a `TabPanels`, the following keyboard interactions apply: `Right` and `Left` arrow keys move the user between tabs. If the `keyboardActivation` is set to `automatic`, the currently focused tab's panel will open. If `keyboardActivation` is set to `manual`, the user must press `Enter` or `Space` to activate the tab.
- While an `aria-label` is not explicitly required for a tab list, `TabPanels` should be labeled using an `aria-label` in the absence of an ancestor [landmark](https://www.w3.org/WAI/GL/wiki/Using_ARIA_landmarks_to_identify_regions_of_a_page). This will prevent screen readers from announcing non-focused tabs, allowing for a more focused experience.
- If the currently focused tab is disabled, the tab panel does not open.
- `useTabsList` from React Aria provides the heavy lifting for accessibility, conforming to the [W3C ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).


## Dependencies

- `react-aria`—`useTabsList`
