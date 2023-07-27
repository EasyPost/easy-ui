# `Modal` Component Specification

## Overview

A `Modal` is a page overlay that displays information and blocks interaction with the page until an action is taken or the `Modal` is dismissed.

## Design

`Modal` will use `useDialog` and `useModalOverlay` from `react-aria` to provide the technical foundation for an accessible dialog.

The component design was inspired both by Shopify's Modal component and Twilio's Modal component.

`Modal` will be a controlled component deferring the state management to the consumer.

`Modal` will be a compound component consistenting of `Modal`, `Modal.Header`, `Modal.Body`, and `Modal.Footer`.

### API

```ts
type HeaderElementType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type ModalProps = {
  /**
   * Whether the modal is open or not.
   */
  isOpen: boolean;

  /**
   * Callback when the modal is closed.
   */
  onClose: () => void;

  /**
   * Whether or not the modal can be dismissed.
   *
   * @default true
   */
  isDismissable?: boolean;
};

type ModalHeaderProps = {
  /**
   * Modal header element type. Should be a valid document heading level.
   *
   * @default "h2"
   */
  as?: HeaderElementType;

  /**
   * The content for the title of the modal.
   */
  children: string;

  /**
   * The content for the subtitle of the modal.
   */
  subtitle?: string;

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
    size: "md" | "2xl";
  };
};

type ModalBodyProps = {
  /**
   * Modal body content.
   */
  children: ReactNode;
};

type ModalFooterProps = {
  /**
   * Primary action slot.
   */
  primaryAction: {
    content: string;
    onAction: () => void;
  };

  /**
   * Secondary action slot.
   */
  secondaryAction?: {
    content: string;
    onAction: () => void;
  };
};
```

### Example Usage

```tsx
import { Modal } from "@easypost/easy-ui/Modal";

function PageWithModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
      }}
      isDismissable={false}
    >
      <Modal.Header
        subtitle="Modal subtitle"
        iconAtStart={{
          accessibilityLabel: "Logo",
          symbol: IconSymbol,
        }}
        iconAtEnd={{
          accessibilityLabel: "Logo",
          symbol: IconSymbol,
          size: "2xl",
        }}
      >
        Modal title
      </Modal.Header>
      <Modal.Body>Modal content</Modal.Body>
      <Modal.Footer
        primaryAction={{
          content: "Button 1",
          onAction: () => {},
        }}
        secondaryAction={{
          content: "Button 2",
          onAction: () => {},
        }}
      />
    </Modal>
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
