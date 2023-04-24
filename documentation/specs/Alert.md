# `Alert` Component Specification

## Overview

The `Alert` component displays an important message near the top of the page that does not automatically timeout and requires user action to dismiss. The displayed messaged is accompanied by an associated status icon. If the message is not prominent enough to immediately require the user's attention, consider using the `Toast` component.

### Use Cases

- Inform user of system level information such as a failed network request.

### Features

- Individual alerts have ARIA `role="alert"`.
- The `message` prop is of type `ReactNode`.

### Risks and Challenges

- Unlike other components, `Alert` components are unique in that they may be quite opinionated with regards to how they display and the kind of control they expose to consumers.
- Building for the shipper's experience at EasyPost according to internal specs while maintaining a pleasant DX for outside consumers.

### Prior Art

- [Paste `<Alert />`](https://paste.twilio.design/components/alert)

---

## Design

### API

```typescript
import type { AriaToastProps as AriaAlertProps } from "@react-aria/toast";
import type { QueuedToast as QueuedAlert } from "@react-stately/toast";

export type AlertVariant =
  | "promotional"
  | "success"
  | "neutral"
  | "error"
  | "warning";

export type AlertProps = {
  /**
   * Alert variant
   * @default "success"
   */
  variant?: AlertVariant;
  /**
   * Alert will render with left aligned status icon
   * @default false
   */
  noIcon?: boolean;
  /**
   * Callback function when dismissing alert
   */
  onDismiss?: () => void;
  /**
   * Alert message
   */
  message: ReactNode;
};

export type AlertStateProps = AriaAlertProps<AlertProps> & {
  toast: QueuedAlert<AlertProps>;
  state: AlertState<AlertProps>;
};
```

### Anatomy

The majority of the `Alert` component's functionality will be handled by React Aria's `useToast` hook, which will assist in managing behavior and accessibility. Individual alerts will be rendered in a landmark region and handled by a `AlertRegion` component, which behind the scenes is leveraging React Aria's `useToastRegion` hook. Global queue management will be handled by `EasyUIAlertQueue`, which extends React Stately's `ToastQueue` and is exposed as `AlertQueue` to consumers. The `AlertContainer` component handles rendering of the `AlertRegion` component and bundles queue management using React Stately's `useToastQueue` hook.

```tsx
function Alert(props: AlertStateProps) {
  const { state, variant, noIcon, message, toast } = props;
  let ref = React.useRef(null);
  let { toastProps, titleProps, closeButtonProps } = useToast(
    props,
    state,
    ref,
  );

  const handleDismiss = () => {
    if (props.toast.content.onDismiss) {
      props.toast.content.onDismiss();
    }
    state.close(toast.key);
  };

  const closeButtonPropsWithDismiss = {
    ...closeButtonProps,
    onPress: handleDismiss,
  };

  return (
    <div {...toastProps} ref={ref}>
      {!noIcon && <Icon />}
      <div {...titleProps}>
        <Text>{message}</Text>
      </div>
      <UnstyledButton {...closeButtonPropsWithDismiss}>
        <Icon />
      </UnstyledButton>
    </div>
  );
}

type AlertRegionProps = AriaAlertRegionProps & {
  state: AlertState<AlertProps>;
};

function AlertRegion(props: AlertRegionProps) {
  const { state } = props;
  let ref = React.useRef(null);
  let { regionProps } = useToastRegion(props, state, ref);

  return (
    <div {...regionProps} ref={ref}>
      {state.visibleToasts.map((toast) => (
        <Alert key={toast.key} toast={toast} state={state} />
      ))}
    </div>
  );
}

// import {ToastStateProps as ReactStatelyAlertOptionsProps} from "@react-stately/toast"
type EasyUIAlertOptionsProps = ReactStatelyAlertOptionsProps & {
  activeAlertKey?: string;
};

// import {ToastQueue as ReactStatelyAlertQueue} from "@react-stately/toast"
class EasyUIAlertQueue<AlertProps> extends ReactStatelyAlertQueue<AlertProps> {
  private activeAlertKey: string;
  constructor(options?: EasyUIAlertOptionsProps) {
    super(options);
    this.activeAlertKey = "";
  }
  addAlert(content: AlertProps) {
    if (this.activeAlertKey) {
      super.close(this.activeAlertKey);
    }
    this.activeAlertKey = super.add(content);
  }

  showPromotional(content: AlertProps) {
    this.addAlert({
      ...content,
      variant: "promotional",
    });
  }

  showError(content: AlertProps) {
    this.addAlert({
      ...content,
      variant: "error",
    });
  }

  showWarning(content: AlertProps) {
    this.addAlert({
      ...content,
      variant: "warning",
    });
  }

  showSuccess(content: AlertProps) {
    this.addAlert({
      ...content,
      variant: "success",
    });
  }

  showNeutral(content: AlertProps) {
    this.addAlert({
      ...content,
      variant: "neutral",
    });
  }
}

export const AlertQueue = new EasyUIAlertQueue<AlertProps>();

export function AlertContainer() {
  // Subscribe to it.
  let state = useToastQueue(AlertQueue);

  // Render alert region.
  return state.visibleToasts.length > 0 ? <AlertRegion state={state} /> : null;
}
```

### Example Usage

To use, import the `AlertContainer` into the place in your app where you will want to render alerts.

```tsx
import { AlertContainer } from "@easypost/easy-ui/Alert";

function App() {
  return (
    <>
      <Nav />
      <AlertContainer />
      <Content />
      <Footer />
    </>
  );
}
```

Then, an alert can be queued from anywhere via the `AlertQueue` component.

```tsx
import { AlertQueue } from "@easypost/easy-ui/Alert";
import Button from "@easypost/easy-ui/Button";

function Component() {
  const handleAction = () => {
    // success
    AlertQueue.showSuccess({ message: "Something good happened!" });
  };

  return (
    <>
      <Button onPress={handleAction}>Sign up</Button>
    </>
  );
}
```

_Show error with link_

```tsx
import { AlertQueue } from "@easypost/easy-ui/Alert";
import Button from "@easypost/easy-ui/Button";

function Component() {
  const handleAction = () => {
    // error
    AlertQueue.showError({
      message: (
        <>
          Error: Could not submit request. Check your internet connection. If
          problem persists, <Link>contact support</Link>
        </>
      ),
    });
  };

  return (
    <>
      <Button onPress={handleAction}>Button</Button>
    </>
  );
}
```

_Show warning_

```tsx
import { AlertQueue } from "@easypost/easy-ui/Alert";
import Button from "@easypost/easy-ui/Button";

function Component() {
  const handleAction = () => {
    // warning
    AlertQueue.showWarning({ message: "Warning" });
  };

  return (
    <>
      <Button onPress={handleAction}>Button</Button>
    </>
  );
}
```

_Show promotional_

```tsx
import { AlertQueue } from "@easypost/easy-ui/Alert";
import Button from "@easypost/easy-ui/Button";

function Component() {
  const handleAction = () => {
    // promotional
    AlertQueue.showPromotional({ message: "Promotional" });
  };

  return (
    <>
      <Button onPress={handleAction}>Button</Button>
    </>
  );
}
```

_Show neutral_

```tsx
import { AlertQueue } from "@easypost/easy-ui/Alert";
import Button from "@easypost/easy-ui/Button";

function Component() {
  const handleAction = () => {
    // neutral
    AlertQueue.showNeutral({ message: "Neutral" });
  };

  return (
    <>
      <Button onPress={handleAction}>Button</Button>
    </>
  );
}
```

_Show success without icon_

```tsx
import { AlertQueue } from "@easypost/easy-ui/Alert";
import Button from "@easypost/easy-ui/Button";

function Component() {
  const handleAction = () => {
    // success
    AlertQueue.showSuccess({ message: "Success", noIcon: true });
  };

  return (
    <>
      <Button onPress={handleAction}>Button</Button>
    </>
  );
}
```

_With onDismiss callback_

```tsx
import { AlertQueue } from "@easypost/easy-ui/Alert";
import Button from "@easypost/easy-ui/Button";

function Component() {
  const handleAction = () => {
    // success
    AlertQueue.showSuccess({
      message: "Success",
      onDismiss: () => alert("i am called immediately before the alert closes"),
    });
  };

  return (
    <>
      <Button onPress={handleAction}>Button</Button>
    </>
  );
}
```

## Behavior

### Accessibility

The `Alert` component has an ARIA `role="alert"`. The `alert` role is for important, and usually time-sensitive, information. When this role is added to an element, the browser will send out an accessible alert event to assistive technology products which can then notify the user. Setting `role="alert"` is equivalent to setting `aria-live="assertive"` and `aria-atomic="true"`. Individual alerts in Easy UI are rendered in an ARIA landmark region labeled "Notifications".

Due to its intrusive nature, alerts should only be preserved for information that requires the user's immediate attention. Hence, for cases when you need to provide the user with passive information, the `Toast` component is likely more suitable.
