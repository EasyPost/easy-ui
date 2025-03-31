import React, { Key, RefObject, useState, ReactNode, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import styles from "./NotificationTransition.module.scss";

type ChildrenFunction<T> = (args: T) => ReactNode;

export type NotificationTransitionProps = {
  children: ChildrenFunction<{ nodeRef: RefObject<HTMLDivElement> }>;
  transitionKey: Key;
  onTransitionPendingChange?: (isTransitionPending: boolean) => void;
};

export function NotificationTransition({
  children,
  transitionKey,
  onTransitionPendingChange = () => {},
  ...transitionGroupProps
}: NotificationTransitionProps) {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const transitionEndListener = useCallback((done: () => void) => {
    if (nodeRef.current) {
      nodeRef.current.addEventListener("transitionend", done, false);
    }
  }, []);
  return (
    <CSSTransition
      {...transitionGroupProps}
      key={transitionKey}
      appear={true}
      nodeRef={nodeRef}
      unmountOnExit
      addEndListener={transitionEndListener}
      classNames={{
        appear: styles.appear,
        appearActive: styles.appearActive,
        enter: styles.enter,
        enterActive: styles.enterActive,
        exit: styles.exit,
        exitActive: styles.exitActive,
      }}
      onEnter={() => {
        onTransitionPendingChange(true);
      }}
      onExited={() => {
        onTransitionPendingChange(false);
      }}
    >
      {children({ nodeRef })}
    </CSSTransition>
  );
}

/**
 * Track when a list of transitions are complete.
 */
export function useNotificationTransitionTracking() {
  const [transitionsPending, setTransitionsPending] = useState(0);
  const onTransitionPendingChange = (isTransitionPending: boolean) => {
    setTransitionsPending((prev) =>
      isTransitionPending ? prev + 1 : prev - 1,
    );
  };
  return {
    isTransitionPending: transitionsPending > 0,
    onTransitionPendingChange,
  };
}
