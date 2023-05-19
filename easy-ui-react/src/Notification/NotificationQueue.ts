import { ToastStateProps, ToastQueue } from "@react-stately/toast";
import { AlertProps, ToastProps } from "./Notification";

export const TOAST_TIMEOUT_DURATION = 4000;

export type EasyUINotificationOptionsProps = ToastStateProps & {
  /** Identifier of notification currently displayed */
  activeNotificationKey?: string;
};

/**
 * @privateRemarks
 * Easy UI notification queue that extends react-stately's toast queue.
 * Ensures every toast has a 4000ms timeout and only one notification
 * is visible at any time.
 */
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

  alert(content: AlertProps) {
    this.closeActiveNotification();
    this.activeNotificationKey = super.add(content as NotificationProps);
  }

  toast(content: ToastProps) {
    this.closeActiveNotification();
    this.activeNotificationKey = super.add(content as NotificationProps, {
      timeout: TOAST_TIMEOUT_DURATION,
    });
  }
}
