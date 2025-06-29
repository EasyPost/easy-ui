import React, { ReactNode, useRef, useContext, createContext } from "react";
import { mergeRefs, useObjectRef } from "@react-aria/utils";
import CloseIcon from "@easypost/easy-ui-icons/Close";
import ErrorIcon from "@easypost/easy-ui-icons/Error";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import WarningIcon from "@easypost/easy-ui-icons/Warning";
import DocumentScannerIcon from "@easypost/easy-ui-icons/DocumentScanner";
import CurrencyExchangeIcon from "@easypost/easy-ui-icons/CurrencyExchange";
import { AriaToastProps, useToast } from "@react-aria/toast";
import { QueuedToast, ToastState } from "@react-stately/toast";
import { NotificationContainer } from "./NotificationContainer";
import { useNotificationState } from "./useNotificationState";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { classNames, variationName } from "../utilities/css";
import { UnstyledButton } from "../UnstyledButton";
import styles from "./Notification.module.scss";

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
 * @privateRemarks
 * The Notification component handles rendering of individual toasts or alerts.
 * The `toast` (notification) prop captures essential information such as the notification type,
 * the message to display, the status, whether or not it should render with an icon, and a callback
 * function that is called when an alert is dismissed. The `state` prop captures stateful information,
 * such as functions that can interact with the queue in a programmatic way.
 */
export const Notification = React.forwardRef<
  HTMLDivElement,
  NotificationItemStateProps
>((props, forwardedRef) => {
  const ref = useRef(null);
  const mergedRef = useObjectRef(mergeRefs(ref, forwardedRef));
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
      ref={mergedRef}
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
        <span className={styles.closeButtonContainer}>
          <UnstyledButton
            {...closeButtonPropsWithDismiss}
            className={styles.closeButton}
          >
            <Icon size="md" symbol={CloseIcon} />
          </UnstyledButton>
        </span>
      )}
    </div>
  );
});

Notification.displayName = "Notification";

function getStatusIcon(status: NotificationStatus) {
  switch (status) {
    case "promotional":
      return CurrencyExchangeIcon;
    case "success":
      return CheckCircleIcon;
    case "neutral":
      return DocumentScannerIcon;
    case "error":
      return ErrorIcon;
    case "warning":
      return WarningIcon;
  }
}

export const NotificationContext =
  createContext<NotificationExternalState | null>(null);

/**
 * Notifications of type alert or toast can be displayed using this hook. The hook returns a notification
 * object on which methods can be invoked to display the appropriate notification.
 *
 * @remarks
 * Toasts dispay a brief non-disruptive message to the user as a result of an action taken. The displayed message
 * is accompanied by an associated status icon and cannot be manually dismissed, instead toast messages automatically
 * timeout after `4000ms`. Toasts should not be used to display critical information such as a system failure,
 * use `alerts` for such behavior. They should also contain purely text and no elements such as links.
 *
 * Alerts display an important message near the top of the page that does not automatically timeout and requires
 * user action to dismiss. The displayed messaged is accompanied by an associated status icon. If the message is
 * not prominent enough to immediately require the user's attention, consider using toasts.
 *
 * The following methods are available on the returned notification object:
 *
 * ```tsx
 * showPromotionalToast(content: ToastProps): void;
 * showNeutralToast(content: ToastProps): void;
 * showSuccessToast(content: ToastProps): void;
 * showWarningToast(content: ToastProps): void;
 * showErrorToast(content: ToastProps): void;
 * showPromotionalAlert(content: AlertProps): void;
 * showNeutralAlert(content: AlertProps): void;
 * showSuccessAlert(content: AlertProps): void;
 * showWarningAlert(content: AlertProps): void;
 * showErrorAlert(content: AlertProps): void;
 * closeActiveNotification(): void;
 *
 * type ToastProps = {
 *   // Notification message
 *   message: ReactNode;
 *   // Notification will render with left aligned status icon
 *   hasIcon?: boolean;
 * }
 *
 * type AlertProps = {
 *   // Notification message
 *   message: ReactNode;
 *   // Notification will render with left aligned status icon
 *   hasIcon?: boolean;
 *   // Callback function when dismissing alerts
 *   onDismiss?: () => void;
 * }
 * ```
 * @example
 * _Success:_
```tsx
* import { useNotification } from "@easypost/easy-ui/Notification";
* import { Button } from "@easypost/easy-ui/Button";
*
* function Component() {
*  const notification = useNotification();
*
*  const onToast = () => {
*    notification.showSuccessToast({ message: "message" });
*  };
*
*  const onAlert = () => {
*    notification.showSuccessAlert({ message: "message" });
* };
*
*  return (
*    <>
*      <Button onPress={onToast}>Show toast</Button>
*      <Button onPress={onAlert}>Show alert</Button>
*    </>
*  );
*}
*```
* @example
* _Without status icons:_
```tsx
* import { useNotification } from "@easypost/easy-ui/Notification";
* import { Button } from "@easypost/easy-ui/Button";
*
* function Component() {
*  const notification = useNotification();
*
*  const onToast = () => {
*    notification.showPromotionalToast({ message: "message", hasIcon: false });
*  };
*
*  const onAlert = () => {
*    notification.showWarningAlert({ message: "message", hasIcon: false });
* };
*
*  return (
*    <>
*      <Button onPress={onToast}>Show toast</Button>
*      <Button onPress={onAlert}>Show alert</Button>
*    </>
*  );
*}
*```
* @example
* _With onDismiss callback, only applicable for alerts:_
```tsx
* import { useNotification } from "@easypost/easy-ui/Notification";
* import { Button } from "@easypost/easy-ui/Button";
*
* function Component() {
*  const notification = useNotification();
*
*
*  const onAlert = () => {
*    notification.showNeutralAlert({
*      message: "message",
*      onDismiss: () => alert("i am called immediately before the alert closes"),
*    });
*  };
*
*  return (
*    <>
*      <Button onPress={onAlert}>Show alert</Button>
*    </>
*  );
*}
*```
 */
export function useNotification() {
  const notification = useContext(NotificationContext);
  if (!notification) {
    throw new Error(
      "useNotification() must be used within a NotificationProvider, which is bundled with EasyUIProvider",
    );
  }

  return notification;
}

export type NotificationOffset = {
  /** Top offset */
  top?: string;
  /** Right offset */
  right?: string;
  /** Bottom offset */
  bottom?: string;
  /** Left offset */
  left?: string;
};

export type NotificationPosition = "fixed" | "absolute";

export type NotificationPlacement = {
  /** Callback function that retrieves HTMLElement where notifications will render to */
  getContainer?: () => HTMLElement | null;
  /** Position type */
  position?: NotificationPosition;
  /** Position placement */
  offset?: NotificationOffset;
};

export type NotificationProviderProps = {
  /** Child components */
  children: ReactNode;
  /** Notification placement props */
  notificationPlacement?: NotificationPlacement;
};

/**
 * @privateRemarks
 * The NotificationProvider component bundles everything necessary for an app to
 * display notifications via the `useNotification` hook. This component shouldn't
 * be used on its own and is included in the general EasyUI Provider
 */
export function NotificationProvider(props: NotificationProviderProps) {
  const { children, notificationPlacement } = props;
  const combinedState = useNotificationState();

  const state = {
    close: combinedState.close,
    add: combinedState.add,
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
        getContainer={notificationPlacement?.getContainer}
        offset={notificationPlacement?.offset}
        position={notificationPlacement?.position}
        state={state}
      />
      {children}
    </NotificationContext.Provider>
  );
}
