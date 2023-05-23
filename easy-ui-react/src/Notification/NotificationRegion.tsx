import React from "react";
import { Notification, NotificationInternalState } from "./Notification";
import { useToastRegion, AriaToastRegionProps } from "@react-aria/toast";
import styles from "./Notification.module.scss";

export type NotificationRegionProps = AriaToastRegionProps & {
  /**
   * Holds the internal state for notifications and the functions that directly
   * interact with the queue object. Consumers do not see this state.
   */
  state: NotificationInternalState;
};

/**
 * @privateRemarks
 * This componenet is responsible for rendering individual notifications into
 * a region.
 */
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
