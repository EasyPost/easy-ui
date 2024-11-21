# `Drawer` Component Specification

## Overview

A `Drawer` is a modal that stays on the side of the screen.

### Use Cases

- Use a `<Drawer />` when you want to capture information from the user as a part of a concentrated workflow without having them leave the parent page.
- Use a `<Drawer />` when you want to show additional complex information to the user without losing context of the parent page.

### Features

- Supports composability with a container, header, and body components
- Supports self-contained state management by default
- Supports being controlled
- Supports default state
- Supports being nondismissable

### Prior Art

- [Paste `<SideModal />`](https://paste.twilio.design/components/side-modal)
- [Aria `<Dialog />`](https://react-spectrum.adobe.com/react-aria/Dialog.html)

---

## Design

`Drawer` will use `useDialog` and `useModalOverlay` from `react-aria` to provide the foundation for an accessible dialog.

The component design was inspired by Aria's Dialog component and Twilio's SideModal component.

`Drawer` will manage its own state by default but can be controlled if the consumer opts in.

`Drawer` will be a compound component consistenting of `Drawer`, `Drawer.Header`, and `Drawer.Body`.

While the above components allow for any design, `Drawer` includes `Drawer.Banner`, `Drawer.BanneredContentArea`, `Drawer.StandaloneContentArea`, and `Drawer.CloseButton` for using preset Drawer patterns.

`Drawer` should be attached to a focusable trigger element such as a `Button` through the `Drawer.Trigger` component. This ensures the trigger and modal are accessible. In the event that a focusable element can't be used, `DrawerContainer` can be used for custom triggering.

`Drawer.Trigger` must contain exactly two direct children. The first child must be a focusable trigger such as `Button`. The second child must be either a `Drawer` or a render function that returns a `Drawer`. If using a render function, a `close` argument will be passed to allow for programmatically closing the `Drawer`. This pattern is adopted from the suggested patterns of React Aria and React Spectrum.

`Drawer` will use React CSS Transition Group to slide the dialog in and out of the screen.

### API

```ts
type DrawerTriggerProps = {
  /**
   * Content of drawer trigger. Must be exactly two elements.
   */
  children: [ReactElement, CloseableModalElement | ReactElement];

  /**
   * Whether the drawer is open by default (uncontrolled).
   */
  defaultOpen?: boolean;

  /**
   * Whether or not the drawer can be dismissed.
   */
  isDismissable?: boolean;

  /**
   * Whether the drawer is open by default (controlled).
   */
  isOpen?: boolean;

  /**
   * Handler that is called when the overlay's open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
};

type DrawerProps = {
  /**
   * Content of the drawer.
   */
  children: ReactNode;
};

type DrawerHeaderProps = {
  /**
   * Drawer header content.
   */
  children: string;
};

type DrawerBannerProps = {
  /**
   * Drawer header banner content.
   */
  children: ReactNode;
};

type DrawerBodyProps = {
  /**
   * Drawer body content.
   * This provides a scrollable region without any predefined padding.
   */
  children: ReactNode;
};

type DrawerBanneredContentAreaProps = {
  /**
   * Content area for a drawer with a banner.
   */
  children: ReactNode;
};

type DrawerStandaloneContentAreaProps = {
  /**
   * Content area for a drawer without a banner (standalone).
   */
  children: ReactNode;
};

/**
 * Close button for the drawer. Connected to Drawer state.
 */
type DrawerCloseButtonProps = {};

/**
 * Title for the drawer. Uses aria-labelledby to attach to the dialog.
 */
type DrawerTitleProps = TextProps;
```

### Example Usage

_Standalone_:

```tsx
import { Drawer } from "@easypost/easy-ui/Drawer";

function PageWithDrawer() {
  return (
    <Drawer.Trigger onOpenChange={action("Drawer open state changed!")}>
      <Button>Open drawer</Button>
      <Drawer>
        <Drawer.Body>
          <Drawer.StandaloneContentArea>
            <VerticalStack gap="2">
              <Drawer.Title>Title</Drawer.Title>
              <div>Content</div>
            </VerticalStack>
          </Drawer.StandaloneContentArea>
        </Drawer.StandaloneBody>
      </Drawer>
    </Drawer.Trigger>
  );
}
```

_Bannered with Tabs_:

```tsx
import { Drawer } from "@easypost/easy-ui/Drawer";

function PageWithDrawer() {
  return (
    <Drawer.Trigger onOpenChange={action("Modal open state changed!")}>
      <Button>Open drawer</Button>
      {() => (
        <TabPanels>
          <Drawer>
            <Drawer.Header>
              <Drawer.Banner>
                <HorizontalStack align="space-between" blockAlign="center">
                  <Drawer.Title variant="heading3">Title</Drawer.Title>
                  <Drawer.CloseButton />
                </HorizontalStack>
              </Drawer.Banner>
              <TabPanels.Tabs>
                <TabPanels.Item key="for">Tab 1</TabPanels.Item>
                <TabPanels.Item key="mar">Tab 2</TabPanels.Item>
              </TabPanels.Tabs>
            </Drawer.Header>
            <Drawer.Body>
              <Drawer.BanneredContentArea>
                <TabPanels.Panels>
                  <TabPanels.Item key="for">Tab 1</TabPanels.Item>
                  <TabPanels.Item key="mar">Tab 2</TabPanels.Item>
                </TabPanels.Panels>
              </Drawer.BanneredContentArea>
            </Drawer.Body>
          </Drawer>
        </TabPanels>
      )}
    </Drawer.Trigger>
  );
}
```

---

## Behavior

### Accessibility

- All elements required to interact with the drawer, including closing or acknowledging it, are contained in the drawer since they trap focus, and users can't interact with the underlying page.
- Tabbing through a Drawer will cycle through its content in the same way it does on a page. A Drawer also supports pressing the Escape key to close the Drawer.
- The element that serves as the drawer container has a role of dialog.
- The Drawer must be labelled by Drawer.Title.

### Dependencies

- `useDialog`, `useModalOverlay` from `react-aria`
- `IntersectionObserver` for styling when header and footer are stuck, as denoted here: https://ryanmulligan.dev/blog/sticky-header-scroll-shadow/
- `ReactTransitionGroup` for slide in/out animations: https://reactcommunity.org/react-transition-group/
