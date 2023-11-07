# `VerticalNav` Component Specification

## Overview

`VerticalNav` renders a vertical list of navigation links.

### Prior Art

- [Primer `<NavList />`](https://primer.style/components/nav-list)

---

## Design

`VerticalNav` will be a compound component consisting of `VerticalNav`, `VerticalNav.Item`, and `VerticalNav.Subnav`.

A vertical list of links with expandable top-level items can be rendered with an `ExpandableVerticalNav`.

`VerticalNav` uses React Stately's `useListState` hook behind the scenes. This not only handles managing the selection of items but provides consistency with other Easy UI component APIs. `ExpandableVerticalNav` uses React Stately's `useTreeState` hook to support expansion.

`VerticalNav.Item` controls rendering individual links within a list. It contains props for the link's `label`, `icon`, and optionally a `children` prop to render nested subnavigation.

`VerticalNav.Item` is a polymorphic component. By default, it renders as an anchor element—`<a>`—but it can be rendered as a custom element using the `as` prop. e.g. `<VerticalNav.Item as={NextLink} href="/account/settings" />`.

Selection and expansion is controlled by the consumer through the API provided by React Stately's `useListState` and `useTreeState` hooks—`selectedKeys`, `expandedKeys`, and `onExpandedChange`. Note that while the React Stately API accepts an array of `selectedKeys`, the `selectionMode` is set to `single`, so only one key is read.

The API is flexible for limiting surface area and accommodating potential future use cases. Current constraints will be enforced at runtime to meet design requirements—e.g. limiting the levels of sub navigation.

### API

```ts
type BaseVerticalNavProps = AriaLabelingProps & {
  children: ReactNode;
  renderLogo?: () => ReactNode;
};

export type VerticalNavProps = BaseVerticalNavProps & ListProps<object>;

export type ExpandableVerticalNavProps = BaseVerticalNavProps &
  TreeProps<object>;

export type VerticalNavItemProps<T extends ElementType = "a"> =
  ComponentProps<T> & {
    as?: T;
    label: string;
    icon?: IconSymbol;
    children?: ReactNode;
  };

export type VerticalNavSubnavProps = ListProps<object>;
```

### Example Usage

_Simple vertical nav:_

```tsx
import { VerticalNav } from "@easypost/easy-ui/VerticalNav";

function Sidebar() {
  return (
    <VerticalNav aria-label="Sidebar" selectedKeys={["1"]}>
      <VerticalNav.Item key="1" href="/item-1" icon={Symbol} label="Item 1" />
      <VerticalNav.Item key="2" href="/item-2" icon={Symbol} label="Item 2" />
      <VerticalNav.Item key="3" href="/item-3" icon={Symbol} label="Item 3" />
      <VerticalNav.Item key="4" href="/item-4" icon={Symbol} label="Item 4" />
    </VerticalNav>
  );
}
```

_Dense vertical nav:_

```tsx
import { VerticalNav } from "@easypost/easy-ui/VerticalNav";

function Sidebar() {
  return (
    <VerticalNav aria-label="Sidebar" selectedKeys={["1"]}>
      <VerticalNav.Item key="1" href="/item-1" icon={Symbol} label="Item 1" />
      <VerticalNav.Item key="2" href="/item-2" icon={Symbol} label="Item 2">
        <VerticalNav.Subnav selectedKeys={["2a"]}>
          <VerticalNav.Item key="2a" href="/subitem-1" label="Subitem 1" />
          <VerticalNav.Item key="2b" href="/subitem-2" label="Subitem 2" />
        </VerticalNav.Subnav>
      </VerticalNav.Item>
      <VerticalNav.Item key="3" href="/item-3" icon={Symbol} label="Item 3" />
      <VerticalNav.Item key="4" href="/item-4" icon={Symbol} label="Item 4" />
    </VerticalNav>
  );
}
```

_Expandable vertical nav:_

```tsx
import {
  ExpandableVerticalNav,
  VerticalNav,
} from "@easypost/easy-ui/VerticalNav";

function Sidebar() {
  const [expandedKeys, setExpandedKeys] = useState(["1"]);
  return (
    <ExpandableVerticalNav
      aria-label="Sidebar"
      selectedKeys={["1"]}
      expandedKeys={expandedKeys}
      onExpandedChange={(keys) => {
        setExpandedKeys(keys);
      }}
    >
      <VerticalNav.Item key="1" href="/item-1" icon={Symbol} label="Item 1" />
      <VerticalNav.Item key="2" href="/item-2" icon={Symbol} label="Item 2">
        <VerticalNav.Subnav selectedKeys={["2a"]}>
          <VerticalNav.Item key="2a" href="/subitem-1" label="Subitem 1">
            <VerticalNav.Subnav selectedKeys={["2a1"]}>
              <VerticalNav.Item key="2a1" href="/subitem-1a" label="Item 1" />
              <VerticalNav.Item key="2a2" href="/subitem-1b" label="Item 2" />
            </VerticalNav.Subnav>
          </VerticalNav.Item>
          <VerticalNav.Item key="2b" href="/subitem-2" label="Subitem 2" />
        </VerticalNav.Subnav>
      </VerticalNav.Item>
      <VerticalNav.Item key="3" href="/item-3" icon={Symbol} label="Item 3" />
      <VerticalNav.Item key="4" href="/item-4" icon={Symbol} label="Item 4" />
    </ExpandableVerticalNav>
  );
}
```

_Custom link component:_

```tsx
import Link from "next/link";
import { VerticalNav } from "@easypost/easy-ui/VerticalNav";

function Sidebar() {
  return (
    <VerticalNav aria-label="Sidebar" selectedKeys={["1"]}>
      <VerticalNav.Item key="1" as={Link} href="/1" icon={Symbol} label="1" />
      <VerticalNav.Item key="2" as={Link} href="/2" icon={Symbol} label="2" />
      <VerticalNav.Item key="3" as={Link} href="/4" icon={Symbol} label="4" />
      <VerticalNav.Item key="4" as={Link} href="/3" icon={Symbol} label="3" />
    </VerticalNav>
  );
}
```

---

## Behavior

### Accessibility

- `VerticalNav` items are links and should avoid being buttons or other clickable elements.
- `VerticalNav` should be labeled with `aria-label`.
