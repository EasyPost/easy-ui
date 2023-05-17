import { ToastStateProps, ToastQueue } from "@react-stately/toast";
import { AlertProps, ToastProps } from "./Notification";

export type EasyUINotificationOptionsProps = ToastStateProps & {
  activeNotificationKey?: string;
};

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
      timeout: 4000,
    });
  }
}
