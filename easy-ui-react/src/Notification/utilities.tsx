import React from "react";
import { Button } from "../Button";
import { useNotification, NotificationProps } from "./Notification";

/** The SimulatedNotificationTrigger component is just for providing a pleasant documenting and testing experience */
export function SimulatedNotificationTrigger(props: NotificationProps) {
  const {
    type = "toast",
    message = "Hello World",
    status = "success",
    hasIcon = true,
    onDismiss,
  } = props;
  const { notification } = useNotification();
  const handlePress = () => {
    if (type === "toast") {
      if (status === "promotional") {
        notification.showPromotionalToast({ message, hasIcon });
      } else if (status === "success") {
        notification.showSuccessToast({ message, hasIcon });
      } else if (status === "neutral") {
        notification.showNeutralToast({ message, hasIcon });
      } else if (status === "warning") {
        notification.showWarningToast({ message, hasIcon });
      } else {
        notification.showErrorToast({ message, hasIcon });
      }
    } else {
      if (status === "promotional") {
        notification.showPromotionalAlert({ message, hasIcon, onDismiss });
      } else if (status === "success") {
        notification.showSuccessAlert({ message, hasIcon, onDismiss });
      } else if (status === "neutral") {
        notification.showNeutralAlert({ message, hasIcon, onDismiss });
      } else if (status === "warning") {
        notification.showWarningAlert({ message, hasIcon, onDismiss });
      } else {
        notification.showErrorAlert({ message, hasIcon, onDismiss });
      }
    }
  };

  return (
    <Button onPress={handlePress}>
      Trigger {type.charAt(0).toUpperCase() + type.slice(1)}
    </Button>
  );
}
