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

export type BaseNotificationProps = {
  /** Notification type */
  type?: NotificationType;
  /** Notification message */
  message: ReactNode;
  /**
   * Notification status
   * @default 'success'
   */
  status?: NotificationStatus;
  /**
   * Notification will render with left aligned status icon
   * @default true
   */
  hasIcon?: boolean;
};

export type ToastProps = Omit<BaseNotificationProps, "type" | "status">;

export type AlertProps = Omit<BaseNotificationProps, "type" | "status"> & {
  /** Callback function when dismissing alerts */
  onDismiss?: () => void;
};

export type QueuedNotification = QueuedToast<NotificationProps>;

export type NotificationProps = BaseNotificationProps & ToastProps & AlertProps;

export type NotificationInternalState = ToastState<NotificationProps>;

/** The methods below are accessible on the object returned by the `useNotification` hook. */
export type NotificationExternalState = {
  /** Shows promotional color status toast */
  showPromotionalToast(content: ToastProps): void;
  /** Shows neutral color status toast */
  showNeutralToast(content: ToastProps): void;
  /** Shows success color status toast */
  showSuccessToast(content: ToastProps): void;
  /** Shows warning color status toast */
  showWarningToast(content: ToastProps): void;
  /** Shows error color status toast */
  showErrorToast(content: ToastProps): void;
  /** Shows promotional color status alert */
  showPromotionalAlert(content: AlertProps): void;
  /** Shows neutral color status alert */
  showNeutralAlert(content: AlertProps): void;
  /** Shows success color status alert */
  showSuccessAlert(content: AlertProps): void;
  /** Shows warning color status alert */
  showWarningAlert(content: AlertProps): void;
  /** Shows error color status alert */
  showErrorAlert(content: AlertProps): void;
  /** Closes active notification */
  closeActiveNotification(): void;
};

export type NotificationCombinedState = NotificationInternalState &
  NotificationExternalState;

export type NotificationItemStateProps = AriaToastProps<NotificationProps> & {
  /**
   * The `toast` name here is an artifact of react-stately, not an Easy UI `toast`
   * it is more appropriate to think of this as a `notification`.
   */
  toast: QueuedNotification;
  /**
   * Holds the internal state for notifications and the functions that directly
   * interact with the queue object. Consumers do not see this state.
   */
  state: NotificationInternalState;
};
/**
 * Easy UI styles applied to `NotificationContainer`
 *
 *   position: fixed;
 *   z-index: 999999;
 *   width: 100%;
 *   top: 0;
 *   left: 0;
 *
 * In some cases, consumers may want more fine grained control over how the container is
 * positioned on the screen. This can be accomplished through the `notficationPlacementProps`
 * prop which can be passed through EasyUIProvider. See more in the examples section.
 */

export type Notificationoffset = {
  /** Top offset */
  top?: string;
  /** Right offset */
  right?: string;
  /** Bottom offset */
  bottom?: string;
  /** Left offset */
  left?: string;
};

export type Notificationposition = "fixed" | "absolute";

export type NotificationPlacementProps = {
  /**
   * HTML ID of element where notifications will render to. Default
   * position values will be applied if htmlId is provided but does not exist.
   */
  htmlId?: string;
  /** Position type */
  position?: Notificationposition;
  /** Position placement */
  offset?: Notificationoffset;
};
```

### Anatomy

The `Notification` component's functionality will be handled by React Aria's `useToast` hook, which will assist in managing behavior and accessibility. Individual notifications will be rendered in a landmark region and handled by a `NotificationRegion` component, which behind the scenes is leveraging React Aria's `useToastRegion` hook. The `NotificationContainer` component handles rendering of the `NotificationRegion` component. Queue management will be handled by `EasyUINotificationQueue`, which extends React Stately's `ToastQueue`. The queue is bundled into a `useNotificationState` hook which is using React Stately's `useToastQueue` hook. A `NotificationProvider` consumes the `useNotificationState` hook and provides the returned value to its children via React's `useContext` hook. This will be rendered at the root of `EasyUIProvider`. The `useContext` hook is not directly exposed to consumers; it is wrapped up in a `useNotification` hook on which the returned object can invoke functions to display toasts or alerts in a `NotificationContainer`.

In general, the consumers will only ever need to use the `useNotification` hook assuming the app consumes `EasyUIProvider`.

```tsx
export function Notification(props: NotificationItemStateProps) {
  const ref = useRef(null);
  const { state, toast: notification } = props;
  const {
    type = "toast",
    message,
    status = "success",
    hasIcon = true,
    onDismiss,
  } = notification.content;

  const {
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
    <div
      {...notificationPropsWithAdjustedAriaRole}
      ref={ref}
      className={classNames(
        styles.Notification,
        styles[variationName("status", status)],
        styles[variationName("type", type)],
      )}
    >
      <div className={styles.iconText}>
        {hasIcon && <Icon size="lg" symbol={getStatusIcon(status)} />}
        <div {...titleProps}>
          <Text weight="semibold">{message}</Text>
        </div>
      </div>
      {type === "alert" && (
        <UnstyledButton
          {...closeButtonPropsWithDismiss}
          className={classNames(styles.closeButton)}
        >
          <Icon size="md" symbol={CloseIcon} />
        </UnstyledButton>
      )}
    </div>
  );
}

