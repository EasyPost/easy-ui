# `VerticalNav` Component Specification

## Overview

`VerticalNav` renders a vertical list of navigation links.

### Prior Art

- [Primer `<NavList />`](https://primer.style/components/nav-list)
- [Paste `<SidebarNavigation />`](https://paste.twilio.design/components/sidebar-navigation)

---

## Design

`VerticalNav` will be a compound component consisting of `VerticalNav`, `VerticalNav.Item`, and `VerticalNav.Subnav`. A vertical list of links with expandable top-level items can be rendered with an `ExpandableVerticalNav`.

`VerticalNav` uses React Stately's `useListState` hook behind the scenes. This not only handles managing the selection of items but provides consistency with other Easy UI component APIs. `ExpandableVerticalNav` uses React Stately's `useTreeState` hook to support expansion.

`VerticalNav` can optionally render a logo at the top of the navigation with the `renderLogo` render prop. `VerticalNav` can optionally render a banner at the top of the navigation with the `renderBanner` render prop.

`VerticalNav` supports rendering a supplementary action at the bottom of the navigation container using the `supplementaryAction` prop and the `VerticalNav.SupplementaryAction` component. `VerticalNav.SupplementaryAction` is a polymorphic component allowing for a custom element through `as`.

`VerticalNav.Item` controls rendering individual links within a list. It contains props for the link's `label`, `icon`, and optionally a `children` prop to render nested subnavigation. Subnavigation within a `VerticalNav.Item` should use the `VerticalNav.Subnav` component.

`VerticalNav.Item` is a polymorphic component. By default, it renders as an anchor element—`<a>`—but it can be rendered as a custom element using the `as` prop. e.g. `<VerticalNav.Item as={NextLink} href="/account/settings" />`.

Selection and expansion is controlled by the consumer through the API provided by React Stately's `useListState` and `useTreeState` hooks—`selectedKey`, `expandedKeys`, and `onExpandedChange`.

The component API is flexible by design. Constraints will be enforced at runtime to meet certain design requirements—e.g. limiting the levels of sub navigation.

### API

```ts
type BaseVerticalNavProps = AriaLabelingProps & {
  children: ReactNode;
  renderBanner?: () => ReactNode;
  renderLogo?: () => ReactNode;
  supplementaryAction?: ReactNode;
};

type VerticalNavProps = BaseVerticalNavProps & {
  selectedKey?: Key;
};

type ExpandableVerticalNavProps = BaseVerticalNavProps & {
  selectedKey?: Key;
  defaultExpandedKeys?: Key[];
  expandedKeys?: Key[];
  onExpandedChange?: (keys: Key[]) => void;
};

type VerticalNavItemProps<T extends ElementType = "a"> = ComponentProps<T> & {
  as?: T;
  label: string;
  icon?: IconSymbol;
  children?: ReactNode;
};

type VerticalNavSubnavProps = {
  selectedKey?: Key;
};

type VerticalNavSupplementaryAction<T extends ElementType = "button"> =
  ComponentProps<T> & {
    as?: T;
    children: ReactNode;
  };
```

### Example Usage

_Simple vertical nav:_

```tsx
import { VerticalNav } from "@easypost/easy-ui/VerticalNav";

function Sidebar() {
  return (
    <VerticalNav aria-label="Sidebar" selectedKey="1">
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
    <VerticalNav aria-label="Sidebar" selectedKey="1">
      <VerticalNav.Item key="1" href="/item-1" icon={Symbol} label="Item 1" />
      <VerticalNav.Item key="2" href="/item-2" icon={Symbol} label="Item 2">
        <VerticalNav.Subnav selectedKey="2a">
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
      selectedKey="1"
      expandedKeys={expandedKeys}
      onExpandedChange={(keys) => {
        setExpandedKeys(keys);
      }}
    >
      <VerticalNav.Item key="1" href="/item-1" icon={Symbol} label="Item 1" />
      <VerticalNav.Item key="2" href="/item-2" icon={Symbol} label="Item 2">
        <VerticalNav.Subnav selectedKey="2a">
          <VerticalNav.Item key="2a" href="/subitem-1" label="Subitem 1">
            <VerticalNav.Subnav selectedKey="2a1">
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
    <VerticalNav aria-label="Sidebar" selectedKey="1">
      <VerticalNav.Item key="1" as={Link} href="/1" icon={Symbol} label="1" />
      <VerticalNav.Item key="2" as={Link} href="/2" icon={Symbol} label="2" />
      <VerticalNav.Item key="3" as={Link} href="/4" icon={Symbol} label="4" />
      <VerticalNav.Item key="4" as={Link} href="/3" icon={Symbol} label="3" />
    </VerticalNav>
  );
}
```

_Rendering a logo:_

```tsx
import { VerticalNav } from "@easypost/easy-ui/VerticalNav";

function Sidebar() {
  return (
    <VerticalNav
      aria-label="Sidebar"
      selectedKey="1"
      renderLogo={() => <EasyPostLogo />}
    >
      <VerticalNav.Item key="1" href="/item-1" icon={Symbol} label="Item 1" />
      <VerticalNav.Item key="2" href="/item-2" icon={Symbol} label="Item 2" />
      <VerticalNav.Item key="3" href="/item-3" icon={Symbol} label="Item 3" />
      <VerticalNav.Item key="4" href="/item-4" icon={Symbol} label="Item 4" />
    </VerticalNav>
  );
}
```

_Rendering a banner:_

```tsx
import { VerticalNav } from "@easypost/easy-ui/VerticalNav";

function Sidebar() {
  return (
    <VerticalNav
      aria-label="Sidebar"
      renderBanner={() => <NavBanner />}
      selectedKey="1"
    >
      <VerticalNav.Item key="1" href="/item-1" icon={Symbol} label="Item 1" />
      <VerticalNav.Item key="2" href="/item-2" icon={Symbol} label="Item 2" />
      <VerticalNav.Item key="3" href="/item-3" icon={Symbol} label="Item 3" />
      <VerticalNav.Item key="4" href="/item-4" icon={Symbol} label="Item 4" />
    </VerticalNav>
  );
}
```

_Rendering a supplementary action:_

```tsx
import { VerticalNav } from "@easypost/easy-ui/VerticalNav";

function Sidebar() {
  return (
    <VerticalNav
      aria-label="Sidebar"
      selectedKey="1"
      supplementaryAction={
        <VerticalNav.SupplementaryAction onClick={() => {}}>
          Optional Bottom
        </VerticalNav.SupplementaryAction>
      }
    >
      <VerticalNav.Item key="1" href="/item-1" icon={Symbol} label="Item 1" />
      <VerticalNav.Item key="2" href="/item-2" icon={Symbol} label="Item 2" />
      <VerticalNav.Item key="3" href="/item-3" icon={Symbol} label="Item 3" />
      <VerticalNav.Item key="4" href="/item-4" icon={Symbol} label="Item 4" />
    </VerticalNav>
  );
}
```

---

## Behavior

### Accessibility

- `VerticalNav` will be rendered as a `nav` element.
- `VerticalNav` should be labeled with `aria-label`.
- `VerticalNav.Item`s are links and should avoid being buttons or other clickable elements.
