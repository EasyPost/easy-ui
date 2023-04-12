# `PopupMenu` Component Specification

## Overview

A `PopupMenu` presents a list of menu items that a user can choose to perform an action with through a trigger element. This component includes a menu comprising of menu items that are shown upon actioning the trigger. A menu item can be used to perform an action or a page navigation. Each menu item can only perform a single action.

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

type PopupMenu = {
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

type PopupMenuTrigger = {
  /** The element that will activate the menu. */
  children: ReactElement;
};

type PopupMenuMenu = {
  /** The menu sections and items to render. */
  children: ReactNode;

  /** The item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with. */
  disabledKeys?: Iterable<Key>;

  /** Item objects in dynamic collections. */
  items?: Iterable<T>;

  /** Handler that is called when an item is selected. */
  onAction?: (key: Key) => void;

  /** Handler that is called when the menu should close after selecting an item. */
  onClose?: () => void;

  /**
   * The placement of the element with respect to its anchor element.
   * @default 'top'
   */
  placement?: Placement;
};

// Same subset of type definition from @react-stately/Section
type PopupMenuSection = {
  /** An accessibility label for the section. */
  "aria-label"?: string;

  /** Static child items or a function to render children. */
  children: ItemElement<T> | ItemElement<T>[] | ItemRenderer<T>;

  /** Item objects in the section. */
  items?: Iterable<T>;
};

// Same subset of type definition from @react-stately/Item
type PopupMenuItem = {
  /** Rendered contents of the item or child items. */
  children: ReactNode;
};
```

### Example Usage

_Static collection:_

A separator will be rendered between sections.

```tsx
import { PopupMenu } from "@easypost/easy-ui/PopupMenu";

function Component() {
  return (
    <PopupMenu>
      <PopupMenu.Trigger>
        <Button>Actions</Button>
      </PopupMenu.Trigger>
      <PopupMenu.Menu onAction={(key) => {}}>
        <PopupMenu.Section>
          <PopupMenu.Item key="edit">Edit</PopupMenu.Item>
          <PopupMenu.Item key="duplicate">Duplicate</PopupMenu.Item>
        </PopupMenu.Section>
        <PopupMenu.Section>
          <PopupMenu.Item key="copy">Copy</PopupMenu.Item>
          <PopupMenu.Item key="cut">Cut</PopupMenu.Item>
          <PopupMenu.Item key="paste">Paste</PopupMenu.Item>
        </PopupMenu.Section>
      </PopupMenu.Menu>
    </PopupMenu>
  );
}
```

_Dynamic collection:_

This uses the [React Aria paradigm](https://react-spectrum.adobe.com/react-stately/collections.html#sections-1) for working with dynamic collections. It optimizes for subsequent renders so is more important than using a standard static collection.

```tsx
import { PopupMenu } from "@easypost/easy-ui/PopupMenu";

function Component() {
  let [sections, setSections] = useState([
    {
      name: "People",
      items: [{ name: "David" }, { name: "Same" }, { name: "Jane" }],
    },
    {
      name: "Animals",
      items: [{ name: "Aardvark" }, { name: "Kangaroo" }, { name: "Snake" }],
    },
  ]);
  return (
    <PopupMenu>
      <PopupMenu.Trigger>
        <Button>Actions</Button>
      </PopupMenu.Trigger>
      <PopupMenu.Menu onAction={(key) => {}} items={sections}>
        {(section) => (
          <Section key={section.name} items={section.items}>
            {(item) => <Item key={item.name}>{item.name}</Item>}
          </Section>
        )}
      </PopupMenu.Menu>
    </PopupMenu>
  );
}
```

_Custom placement:_

```tsx
import { PopupMenu } from "@easypost/easy-ui/PopupMenu";

function Component() {
  return (
    <PopupMenu>
      <PopupMenu.Trigger>
        <Button>Actions</Button>
      </PopupMenu.Trigger>
      <PopupMenu.Menu onAction={(key) => {}} placement="bottom center">
        <PopupMenu.Item key="edit">Edit</PopupMenu.Item>
        <PopupMenu.Item key="duplicate">Duplicate</PopupMenu.Item>
      </PopupMenu.Menu>
    </PopupMenu>
  );
}
```

_Controlled:_

```tsx
import { PopupMenu } from "@easypost/easy-ui/PopupMenu";

function Component() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <PopupMenu isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopupMenu.Trigger>
        <Button>Actions</Button>
      </PopupMenu.Trigger>
      <PopupMenu.Menu onAction={(key) => {}}>
        <PopupMenu.Item key="edit">Edit</PopupMenu.Item>
        <PopupMenu.Item key="duplicate">Duplicate</PopupMenu.Item>
      </PopupMenu.Menu>
    </PopupMenu>
  );
}
```

_Open by default:_

```tsx
import { PopupMenu } from "@easypost/easy-ui/PopupMenu";

