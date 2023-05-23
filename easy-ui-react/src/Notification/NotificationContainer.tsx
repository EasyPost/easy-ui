import React from "react";
import { createPortal } from "react-dom";
import { NotificationRegion } from "./NotificationRegion";
import {
  NotificationPlacementOffset,
  NotificationInternalState,
} from "./Notification";
import style from "./Notification.module.scss";

export type NotificationContainerProps = {
  /** Notification placement offset */
  notificationPlacementOffset?: NotificationPlacementOffset;
  /**
   * Holds the internal state for notifications and the functions that directly
   * interact with the queue object. Consumers do not see this state.
   */
  state: NotificationInternalState;
};

/**
 * @privateRemarks
 * This component serves as a wrapper around the NotificationRegion component.
 * It handles the logic to render notifications into a portal and positional
 * styles.
 */
export function NotificationContainer(props: NotificationContainerProps) {
  const { notificationPlacementOffset = null, state } = props;
  const positionStyleProps = notificationPlacementOffset
    ? {
        top: notificationPlacementOffset?.top,
        right: notificationPlacementOffset?.right,
        bottom: notificationPlacementOffset?.bottom,
        left: notificationPlacementOffset?.left,
      }
    : undefined;
  return (
    <>
      {/** visibleToasts` is an artifact of react-stately */}
      {state.visibleToasts.length > 0
        ? createPortal(
            <div className={style.container} style={positionStyleProps}>
              <NotificationRegion state={state} />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