export type NotificationRegionProps = AriaToastRegionProps & {
  state: NotificationInternalState;
};

export function NotificationRegion(props: NotificationRegionProps) {
  const { state } = props;
  const ref = React.useRef(null);

  const { regionProps } = useToastRegion(props, state, ref);
  /**
   * `visibleToasts` and `toast` are artifacts of react-stately and in
   * Easy UI `visibleToasts` is being treated as `visibleNotifications` and
   * similarly, `toast` here is being treated as a `notification`.
   */
  return (
    <div {...regionProps} ref={ref} className={styles.region}>
      {state.visibleToasts.map((toast) => (
        <Notification key={toast.key} toast={toast} state={state} />
      ))}
    </div>
  );
}

export type EasyUINotificationOptionsProps = ToastStateProps & {
  activeNotificationKey?: string;
};

export const TOAST_TIMEOUT_DURATION = 4000;

export class EasyUINotificationQueue<
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
    this.activeNotificationKey = super.add(content, {
      timeout: TOAST_TIMEOUT_DURATION,
    });
  }
}

export const NotificationContext =
  createContext<NotificationExternalState | null>(null);

export type NotificationCombinedState = NotificationInternalState &
  NotificationExternalState;

export function useNotificationState(): NotificationCombinedState {
  const queue = useMemo(
    () => new EasyUINotificationQueue<NotificationProps>(),
    [],
  );
  const state = useToastQueue<NotificationProps>(queue);
  return {
    ...state,
    showPromotionalAlert: (content: AlertProps) =>
      queue.alert({ ...content, status: "promotional", type: "alert" }),
    showNeutralAlert: (content: AlertProps) =>
      queue.alert({ ...content, status: "neutral", type: "alert" }),
    showSuccessAlert: (content: AlertProps) =>
      queue.alert({ ...content, status: "success", type: "alert" }),
    showWarningAlert: (content: AlertProps) =>
      queue.alert({ ...content, status: "warning", type: "alert" }),
    showErrorAlert: (content: AlertProps) =>
      queue.alert({ ...content, status: "error", type: "alert" }),
    showPromotionalToast: (content: ToastProps) =>
      queue.toast({ ...content, status: "promotional", type: "toast" }),
    showNeutralToast: (content: ToastProps) =>
      queue.toast({ ...content, status: "neutral", type: "toast" }),
    showSuccessToast: (content: ToastProps) =>
      queue.toast({ ...content, status: "success", type: "toast" }),
    showWarningToast: (content: ToastProps) =>
      queue.toast({ ...content, status: "warning", type: "toast" }),
    showErrorToast: (content: ToastProps) =>
      queue.toast({ ...content, status: "error", type: "toast" }),
    closeActiveNotification: () => queue.closeActiveNotification(),
  };
}

export type Notificationoffset = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

export type Notificationposition = "fixed" | "absolute";

export type NotificationPlacementProps = {
  htmlId?: string;
  position?: Notificationposition;
  offset?: Notificationoffset;
};

export type NotificationProviderProps = {
  children: ReactNode;
  notificationPlacementProps?: NotificationPlacementProps;
};