function Component() {
  return (
    <PopupMenu defaultOpen={true}>
      <PopupMenu.Trigger>
        <Button>Actions</Button>
      </PopupMenu.Trigger>
      <PopupMenu.Menu onAction={(key) => {}}>
        <PopupMenu.Item key="edit">Edit</PopupMenu.Item>
        <PopupMenu.Item key="duplicate">Duplicate</PopupMenu.Item>
      </PopupMenu.Menu>
    </PopupMenu>
  );
}
```

_Disabled independent of trigger:_

```tsx
import { PopupMenu } from "@easypost/easy-ui/PopupMenu";

function Component() {
  return (
    <PopupMenu isDisabled={true}>
      <PopupMenu.Trigger>
        <Button>Actions</Button>
      </PopupMenu.Trigger>
      <PopupMenu.Menu onAction={(key) => {}}>
        <PopupMenu.Item key="edit">Edit</PopupMenu.Item>
        <PopupMenu.Item key="duplicate">Duplicate</PopupMenu.Item>
      </PopupMenu.Menu>
    </PopupMenu>
  );
}
```

_Trigger function on close:_

```tsx
import { PopupMenu } from "@easypost/easy-ui/PopupMenu";

function Component() {
  return (
    <PopupMenu isDisabled={true}>
      <PopupMenu.Trigger>
        <Button>Actions</Button>
      </PopupMenu.Trigger>
      <PopupMenu.Menu onClose={() => {}}>
        <PopupMenu.Item key="edit">Edit</PopupMenu.Item>
        <PopupMenu.Item key="duplicate">Duplicate</PopupMenu.Item>
      </PopupMenu.Menu>
    </PopupMenu>
  );
}
```

### Anatomy

Component design uses Aria primitives across several underlying components that are rolled up into a single exposed `PopupMenu` component.

```tsx
function PopupMenu(props) {
  const triggerRef = React.useRef(null);
  const menuTriggerState = useMenuTriggerState();
  const { menuTriggerProps, menuProps } = useMenuTrigger();
  const context = useMemo(() => {
    return { triggerRef, menuTriggerProps, menuTriggerState, menuProps };
  }, [menuTriggerProps, menuProps, menuTriggerState]);
  return (
    <PopupMenuContext.Provider value={context}>
      {props.children}
    </PopupMenuContext.Provider>
  );
}

function Trigger({ children }: { children: ReactElement }) {
  const { triggerRef, menuTriggerProps } = usePopupMenu();
  return React.cloneElement(children, {
    ...menuTriggerProps,
    buttonRef: triggerRef,
  });
}

function MenuOuter(props) {
  const { menuTriggerState } = usePopupMenu();
  if (!menuTriggerState.isOpen) {
    return null;
  }
  return <MenuInner {...props} />;
}

function MenuInner(props) {
  const popoverRef = React.useRef();
  const menuRef = React.useRef();
  const menuTreeState = useTreeState();
  const { menuTriggerState, triggerRef, menuProps } = usePopupMenu();
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

PopupMenu.Trigger = Trigger;
PopupMenu.Menu = MenuOuter;
PopupMenu.Item = Item;
PopupMenu.Section = Section;
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
