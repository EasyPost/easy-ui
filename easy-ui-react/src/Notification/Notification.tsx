import React, { ReactNode, useRef, useContext, createContext } from "react";
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
  message?: ReactNode;
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

export type ToastProps = BaseNotificationProps;

export type AlertProps = BaseNotificationProps & {
  /** Callback function when dismissing alerts */
  onDismiss?: () => void;
};

export type NotificationProps = BaseNotificationProps & ToastProps & AlertProps;

/** The methods below are accessible on the object returned by the `useNotification` hook */
export type NotificationState<NotificationProps> =
  ToastState<NotificationProps> & {
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

export function Notification(props: NotificationStateProps) {
  const ref = useRef(null);
  const { state, toast: notification } = props;
  const {
    type = "toast",
    message,
    status = "success",
    hasIcon = true,
    onDismiss,
  } = notification.content;

  const { toastProps, titleProps, closeButtonProps } = useToast(
    props,
    state,
    ref,
  );

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
      {...toastProps}
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
  createContext<NotificationState<NotificationProps> | null>(null);

export function useNotification() {
  const notification = useContext(NotificationContext);
  if (!notification) {
    throw new Error(
      "useNotification() must be used within a NotificationProvider, which is bundled with EasyUIProvider",
    );
  }
  return { notification: notification };
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
  const notification = useNotificationState();

  return (
    <NotificationContext.Provider value={notification}>
      <NotificationContainer
        notificationPlacementOffset={notificationPlacementOffset}
      />
      {children}
    </NotificationContext.Provider>
  );
}
