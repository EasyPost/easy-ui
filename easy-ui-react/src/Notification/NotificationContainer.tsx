import React from "react";
import { createPortal } from "react-dom";
import { NotificationRegion } from "./NotificationRegion";
import {
  NotificationInternalState,
  NotificationPositionType,
  NotificationPositionPlacement,
} from "./Notification";
import style from "./Notification.module.scss";

export type NotificationContainerProps = {
  /** HTML ID of element where notifications will render to */
  htmlId?: string;
  /** Position type */
  positionType?: NotificationPositionType;
  /** Position placement */
  positionPlacement?: NotificationPositionPlacement;
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
  const { htmlId, positionType = "fixed", positionPlacement, state } = props;
  const positionStyleProps = positionPlacement
    ? {
        top: positionPlacement?.top,
        right: positionPlacement?.right,
        bottom: positionPlacement?.bottom,
        left: positionPlacement?.left,
      }
    : {
        top: 0,
        left: 0,
      };
  const positionTypeProps = {
    position: positionType,
  };

  const containerStyles = {
    ...positionStyleProps,
    ...positionTypeProps,
  } as React.CSSProperties;

  let container = null;
  if (state.visibleToasts.length > 0 && htmlId) {
    container = document.getElementById(htmlId);
  }

  return (
    <>
      {/** visibleToasts` is an artifact of react-stately */}
      {state.visibleToasts.length > 0
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
