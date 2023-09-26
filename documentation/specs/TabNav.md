# `TabNav` Component Specification

## Overview

A `TabNav` is a set of styled links that lets users navigate between related pages.

---

## Design

`TabNav` is a compound component consisting of `TabNav` and `TabNav.Item`. Use `TabNav` to create the navigation container. Use `TabNav.Item` to create individual links. `TabNav.Item` supports polymorphism through the `as` prop, allowing for client-side routing.

`TabNav` does not use React Aria's `useTabList` hook, which implements the W3C ARIA Tabs pattern. `TabNav` uses a `nav` element under the hood with anchor links as discrete tab stops. W3C ARIA Tabs pattern is reserved for tabbing through content within the same immediate context and URL.

### API

```ts
type TabNavProps = AriaLabelingProps & {
  /** The children of the <TabNav> element. Should include <TabNav.Item> elements. */
  children: ReactNode;
};

type TabNavItemProps<T extends ElementType = "a"> = ComponentProps<T> & {
  /** Override the default element with a custom one to provide unique behavior. Useful for client-side navigation link components in app frameworks. */
  as?: T;

  /** The children of the <TabNav.Item> element. */
  children: ReactNode;

  /** Sets the <TavNav.Item> as the current page and adds `aria-current="page"`. */
  isCurrentPage?: boolean;
};
```

### Example Usage

_Basic usage_:

```tsx
import { TabNav } from "@easypost/easy-ui/TabNav";

function AccountTabNav() {
  return (
    <TabNav aria-label="Account">
      <TabNav.Item href="/account/carriers" isCurrentPage>
        Carriers
      </TabNav.Item>
      <TabNav.Item href="/account/users">Users</TabNav.Item>
      <TabNav.Item href="/account/keys">API Keys</TabNav.Item>
    </TabNav>
  );
}
```

_Custom link element_:

```tsx
import { TabNav } from "@easypost/easy-ui/TabNav";
import Link from "next/link";

function AccountTabNav() {
  return (
    <TabNav aria-label="Account">
      <TabNav.Item as={Link} href="/account/carriers" isCurrentPage>
        Carriers
      </TabNav.Item>
      <TabNav.Item as={Link} href="/account/users">
        Users
      </TabNav.Item>
      <TabNav.Item as={Link} href="/account/keys">
        API Keys
      </TabNav.Item>
    </TabNav>
  );
}
```

---

## Behavior

### Accessibility

- Each `TabNav` should have a unique label. To add the label, add the `aria-label` prop to the `<TabNav>` tag. Omit the term 'navigation'- it is redundant since the role is already defined as 'navigation'.
- To interact with `TabNav` using the keyboard, use the `tab` key.
- Each `TabNav` must have a `TabNav.Item` which is the currently selected page. To specify which page is current, add the `isCurrentPage` prop to the respective `<TabNav.Item>`. Doing so will set `aria-current="page"` on that link.
- `TabNav` uses a `nav` element under the hood with anchor links as discrete tab stops. `TabNav` does not use the W3C ARIA Tabs pattern.