export function NotificationProvider(props: NotificationProviderProps) {
  const { children, notificationPlacementProps } = props;
  const combinedState = useNotificationState();

  const state = {
    close: combinedState.close,
    add: combinedState.add,
    remove: combinedState.remove,
    pauseAll: combinedState.pauseAll,
    resumeAll: combinedState.resumeAll,
    visibleToasts: combinedState.visibleToasts,
  };

  const notification = {
    showErrorAlert: combinedState.showErrorAlert,
    showErrorToast: combinedState.showErrorToast,
    showPromotionalToast: combinedState.showPromotionalToast,
    showPromotionalAlert: combinedState.showPromotionalAlert,
    showNeutralToast: combinedState.showNeutralToast,
    showNeutralAlert: combinedState.showNeutralAlert,
    showSuccessToast: combinedState.showSuccessToast,
    showSuccessAlert: combinedState.showSuccessAlert,
    showWarningToast: combinedState.showWarningToast,
    showWarningAlert: combinedState.showWarningAlert,
    closeActiveNotification: combinedState.closeActiveNotification,
  };

  return (
    <NotificationContext.Provider value={notification}>
      <NotificationContainer
        htmlId={notificationPlacementProps?.htmlId}
        offset={notificationPlacementProps?.offset}
        position={notificationPlacementProps?.position}
        state={state}
      />
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const notification = useContext(NotificationContext);
  if (!notification) {
    throw new Error(
      "useNotification() must be used within a NotificationProvider, which is bundled with EasyUIProvider",
    );
  }

  return notification;
}

export type NotificationContainerProps = {
  htmlId?: string;
  position?: Notificationposition;
  offset?: Notificationoffset;
  state: NotificationInternalState;
};

export function NotificationContainer(props: NotificationContainerProps) {
  const { htmlId, position = "fixed", offset, state } = props;
  const positionStyleProps = offset
    ? {
        top: offset?.top,
        right: offset?.right,
        bottom: offset?.bottom,
        left: offset?.left,
      }
    : {
        top: 0,
        left: 0,
      };
  const positionProps = {
    position: position,
  };

  const containerStyles = {
    ...positionStyleProps,
    ...positionProps,
  } as React.CSSProperties;

  const customContainer = htmlId ? document.getElementById(htmlId) : null;

  return (
    <>
      {/** visibleToasts` is an artifact of react-stately */}
      {state.visibleToasts.length > 0
        ? createPortal(
            <div className={style.container} style={containerStyles}>
              <NotificationRegion state={state} />
            </div>,
            customContainer ?? document.body,
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
import { useNotification } from "@easypost/easy-ui/Notification";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const notification = useNotification();

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
import { useNotification } from "@easypost/easy-ui/Notification";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const notification = useNotification();

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
import { useNotification } from "@easypost/easy-ui/Notification";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const notification = useNotification();

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
import { useNotification } from "@easypost/easy-ui/Notification";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const notification = useNotification();

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
import { useNotification } from "@easypost/easy-ui/Notification";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const notification = useNotification();

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
import { useNotification } from "@easypost/easy-ui/Notification";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const notification = useNotification();

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
import { useNotification } from "@easypost/easy-ui/Notification";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const notification = useNotification();

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

_With programmatic dismissal_

```tsx
import { useNotification } from "@easypost/easy-ui/Notification";
import { Button } from "@easypost/easy-ui/Button";

function Component() {
  const notification = useNotification();

  const onAlert = () => {
    notification.showSuccessAlert({
      message: "message",
    });
  };

  const onClose = () => {
    notification.closeActiveNotification();
  };

  return (
    <>
      <Button onPress={onAlert}>Show alert</Button>
      <Button onPress={onClose}>Dismiss alert</Button>
    </>
  );
}
```

In some cases, users may want more control over where the notification displays in the app. This can be accomplished via the `notificationPlacementProps` prop that can be supplied to EasyUIProvider.

_With offset and position_

```tsx
import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";

function RootOfYourApp() {
  return (
    <EasyUIProvider
      colorScheme="system"
      notificationPlacementProps={{
        offset: { top: "50px", left: "0px" },
        position: "absolute",
      }}
    >
      {/* app */}
    </EasyUIProvider>
  );
}
```

_Render into a container other that document.body_

```tsx
import { Provider as EasyUIProvider } from "@easypost/easy-ui/Provider";

function RootOfYourApp() {
  return (
    <EasyUIProvider
      colorScheme="system"
      notificationPlacementProps={{
        htmlId: "some-id",
      }}
    >
      <div id="some-id">Some container</div>
    </EasyUIProvider>
  );
}
```

## Behavior

### Accessibility

Individual toasts have an ARIA `role="status"` and elements with the role `status` have an implicit `aria-live` value of `polite` and an implicit `aria-atomic` value of `true`. A `status` is a type of live region providing advisory information that is not important enough to justify an alert, which would immediately interrupt the announcement of a user's current activity. Hence, toasts are **not** suitable for dynamically changing content, consider issuing an alert for such a use case. Also, for toasts, avoid messages longer than a sentence and avoid rendering interactive elements within toasts that require the user to act.

Individual alerts have an ARIA `role="alert"`. The `alert` role is for important, and usually time-sensitive, information. When this role is added to an element, the browser will send out an accessible alert event to assistive technology products which can then notify the user. Setting `role="alert"` is equivalent to setting `aria-live="assertive"` and `aria-atomic="true"`. Due to its intrusive nature, alerts should only be preserved for information that requires the user's immediate attention. Hence, for cases when you need to provide the user with passive information, issuing a toast is likely more suitable.

All notifications in Easy UI are rendered in an ARIA landmark region labeled "Notifications".
