import React from "react";
import { createPortal } from "react-dom";
import { NotificationRegion } from "./NotificationRegion";
import { useNotification, NotificationPositionOffset } from "./Notification";
import style from "./Notification.module.scss";

export type NotificationContainerProps = {
  /** Notification placement offset */
  notificationPlacementOffset?: NotificationPositionOffset;
};

/**
 * @privateRemarks
 * This component serves as a wrapper around the NotificationRegion component.
 * It handles the logic to render notifications into a portal and positional
 * styles.
 */
export function NotificationContainer(props: NotificationContainerProps) {
  const { notificationPlacementOffset = null } = props;
  const { notification } = useNotification();
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
      {notification.visibleToasts.length > 0
        ? createPortal(
            <div
              className={style.notificationContainer}
              style={positionStyleProps}
            >
              <NotificationRegion notification={notification} />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
