import React from "react";
import { createPortal } from "react-dom";
import { NotificationRegion } from "./NotificationRegion";
import {
  NotificationInternalState,
  NotificationPosition,
  NotificationOffset,
} from "./Notification";
import style from "./Notification.module.scss";

export type NotificationContainerProps = {
  /** Callback function that retrieves HTMLElement where notifications will render to */
  getContainer?: () => HTMLElement | null;
  /** Position type */
  position?: NotificationPosition;
  /** Position placement */
  offset?: NotificationOffset;
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
  const { getContainer = null, position = "fixed", offset, state } = props;

  const showNotifications = state.visibleToasts.length > 0;
  let requestFailed = false;
  let container = null;
  if (showNotifications && getContainer) {
    container = getContainer();
    requestFailed = container === null;
  }

  const positionStyleProps =
    offset && !requestFailed
      ? {
          top: offset?.top,
          right: offset?.right,
          bottom: offset?.bottom,
          left: offset?.left,
        }
      : {
          top: 0,
          left: 0,
        };
  const positionProps = {
    position: !requestFailed ? position : "fixed",
  };

  const containerStyles = {
    ...positionStyleProps,
    ...positionProps,
  } as React.CSSProperties;

  return (
    <>
      {/** visibleToasts` is an artifact of react-stately */}
      {showNotifications
        ? createPortal(
            <div className={style.container} style={containerStyles}>
              <NotificationRegion state={state} />
            </div>,
            container ?? document.body,
          )
        : null}
    </>
  );
}
