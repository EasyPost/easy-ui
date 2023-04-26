# `Toast` Component Specification

## Overview

The `Toast` component displays a brief non-disruptive message to the user as a result of an action taken. The displayed message is accompanied by an associated status icon and cannot be manually dismissed. **Not** to be used to display critical information such as a system failure, see the `Alert` component for such behavior.

### Use Cases

- Inform user of a completed action such as an account creation.
- Inform user that an asynchronous process has been triggered based on their action.

### Features

- Individual toasts have ARIA `role="status"`.
- The `message` prop is of type `string`.

### Risks and Challenges

- Unlike other components, `Toast` components are unique in that they may be quite opinionated with regards to how they display and the kind of control they expose to consumers.
- Building for the shipper's experience at EasyPost according to internal specs while maintaining a pleasant DX for outside consumers.

### Prior Art

- [Paste `<Toast />`](https://paste.twilio.design/components/toast)
- [Spectrum `<Toast />`](https://react-spectrum.adobe.com/react-spectrum/Toast.html)

---

## Design

### API

```typescript
import type { AriaToastProps } from "@react-aria/toast";
import type { QueuedToast } from "@react-stately/toast";

export type ToastStatus =
  | "primary"
  | "success"
  | "secondary"
  | "error"
  | "warning";

export type ToastProps = {
  /**
   * Toast status
   * @default "success"
   */
  status?: ToastStatus;
  /**
   * Toast will render with left aligned status icon
   * @default false
   */
  noIcon?: boolean;
  /**
   * Toast message
   */
  message: string;
};

export type ToastStateProps = AriaToastProps<ToastProps> & {
  toast: QueuedToast<ToastProps>;
  state: ToastState<ToastProps>;
};
```

### Anatomy

The majority of the `Toast` component's functionality will be handled by React Aria's `useToast` hook, which will assist in managing behavior and accessibility; note that the default accessibility role of `alert` is overriden to `status` since toasts are intended to display non-disruptive messages. Individual toasts will be rendered in a landmark region and handled by a `ToastRegion` component, which behind the scenes is leveraging React Aria's `useToastRegion` hook. Global queue management will be handled by `EasyUIToastQueue`, which extends React Stately's `ToastQueue` and is exposed as `ToastQueue` to consumers. The `ToastContainer` component handles rendering of the `ToastRegion` component and bundles queue management using React Stately's `useToastQueue` hook.

```tsx
function Toast(props: ToastStateProps) {
  const { state, status, noIcon, message } = props;
  let ref = React.useRef(null);
  let { toastProps, titleProps } = useToast(props, state, ref);
  const toastPropsWithAriaStatusRole = { ...toastProps, role: "status" };

  return (
    <div {...toastPropsWithAriaStatusRole} ref={ref}>
      {!noIcon && <Icon />}
      <div {...titleProps}>
        <Text>{message}</Text>
      </div>
    </div>
  );
}

type ToastRegionProps = AriaToastRegionProps & {
  state: ToastState<ToastProps>;
};

function ToastRegion(props: ToastRegionProps) {
  const { state } = props;
  let ref = React.useRef(null);
  let { regionProps } = useToastRegion(props, state, ref);

  return (
    <div {...regionProps} ref={ref}>
      {state.visibleToasts.map((toast) => (
        <Toast key={toast.key} toast={toast} state={state} />
      ))}
    </div>
  );
}

// import {ToastStateProps as ReactStatelyToastOptionsProps} from "@react-stately/toast"
type EasyUIToastOptionsProps = ReactStatelyToastOptionsProps & {
  timeoutDuration?: number;
  activeToastKey?: string;
};

// import {ToastQueue as ReactStatelyToastQueue} from "@react-stately/toast"
class EasyUIToastQueue<ToastProps> extends ReactStatelyToastQueue<ToastProps> {
  private timeoutDuration: number;
  private activeToastKey: string;
  constructor(options?: EasyUIToastOptionsProps) {
    super(options);
    this.timeoutDuration = options?.timeoutDuration ?? 4000;
    this.activeToastKey = "";
  }

  addToast(content: ToastProps) {
    if (this.activeToastKey) {
      super.close(this.activeToastKey);
    }
    this.activeToastKey = super.add(content, { timeout: this.timeoutDuration });
  }

  showPrimary(content: ToastProps) {
    this.addToast({
      ...content,
      status: "primary",
    });
  }

  showError(content: ToastProps) {
    this.addToast({
      ...content,
      status: "error",
    });
  }

  showWarning(content: ToastProps) {
    this.addToast({
      ...content,
      status: "warning",
    });
  }

  showSuccess(content: ToastProps) {
    this.addToast({
      ...content,
      status: "success",
    });
  }

  showSecondary(content: ToastProps) {
    this.addToast({
      ...content,
      status: "secondary",
    });
  }
}

export const ToastQueue = new EasyUIToastQueue<ToastProps>();

export function ToastContainer() {
  // Subscribe to it.
  let state = useToastQueue(ToastQueue);

  // Render toast region.
  return state.visibleToasts.length > 0 ? <ToastRegion state={state} /> : null;
}
```

### Example Usage

To use, import the `ToastContainer` into the place in your app where you will want to render toasts.

```tsx
import { ToastContainer } from "@easypost/easy-ui/Toast";

function App() {
  return (
    <>
      <Nav />
      <ToastContainer />
      <Content />
      <Footer />
    </>
  );
}
```

Then, a toast can be queued from anywhere via the `ToastQueue` component.

```tsx
import { ToastQueue } from "@easypost/easy-ui/Toast";
import Button from "@easypost/easy-ui/Button";

function Component() {
  const handleAction = () => {
    // success
    ToastQueue.showSuccess({ message: "Account Created" });
  };

  return (
    <>
      <Button onPress={handleAction}>Sign up</Button>
    </>
  );
}
```

_Show error_

```tsx
import { ToastQueue } from "@easypost/easy-ui/Toast";
import Button from "@easypost/easy-ui/Button";

function Component() {
  const handleAction = () => {
    // error
    ToastQueue.showError({ message: "Error" });
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
import { ToastQueue } from "@easypost/easy-ui/Toast";
import Button from "@easypost/easy-ui/Button";

function Component() {
  const handleAction = () => {
    // warning
    ToastQueue.showWarning({ message: "Warning" });
  };

  return (
    <>
      <Button onPress={handleAction}>Button</Button>
    </>
  );
}
```

_Show primary_

```tsx
import { ToastQueue } from "@easypost/easy-ui/Toast";
import Button from "@easypost/easy-ui/Button";

function Component() {
  const handleAction = () => {
    // primary
    ToastQueue.showPrimary({ message: "Primary" });
  };

  return (
    <>
      <Button onPress={handleAction}>Button</Button>
    </>
  );
}
```

_Show secondary_

```tsx
import { ToastQueue } from "@easypost/easy-ui/Toast";
import Button from "@easypost/easy-ui/Button";

function Component() {
  const handleAction = () => {
    // secondary
    ToastQueue.showSecondary({ message: "Secondary" });
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
import { ToastQueue } from "@easypost/easy-ui/Toast";
import Button from "@easypost/easy-ui/Button";

function Component() {
  const handleAction = () => {
    // success
    ToastQueue.showSuccess({ message: "Success", noIcon: true });
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

The `Toast` component has an ARIA `role="status"` and elements with the role `status` have an implicit `aria-live` value of `polite` and an implicit `aria-atomic` value of `true`. A `status` is a type of live region providing advisory information that is not important enough to justify an alert, which would immediately interrupt the announcement of a user's current activity. Individual toasts in Easy UI are rendered in an ARIA landmark region labeled "Notifications".

Toasts are **not** suitable for dynamically changing content, consider using the `Alert` component for such a use case. Avoid messages longer than a sentence and avoid rendering interactive elements within toasts that require the user to act.
