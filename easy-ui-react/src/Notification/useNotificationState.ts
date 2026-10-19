import { useMemo } from "react";
import { useToastQueue } from "@react-stately/toast";
import {
  NotificationProps,
  AlertProps,
  ToastProps,
  NotificationCombinedState,
  NotificationExternalState,
} from "./Notification";
import { EasyUINotificationQueue } from "./NotificationQueue";

/**
 * @privateRemarks
 * This is an internal hook to initialize the queue, the queue state, and compose
 * the functions that will be exposed to consumers.
 *
 * The composed functions are memoized on the queue, which never changes, so
 * they keep their identity across renders.
 */
export function useNotificationState(): NotificationCombinedState {
  const queue = useMemo(
    () => new EasyUINotificationQueue<NotificationProps>(),
    [],
  );
  const state = useToastQueue<NotificationProps>(queue);
  const externalState = useMemo<NotificationExternalState>(
    () => ({
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
    }),
    [queue],
  );
  return { ...state, ...externalState };
}
