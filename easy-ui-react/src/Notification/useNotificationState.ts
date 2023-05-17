import { useMemo } from "react";
import { useToastQueue } from "@react-stately/toast";
import {
  NotificationProps,
  NotificationState,
  AlertProps,
  ToastProps,
} from "./Notification";
import { EasyUINotificationQueue } from "./NotificationQueue";

export function useNotificationState(): NotificationState<NotificationProps> {
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
  };
}
