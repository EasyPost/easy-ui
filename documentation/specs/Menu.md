# `Menu` Component Specification

## Overview

A `Menu` presents a list of items that a user can choose to perform an action with through a trigger element. A menu item can be used to perform an action or a page navigation. Each menu item can only perform a single action.

### Use Cases

- Used by buttons and dropdowns to present the user with a list of choices

### Features

- Separators
- Static or dynamic width
- Max height of 5 options before scroll
- Default, hover, no results, and separator menu item variations

### Risks and Challenges

- Ensuring popovers don't get cut off within hidden containers
- Ensuring accessibility is handled correctly, which is largely mitigated by using React Aria
- Keeping the API simple while needing to be aware of inner element `ref`s and needing to pass `prop`s to inner components
- Dynamic widths
- Ensuring height can be contained properly and scroll works accessibly with Aria

### Prior Art

Most component libraries seem to congregate around the name `Menu` for this component, but some qualify it with a narrower name to allow for a `Menu` to represent something else. This is the case for Github's component library, for instance, where they use `ActionMenu` to represent this concept and `Menu` to represent another kind of menu in their design system.

- [Aria `<Menu />`](https://react-spectrum.adobe.com/react-aria/Menu.html)
- [MUI `<Menu />`](https://mui.com/material-ui/react-menu/)
- [Primer `<ActionMenu />`](https://primer.style/view-components/components/alpha/actionmenu)
- [Paste `<Menu />`](https://paste.twilio.design/components/menu)

---

## Design

### API

The component builds off of the React Aria `useMenu` primitives and therefore the API is modeled after the intended `Menu` Aria paradigm.

```ts
// Same type definition from @react-aria/Placement
// prettier-ignore
type Placement = 'bottom' | 'bottom left' | 'bottom right' | 'bottom start' | 'bottom end' |
    'top' | 'top left' | 'top right' | 'top start' | 'top end' |
    'left' | 'left top' | 'left bottom' | 'start' | 'start top' | 'start bottom' |
    'right' | 'right top' | 'right bottom' | 'end' | 'end top' | 'end bottom';

type Menu = {
  /** The trigger and menu to render. */
  children: ReactNode;

  /** Whether the overlay is open by default (uncontrolled). */
  defaultOpen?: boolean;

  /** Whether the tooltip should be disabled, independent from the trigger. */
  isDisabled?: boolean;

  /** Whether the overlay is open by default (controlled). */
  isOpen?: boolean;

  /** Handler that is called when the overlay's open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
};

type MenuTrigger = {
  /** The element that will activate the menu. */
  children: ReactElement;
};

export type MenuOverlayWidth =
  | "auto"
  | "fit-content"
  | "fit-trigger"
  | ResponsiveProp<string | number>;

type MenuOverlay = {
  /** The contents of the menu. */
  children: CollectionChildren<T>;

  /** The item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with. */
  disabledKeys?: Iterable<Key>;

  /** Number of menu items to show before menu scrolls. */
  maxItemsUntilScroll?: number;

  /** Handler that is called when an item is selected. */
  onAction?: (key: Key) => void;

  /** Handler that is called when the menu should close after selecting an item. */
  onClose?: () => void;

  /**
   * The placement of the element with respect to its anchor element.
   * @default bottom
   */
  placement?: Placement;

  /**
   * The width of the menu overlay.
   * @default auto
   */
  width?: MenuOverlayWidth;
};

type MenuSectionProps = {
  /** Rendered contents of the item or child items. */
  children: ReactNode;

  /** An accessibility label for the section. */
  "aria-label"?: string;
};

type MenuItemProps = {
  /** An accessibility label for the item. */
  "aria-label"?: string;

  /** Rendered contents of the item or child items. */
  children: ReactNode;

  /**
   * Whether the menu should close when the menu item is selected.
   * @default true
   */
  closeOnSelect?: boolean;

  /** A URL to link to if the menu item should be a link. */
  href?: string;

  /**
   * If `href` is provided, a custom component to render for the link. Useful for
   * framework link components like next/link.
   * @default "a"
   */
  hrefComponent?: ElementType;

  /** If `href` is provided, the relationship between the linked resource and the current page. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). */
  rel?: string;

  /** If `href` is provided, the target window for the link. */
  target?: string;
};
```

### Example Usage

_Static collection:_

A separator will be rendered between sections.

```tsx
import { Menu } from "@easypost/easy-ui/Menu";

function Component() {
  return (
    <Menu>
      <Menu.Trigger>
        <Button>Actions</Button>
      </Menu.Trigger>
      <Menu.List onAction={(key) => {}}>
        <Menu.Section>
          <Menu.Item key="edit">Edit</Menu.Item>
          <Menu.Item key="duplicate">Duplicate</Menu.Item>
        </Menu.Section>
        <Menu.Section>
          <Menu.Item key="copy">Copy</Menu.Item>
          <Menu.Item key="cut">Cut</Menu.Item>
          <Menu.Item key="paste">Paste</Menu.Item>
        </Menu.Section>
      </Menu.List>
    </Menu>
  );
}
```

_Custom placement:_

```tsx
import { Menu } from "@easypost/easy-ui/Menu";

function Component() {
  return (
    <Menu>
      <Menu.Trigger>
        <Button>Actions</Button>
      </Menu.Trigger>
      <Menu.List onAction={(key) => {}} placement="bottom left">
        <Menu.Item key="edit">Edit</Menu.Item>
        <Menu.Item key="duplicate">Duplicate</Menu.Item>
      </Menu.List>
    </Menu>
  );
}
```

_Controlled:_

```tsx
import { Menu } from "@easypost/easy-ui/Menu";

function Component() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Menu isOpen={isOpen} onOpenChange={setIsOpen}>
      <Menu.Trigger>
        <Button>Actions</Button>
      </Menu.Trigger>
      <Menu.List onAction={(key) => {}}>
        <Menu.Item key="edit">Edit</Menu.Item>
        <Menu.Item key="duplicate">Duplicate</Menu.Item>
      </Menu.List>
    </Menu>
  );
}
```

_Open by default:_

```tsx
import { Menu } from "@easypost/easy-ui/Menu";

function Component() {
  return (
    <Menu defaultOpen={true}>
      <Menu.Trigger>
        <Button>Actions</Button>
      </Menu.Trigger>
      <Menu.List onAction={(key) => {}}>
        <Menu.Item key="edit">Edit</Menu.Item>
        <Menu.Item key="duplicate">Duplicate</Menu.Item>
      </Menu.List>
    </Menu>
  );
}
```

_Disabled independent of trigger:_

```tsx
import { Menu } from "@easypost/easy-ui/Menu";

function Component() {
  return (
    <Menu isDisabled={true}>
      <Menu.Trigger>
        <Button>Actions</Button>
      </Menu.Trigger>
      <Menu.List onAction={(key) => {}}>
        <Menu.Item key="edit">Edit</Menu.Item>
        <Menu.Item key="duplicate">Duplicate</Menu.Item>
      </Menu.List>
    </Menu>
  );
}
```

_Trigger function on close:_

```tsx
import { Menu } from "@easypost/easy-ui/Menu";

function Component() {
  return (
    <Menu isDisabled={true}>
      <Menu.Trigger>
        <Button>Actions</Button>
      </Menu.Trigger>
      <Menu.List onClose={() => {}}>
        <Menu.Item key="edit">Edit</Menu.Item>
        <Menu.Item key="duplicate">Duplicate</Menu.Item>
      </Menu.List>
    </Menu>
  );
}
```

_Mixed item types:_

Menu items support being links and disabling closing on select and being disabled.

```tsx
import { Menu } from "@easypost/easy-ui/Menu";

function Component() {
  return (
    <Menu isDisabled={true}>
      <Menu.Trigger>
        <Button>Actions</Button>
      </Menu.Trigger>
      <Menu.List onAction={(key) => {}} disabledKeys={["disabled"]}>
        <Menu.Item key="disabled">I'm disabled</Menu.Item>
        <Menu.Item key="link" href="https://easypost.com" target="_blank">
          I'm a link
        </Menu.Item>
        <Menu.Item key="close" closeOnSelect={false}>
          I won't be closed on select
        </Menu.Item>
      </Menu.List>
    </Menu>
  );
}
```

### Anatomy

Component design uses Aria primitives across several underlying components that are rolled up into a single exposed `Menu` component.

```tsx
function Menu(props) {
  const triggerRef = React.useRef(null);
  const menuTriggerState = useMenuTriggerState();
  const { menuTriggerProps, menuProps } = useMenuTrigger();
  const context = useMemo(() => {
    return { triggerRef, menuTriggerProps, menuTriggerState, menuProps };
  }, [menuTriggerProps, menuProps, menuTriggerState]);
  return (
    <MenuContext.Provider value={context}>
      {props.children}
    </MenuContext.Provider>
  );
}

function Trigger({ children }: { children: ReactElement }) {
  const { triggerRef, menuTriggerProps } = useMenu();
  return React.cloneElement(children, {
    ...menuTriggerProps,
    buttonRef: triggerRef,
  });
}

function MenuOverlayToggler(props) {
  const { menuTriggerState } = useMenu();
  if (!menuTriggerState.isOpen) {
    return null;
  }
  return <MenuOverlay {...props} />;
}

function MenuOverlay(props) {
  const popoverRef = React.useRef();
  const menuRef = React.useRef();
  const menuTreeState = useTreeState();
  const { menuTriggerState, triggerRef, menuProps } = useMenu();
  const { popoverProps, underlayProps } = usePopover();
  const { menuProps: innerMenuProps } = useMenu();
  return (
    <OverlayContainer>
      <div data-underlay />
      <div data-popover>
        <div data-container style={{ maxHeight: "5 rows", scroll }}>
          <DismissButton onDismiss={menuTriggerState.close} />
          <ul data-outer-list>
            {[...menuTreeState.collection].map((item) => {
              return item.type === "section" ? <MenuSection /> : <MenuItem />;
            })}
          </ul>
          <DismissButton onDismiss={menuTriggerState.close} />
        </div>
      </div>
    </OverlayContainer>
  );
}

function MenuItem({ item, state }) {
  const ref = React.useRef(null);
  const { menuItemProps, isFocused, isSelected, isDisabled } = useMenuItem();
  return <li data-menu-item>{item.rendered}</li>;
}

function MenuSection({ section, state }) {
  const { itemProps, headingProps, groupProps } = useMenuSection();
  const { separatorProps } = useSeparator();
  return (
    <>
      {section.key !== state.collection.getFirstKey() && <li data-separator />}
      <li data-section-instance>
        <ul data-item-list>
          {[...section.childNodes].map((node) => (
            <MenuItem />
          ))}
        </ul>
      </li>
    </>
  );
}

Menu.Trigger = Trigger;
Menu.Overlay = MenuOverlayToggler;
Menu.Item = Item;
Menu.Section = Section;
```

---

## Behavior

### Accessibility

Multiple actions must not be placed within a menu item. They will not be keyboard accessible.

When the user is focused on a menu trigger, the following keyboard interactions apply:

- Enter and space open the menu and select the current menu item
- Up and down arrows move the user between the menu items
- Disabled menu items, separators, and group labels are never focused

Most accessibility issues will be handled with React Aria.

## Dependencies

- `react-aria`—`DismissButton`, `OverlayContainer`, `mergeProps`, `useMenu`, `useMenuItem`, `useMenuTrigger`, `usePopover`, `useMenuSection`, `useSeparator`
- `react-stately`—`useMenuTriggerState`, `useMenuTriggerState`, `MenuTriggerState`, `useTreeState`, `Item`, `Section`, `Node`, `TreeState`
- `@react-aria/utils`—`mergeRefs`
