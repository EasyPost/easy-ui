# `Notification` Component Specification

## Overview

The `Notification` component is capable of displaying `alerts` and `toasts` messages through a `useNotification` hook. Use of this component requires that your app consume `EasyUIProvider`.

Toasts dispay a brief non-disruptive message to the user as a result of an action taken. The displayed message is accompanied by an associated status icon and cannot be manually dismissed, instead toast messages automatically timeout after `4000ms`. Toasts should not be used to display critical information such as a system failure, use `alerts` for such behavior. They should also contain purely text and no elements such as links.

Alerts display an important message near the top of the page that does not automatically timeout and requires user action to dismiss. The displayed messaged is accompanied by an associated status icon. If the message is not prominent enough to immediately require the user's attention, consider using toasts.

### Toast Use Cases

- Inform user of a completed action.
- Inform user that an asynchronous process has been triggered based on their action.

### Alert Use Cases

- Inform user of system level errors such as a failed network request.
- Inform user of any critical information that requires their attention.

### Features

- Notifications are interacted with through the use of a `useNotification` hook.
- Toasts have ARIA `role="status"` and alerts have ARIA `role="alert"`.
- The `message` prop is of type `ReactNode`.

### Risks and Challenges

- Unlike other components, `Notification` components are unique in that they may be quite opinionated with regards to how they display and the kind of control they expose to consumers.
- Building for the shipper's experience at EasyPost according to internal specs while maintaining a pleasant DX for outside consumers.
- Allowing consumers to customize placement.

### Prior Art

