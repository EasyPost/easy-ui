# `Modal` Component Specification

## Overview

A `Modal` is a page overlay that displays information and blocks interaction with the page until an action is taken or the `Modal` is dismissed.

### Use Cases

A Modal is a dialog that appears over content and requires some kind of user interaction. Modals are typically used to focus a user's attention.

- Use a `<Modal />` when you want to capture information from the user without having them leave the parent page.
- Use a `<Modal />` when you want to show additional information to the user without losing context of the parent page.

### Features

- Supports composability with a container, header, body, and footer components
- Supports a fully custom header and footer via `children` slots
- Supports self-contained state management by default
- Supports being controlled
- Supports default state
- Supports being nondismissable
- Supports multiple sizes

### Prior Art

- [Aria `<Dialog />`](https://react-spectrum.adobe.com/react-aria/Dialog.html)
- [Paste `<Modal />`](https://paste.twilio.design/components/modal)
- [Polaris `<Modal />`](https://polaris.shopify.com/components/overlays/modal)
- [Material UI `<Modal />`](https://mui.com/material-ui/react-modal/)

---

## Design

`Modal` will use `useDialog` and `useModalOverlay` from `react-aria` to provide the technical foundation for an accessible dialog.

The component design was inspired by Aria's Dialog component, Shopify's Modal component, and Twilio's Modal component.

`Modal` will manage its own state by default but can be controlled if the consumer opts in.

`Modal` will be a compound component consistenting of `Modal`, `Modal.Header`, `Modal.Body`, and `Modal.Footer`, plus `Modal.Title` and `Modal.CloseButton` for composing a custom header.

`Modal` must be attached to a focusable trigger element such as a `Button` through the `Modal.Trigger` component. This ensures the trigger and modal are accessible.

`Modal.Trigger` must contain exactly two direct children. The first child must be a focusable trigger such as `Button`. The second child must be either a `Modal` or a render function that returns a `Modal`. If using a render function, a `close` argument will be passed to allow for programmatically closing the `Modal`. This pattern is adopted from the suggested patterns of React Aria and React Spectrum.

### API

```ts
type ModalTriggerProps = {
  /**
   * Content of modal trigger. Must be exactly two elements.
   */
  children: [ReactElement, CloseableModalElement | ReactElement];

  /**
   * Whether the modal is open by default (uncontrolled).
   */
  defaultOpen?: boolean;

  /**
   * Whether or not the modal can be dismissed.
   */
  isDismissable?: boolean;

  /**
   * Whether the modal is open by default (controlled).
   */
  isOpen?: boolean;

  /**
   * Handler that is called when the overlay's open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
};

type ModalProps = {
  /**
   * Content of the modal.
   */
  children: ReactNode;

  /**
   * Size of the modal.
   *
   * @default lg
   */
  size?: "sm" | "md" | "lg" | "xl";
};

// New flexible slot API - preferred method
type ModalHeaderCustomProps = {
  /**
   * Renders `children` as-is, letting the consumer own the header's layout.
   * Compose with `<Modal.Title />`, which carries the modal's accessible name,
   * and `<Modal.CloseButton />`.
   */
  layout: "custom";

  /**
   * The content for the modal header.
   */
  children: ReactNode;
};

// Existing constrained API - for backwards compatibility
type ModalHeaderTitleProps = {
  /**
   * How the header composes its content. `title` renders `children` as the
   * modal's heading; `custom` renders `children` as-is.
   *
   * @default title
   */
  layout?: "title";

  /**
   * Modal header element type. Should be a valid document heading level.
   *
   * @default h2
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  /**
   * The content for the title of the modal.
   */
  children: ReactNode;

  /**
   * The content for the subtitle of the modal.
   */
  subtitle?: ReactNode;

  /**
   * Icon to display at the start of the header title.
   */
  iconAtStart?: {
    accessibilityLabel?: string;
    symbol: IconSymbol;
  };

  /**
   * Icon to display at the end of the header title.
   */
  iconAtEnd?: {
    accessibilityLabel?: string;
    symbol: IconSymbol;
    size?: "md" | "2xl";
  };
};

type ModalHeaderProps = ModalHeaderCustomProps | ModalHeaderTitleProps;

/**
 * Carries the modal's accessible name. For use within a custom
 * `<Modal.Header />`. Accepts the same props as `<Text />`, defaulting to a
 * truncating `h2` at `heading4`.
 */
type ModalTitleProps = TextProps;

type ModalBodyProps = {
  /**
   * Modal body content.
   */
  children: ReactNode;
};

// New flexible slot API - preferred method
type ModalFooterSlotProps = {
  /**
   * The content for the modal footer.
   */
  children: ReactNode;
};

// Existing constrained API - for backwards compatibility
type ModalFooterActionsProps = {
  /**
   * Primary action slot.
   */
  primaryAction: {
    color?: ButtonColor;
    content: string;
    onAction: () => void;
    isDisabled?: boolean;
  };

  /**
   * Secondary action slot.
   */
  secondaryAction?: {
    color?: ButtonColor;
    content: string;
    onAction: () => void;
    isDisabled?: boolean;
  };
};

type ModalFooterProps = ModalFooterSlotProps | ModalFooterActionsProps;
```

### Example Usage

_Simple_:

```tsx
import { Modal } from "@easypost/easy-ui/Modal";

function PageWithModal() {
  return (
    <Modal.Trigger>
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header layout="custom">
          <HorizontalStack align="space-between" blockAlign="center">
            <Modal.Title>H4 Title</Modal.Title>
            <Modal.CloseButton />
          </HorizontalStack>
        </Modal.Header>
        <Modal.Body>Modal content</Modal.Body>
        <Modal.Footer>
          <HorizontalStack align="end">
            <Button>Button 1</Button>
          </HorizontalStack>
        </Modal.Footer>
      </Modal>
    </Modal.Trigger>
  );
}
```

_Custom header_:

```tsx
import { Modal } from "@easypost/easy-ui/Modal";

function PageWithModal() {
  return (
    <Modal.Trigger>
      <Button>Open modal</Button>
      <Modal>
        {/* `Modal.Title` connects through context, so it works at any depth */}
        <Modal.Header layout="custom">
          <VerticalStack gap="1.5">
            <HorizontalStack align="space-between" blockAlign="center">
              <HorizontalStack gap="2" blockAlign="center">
                <Icon symbol={EasyPostLogo} size="lg" />
                <Modal.Title>H4 Title</Modal.Title>
                <Badge variant="success">New</Badge>
              </HorizontalStack>
              <Modal.CloseButton />
            </HorizontalStack>
            <Text variant="subtitle1">Optional subtitle</Text>
          </VerticalStack>
        </Modal.Header>
        <Modal.Body>Modal content</Modal.Body>
      </Modal>
    </Modal.Trigger>
  );
}
```

_Legacy title API_ (supported, but prefer `layout="custom"` for new work):

```tsx
import { Modal } from "@easypost/easy-ui/Modal";

function PageWithModal() {
  return (
    <Modal.Trigger onOpenChange={(openState) => {}} isDismissable={false}>
      <Button>Open modal</Button>
      {(close) => (
        <Modal size="md">
          <Modal.Header
            iconAtStart={{
              accessibilityLabel: "EasyPost Logo",
              symbol: EasyPostLogo,
            }}
            iconAtEnd={{
              accessibilityLabel: "Stripe Logo",
              symbol: StripeLogo,
              size: "2xl",
            }}
            subtitle="Optional subtitle"
          >
            H4 Title
          </Modal.Header>
          <Modal.Body>Modal content</Modal.Body>
          <Modal.Footer
            primaryAction={{
              content: "Button 1",
              onAction: () => {
                // do something. then close
                close();
              },
            }}
            secondaryAction={{
              content: "Optional Button 2",
              onAction: () => {
                close();
              },
            }}
          />
        </Modal>
      )}
    </Modal.Trigger>
  );
}
```

_Controlled_:

```tsx
import { Modal } from "@easypost/easy-ui/Modal";

function PageWithModal() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Modal.Trigger
      isOpen={isOpen}
      onOpenChange={(openState) => {
        setIsOpen(openState);
      }}
    >
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>H4 Title</Modal.Header>
        <Modal.Body>Modal content</Modal.Body>
        <Modal.Footer
          primaryAction={{
            content: "Button 1",
            onAction: () => {
              // do something. then close
              setIsOpen(false);
            },
          }}
        />
      </Modal>
    </Modal.Trigger>
  );
}
```

---

## Behavior

### Accessibility

- All elements required to interact with the modal, including closing or acknowledging it, are contained in the modal since they trap focus, and users can't interact with the underlying page.
- Tabbing through a Modal will cycle through its content in the same way it does on a page. A Modal also supports pressing the Escape key to close the Modal.
- The element that serves as the modal container has a role of dialog.
- The modal must be labelled by it's title.

### Dependencies

- `useDialog`, `useModalOverlay` from `react-aria`
- `IntersectionObserver` for styling when header and footer are stuck, as denoted here: https://ryanmulligan.dev/blog/sticky-header-scroll-shadow/

---

## Versions

| Version    | Owner           | Change                                              |
| :--------- | :-------------- | :-------------------------------------------------- |
| 2023-08-21 | stephenjwatkins | Add `<ModalContainer />` to support custom triggers |
| 2023-08-22 | stephenjwatkins | Add `isDisabled` to actions to support disabling    |
