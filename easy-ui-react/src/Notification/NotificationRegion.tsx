import React from "react";
import {
  Notification,
  NotificationState,
  NotificationProps,
} from "./Notification";
import { useToastRegion, AriaToastRegionProps } from "@react-aria/toast";
import styles from "./Notification.module.scss";

export type NotificationRegionProps = AriaToastRegionProps & {
  /**
   * Holds the state for notifications and the functions that directly
   * interact with the queue object.
   */
  notification: NotificationState<NotificationProps>;
};

/**
 * @privateRemarks
 * This componenet is responsible for rendering individual notifications into
 * a region.
 */
export function NotificationRegion(props: NotificationRegionProps) {
  const { notification } = props;
  const ref = React.useRef(null);
  const { regionProps } = useToastRegion(props, notification, ref);
  /**
   * `visibleToasts` and `toast` are artifacts of react-stately and in
   * Easy UI `visibleToasts` is being treated as `visibleNotifications` and
   * similarly, `toast` here is being treated as a `notification`.
   *
   */
  return (
    <div {...regionProps} ref={ref} className={styles.notificationRegion}>
      {notification.visibleToasts.map((toast) => (
        <Notification key={toast.key} toast={toast} state={notification} />
      ))}
    </div>
  );
}