- [Paste `<Alert />`](https://paste.twilio.design/components/alert)
- [Paste `<Toast />`](https://paste.twilio.design/components/toast)
- [Spectrum `<Toast />`](https://react-spectrum.adobe.com/react-spectrum/Toast.html)

---

## Design

### API

```typescript
import type { AriaToastProps } from "@react-aria/toast";
import type { QueuedToast } from "@react-stately/toast";

export type NotificationType = "alert" | "toast";

export type NotificationStatus =
  | "promotional"
  | "success"
  | "neutral"
  | "error"
  | "warning";

export type NotificationProps = {
  /** Notification type */
  type: NotificationStatus;
  /** Notification message */
  message: ReactNode;
  /** Callback function when dismissing alerts */
  onDismiss?: () => void;
  /**
   * Notification status
   * @default "success"
   */
  status?: NotificationStatus;
  /**
   * Notification will render with left aligned status icon
   * @default false
   */
  noIcon?: boolean;
};

export type NotificationStateProps = AriaToastProps<NotificationProps> & {
  /**
   * The `toast` name here is an artifact of react-stately, not an Easy UI `toast`
   * it is more appropriate to think of this as a `notification`.
   */
  toast: QueuedToast<NotificationProps>;
  /**
   * Holds the state for notifications and the functions that directly
   * interact with the queue object.
   */
  state: NotificationState<NotificationProps>;
};

/** The methods below are accessible on the object returned by the `useNotification` hook */
export type NotificationState<NotificationProps> =
  ToastState<NotificationProps> & {
    /** Shows promotional color status toast */
    showPromotionalToast(content: NotificationProps): void;
    /** Shows neutral color status toast */
    showNeutralToast(content: NotificationProps): void;
    /** Shows success color status toast */
    showSuccessToast(content: NotificationProps): void;
    /** Shows warning color status toast */
    showWarningToast(content: NotificationProps): void;
    /** Shows error color status toast */
    showErrorToast(content: NotificationProps): void;
    /** Shows promotional color status alert */
    showPromotionalAlert(content: NotificationProps): void;
    /** Shows neutral color status alert */
    showNeutralAlert(content: NotificationProps): void;
    /** Shows success color status alert */
    showSuccessAlert(content: NotificationProps): void;
    /** Shows warning color status alert */
    showWarningAlert(content: NotificationProps): void;
    /** Shows error color status alert */
    showErrorAlert(content: NotificationProps): void;
  };

/**
 * Easy UI styles applied to `NotificationContainer`
 *
 *   position: fixed;
 *   z-index: 999999;
 *   width: 100%;
 *   top: 0;
 *
 * In some cases, consumers may want more fine grained control over how the container is
 * positioned on the screen. This can be accomplished through the `notficationPlacementOffset`
 * prop which can be passed through EasyUIProvider. See more in the examples section.
 */

export type NotificationPositionOffset = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};
```

### Anatomy

The `Notification` component's functionality will be handled by React Aria's `useToast` hook, which will assist in managing behavior and accessibility. Individual notifications will be rendered in a landmark region and handled by a `NotificationRegion` component, which behind the scenes is leveraging React Aria's `useToastRegion` hook. The `NotificationContainer` component handles rendering of the `NotificationRegion` component. Queue management will be handled by `EasyUINotificationQueue`, which extends React Stately's `ToastQueue`. The queue is bundled into a `useNotificationState` hook which is using React Stately's `useToastQueue` hook. A `NotificationProvider` consumes the `useNotificationState` hook and provides the returned value to its children via React's `useContext` hook. This will be rendered at the root of `EasyUIProvider`. The `useContext` hook is not directly exposed to consumers; it is wrapped up in a `useNotification` hook on which the returned object can invoke functions to display toasts or alerts in a `NotificationContainer`.

In general, the consumers will only ever need to use the `useNotification` hook assuming the app consumes `EasyUIProvider`.

```tsx
function Notification(props: NotificationStateProps) {
  let ref = React.useRef(null);
  const { state, toast: notification } = props;
  const {
    type,
    message,
    noIcon = false,
    onDismiss = null,
  } = notification.content;

  let {
    toastProps: notificationProps,
    titleProps,
    closeButtonProps,
  } = useToast(props, state, ref);

  // default role alert
  const notificationPropsWithAdjustedAriaRole =
    type === "toast"
      ? { ...notificationProps, role: "status" }
      : notificationProps;

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
    state.close(notification.key);
  };
  const closeButtonPropsWithDismiss = {
    ...closeButtonProps,
    onPress: handleDismiss,
  };

  return (
    <div {...notificationPropsWithAdjustedAriaRole} ref={ref}>
      {!noIcon && <Icon />}
      <div {...titleProps}>
        <Text>{message}</Text>
      </div>
      {type === "alert" && (
        <UnstyledButton {...closeButtonPropsWithDismiss}>
          <Icon />
        </UnstyledButton>
      )}
    </div>
  );
}

export type NotificationRegionProps = AriaToastRegionProps & {
  notification: NotificationState<NotificationProps>;
};

function NotificationRegion(props: NotificationRegionProps) {
  const { notification } = props;
  let ref = React.useRef(null);
  let { regionProps } = useToastRegion(props, notification, ref);
  /**
   * again, `visibleToasts` and `toast` are artifacts of react-stately and in
   * Easy UI `visibleToasts` is being treated as `visibleNotifications` and
   * similarly, `toast` here is being treated as a `notification`.
   *
   */
  return (
    <div {...regionProps} ref={ref}>
      {notification.visibleToasts.map((toast) => (
        <Notification key={toast.key} toast={toast} state={notification} />
      ))}
    </div>
  );
}

export type NotificationState<NotificationProps> =
  ToastState<NotificationProps> & {
    showPromotionalToast(content: NotificationProps): void;
    showNeutralToast(content: NotificationProps): void;
    showSuccessToast(content: NotificationProps): void;
    showWarningToast(content: NotificationProps): void;
    showErrorToast(content: NotificationProps): void;
    showPromotionalAlert(content: NotificationProps): void;
    showNeutralAlert(content: NotificationProps): void;
    showSuccessAlert(content: NotificationProps): void;
    showWarningAlert(content: NotificationProps): void;
    showErrorAlert(content: NotificationProps): void;
  };

export type EasyUINotificationOptionsProps = ToastStateProps & {
  activeNotificationKey?: string;
};

class EasyUINotificationQueue<
  NotificationProps,
> extends ToastQueue<NotificationProps> {
  private activeNotificationKey: string;
  constructor(options?: EasyUINotificationOptionsProps) {
    super(options);
    this.activeNotificationKey = "";
  }

  closeActiveNotification() {
    if (this.activeNotificationKey) {
      super.close(this.activeNotificationKey);
    }
  }

  alert(content: NotificationProps) {
    this.closeActiveNotification();
    this.activeNotificationKey = super.add(content);
  }

  toast(content: NotificationProps) {
    this.closeActiveNotification();
    this.activeNotificationKey = super.add(content, { timeout: 4000 });
  }
}

type NotificationProviderProps = {
  children: ReactNode;
};

const NotificationContext =
  React.createContext<NotificationState<NotificationProps> | null>(null);

export function useNotificationState(): NotificationState<NotificationProps> {
  let queue = useMemo(
    () => new EasyUINotificationQueue<NotificationProps>(),
    [],
  );
  let state = useToastQueue<NotificationProps>(queue);
  return {
    ...state,
    showPromotionalAlert: (content) =>
      queue.alert({ ...content, status: "promotional", type: "alert" }),
    showNeutralAlert: (content) =>
      queue.alert({ ...content, status: "neutral", type: "alert" }),
    showSuccessAlert: (content) =>
      queue.alert({ ...content, status: "success", type: "alert" }),
    showWarningAlert: (content) =>
      queue.alert({ ...content, status: "warning", type: "alert" }),
    showErrorAlert: (content) =>
      queue.alert({ ...content, status: "error", type: "alert" }),
    showPromotionalToast: (content) =>
      queue.toast({ ...content, status: "promotional", type: "toast" }),
    showNeutralToast: (content) =>
      queue.toast({ ...content, status: "neutral", type: "toast" }),
    showSuccessToast: (content) =>
      queue.toast({ ...content, status: "success", type: "toast" }),
    showWarningToast: (content) =>
      queue.toast({ ...content, status: "warning", type: "toast" }),
    showErrorToast: (content) =>
      queue.toast({ ...content, status: "error", type: "toast" }),
  };
}

export type NotificationPositionOffset = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

export type NotificationProviderProps = {
  children: ReactNode;
  notificationPlacementOffset?: NotificationPositionOffset;
};

export function NotificationProvider(props: NotificationProviderProps) {
  const { children, notificationPlacementOffset } = props;
  let notification = useNotificationState();

  return (
    <NotificationContext.Provider value={notification}>
      <NotificationContainer
        notificationPlacementOffset={notificationPlacementOffset}
      />
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const notification = useContext(NotificationContext)!;
  return { notification };
};

export type NotificationContainerProps = {
  notificationPlacementOffset?: NotificationPositionOffset;
};

export function NotificationContainer(props: NotificationContainerProps) {
  const { notificationPlacementOffset = null } = props;
  const { notification } = useNotification();
  const positionStyleProps = notificationPlacementOffset
    ? {
        top: notificationPlacementOffset?.top,
        right: notificationPlacementOffset?.right,
        bottom: notificationPlacementOffset?.bottom,
        left: notificationPlacementOffset?.left,
      }
    : undefined;
  // again, `visibleToasts` is an artifact of react-stately
  return (
    <>
      {notification.visibleToasts.length > 0
        ? ReactDOM.createPortal(
            <div style={positionStyleProps}>
              <NotificationRegion notification={notification} />{" "}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
```

### Example Usage

The examples below assume your app is consuming `EasyUIProvider`. This is important because `NotificationProvider` is rendered at the root of `EasyUIProvider`.

A notification can be queued via the `useNotification` hook.

```tsx
import { useNotification } from "@easypost/easy-ui/Toast";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const { notification } = useNotification();

  const onToast = () => {
    notification.showSuccessToast({ message: "message" });
  };

  const onAlert = () => {
    notification.showSuccessAlert({ message: "message" });
  };

  return (
    <>
      <Button onPress={onToast}>Show toast</Button>
      <Button onPress={onAlert}>Show alert</Button>
    </>
  );
}
```

_Show promotional notifications_

```tsx
import { useNotification } from "@easypost/easy-ui/Toast";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const { notification } = useNotification();

  const onToast = () => {
    notification.showPromotionalToast({ message: "message" });
  };

  const onAlert = () => {
    notification.showPromotionalAlert({ message: "message" });
  };

  return (
    <>
      <Button onPress={onToast}>Show toast</Button>
      <Button onPress={onAlert}>Show alert</Button>
    </>
  );
}
```

_Show warning notifications_

```tsx
import { useNotification } from "@easypost/easy-ui/Toast";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const { notification } = useNotification();

  const onToast = () => {
    notification.showWarningToast({ message: "message" });
  };

  const onAlert = () => {
    notification.showWarningAlert({ message: "message" });
  };

  return (
    <>
      <Button onPress={onToast}>Show toast</Button>
      <Button onPress={onAlert}>Show alert</Button>
    </>
  );
}
```

_Show neutral notifications_

```tsx
import { useNotification } from "@easypost/easy-ui/Toast";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const { notification } = useNotification();

  const onToast = () => {
    notification.showNeutralToast({ message: "message" });
  };

  const onAlert = () => {
    notification.showNeutralAlert({ message: "message" });
  };

  return (
    <>
      <Button onPress={onToast}>Show toast</Button>
      <Button onPress={onAlert}>Show alert</Button>
    </>
  );
}
```

_Show error notifications_

```tsx
import { useNotification } from "@easypost/easy-ui/Toast";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const { notification } = useNotification();

  const onToast = () => {
    notification.showErrorToast({ message: "message" });
  };

  const onAlert = () => {
    notification.showErrorAlert({ message: "message" });
  };

  return (
    <>
      <Button onPress={onToast}>Show toast</Button>
      <Button onPress={onAlert}>Show alert</Button>
    </>
  );
}
```

_Show notifications without a status icon_

```tsx
import { useNotification } from "@easypost/easy-ui/Toast";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const { notification } = useNotification();

  const onToast = () => {
    notification.showSuccessToast({ message: "message", noIcon: true });
  };

  const onAlert = () => {
    notification.showSuccessAlert({ message: "message", noIcon: true });
  };

  return (
    <>
      <Button onPress={onToast}>Show toast</Button>
      <Button onPress={onAlert}>Show alert</Button>
    </>
  );
}
```

_With onDismiss callback, only applicable for alerts_

```tsx
import { useNotification } from "@easypost/easy-ui/Toast";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const { notification } = useNotification();

  const onAlert = () => {
    notification.showSuccessAlert({
      message: "message",
      onDismiss: () => alert("i am called immediately before the alert closes"),
    });
  };

  return (
    <>
      <Button onPress={onAlert}>Show alert</Button>
    </>
  );
}
```

In some cases, users may want more control over where the notification displays in the app. This can be accomplished via the `notificationPlacementOffset` prop that can be supplied to EasyUIProvider.

_With positional offset_

```tsx
import { useNotification } from "@easypost/easy-ui/Toast";
import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";

function RootOfYourApp() {
  return (
    <EasyUIProvider notificationPlacementOffset={{ top: "180px" }}>
      {/* app */}
    </EasyUIProvider>
  );
}
```

## Behavior

### Accessibility

Individual toasts have an ARIA `role="status"` and elements with the role `status` have an implicit `aria-live` value of `polite` and an implicit `aria-atomic` value of `true`. A `status` is a type of live region providing advisory information that is not important enough to justify an alert, which would immediately interrupt the announcement of a user's current activity. Hence, toasts are **not** suitable for dynamically changing content, consider issuing an alert for such a use case. Also, for toasts, avoid messages longer than a sentence and avoid rendering interactive elements within toasts that require the user to act.

Individual alerts have an ARIA `role="alert"`. The `alert` role is for important, and usually time-sensitive, information. When this role is added to an element, the browser will send out an accessible alert event to assistive technology products which can then notify the user. Setting `role="alert"` is equivalent to setting `aria-live="assertive"` and `aria-atomic="true"`. Due to its intrusive nature, alerts should only be preserved for information that requires the user's immediate attention. Hence, for cases when you need to provide the user with passive information, issuing a toast is likely more suitable.

All notifications in Easy UI are rendered in an ARIA landmark region labeled "Notifications".
