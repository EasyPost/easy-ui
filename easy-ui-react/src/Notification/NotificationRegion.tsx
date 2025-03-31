import { AriaToastRegionProps, useToastRegion } from "@react-aria/toast";
import React from "react";
import { TransitionGroup } from "react-transition-group";
import { Notification, NotificationInternalState } from "./Notification";
import styles from "./Notification.module.scss";
import {
  NotificationTransition,
  NotificationTransitionProps,
} from "./NotificationTransition";

export type NotificationRegionProps = AriaToastRegionProps & {
  /**
   * Holds the internal state for notifications and the functions that directly
   * interact with the queue object. Consumers do not see this state.
   */
  state: NotificationInternalState;

  /**
   * Callback function used to track the transition state of the notification.
   */
  onTransitionPendingChange: NotificationTransitionProps["onTransitionPendingChange"];
};

/**
 * @privateRemarks
 * This component is responsible for rendering individual notifications into
 * a region.
 */
export function NotificationRegion(props: NotificationRegionProps) {
  const { state, onTransitionPendingChange } = props;
  const ref = React.useRef(null);
  const { regionProps } = useToastRegion(props, state, ref);
  /**
   * `visibleToasts` and `toast` are artifacts of react-stately and in
   * Easy UI `visibleToasts` is being treated as `visibleNotifications` and
   * similarly, `toast` here is being treated as a `notification`.
   */
  return (
    <div {...regionProps} ref={ref} className={styles.region}>
      <TransitionGroup component={null}>
        {state.visibleToasts.map((toast) => (
          <NotificationTransition
            key={toast.key}
            transitionKey={toast.key}
            onTransitionPendingChange={onTransitionPendingChange}
          >
            {({ nodeRef }) => (
              <Notification ref={nodeRef} toast={toast} state={state} />
            )}
          </NotificationTransition>
        ))}
      </TransitionGroup>
    </div>
  );
}
