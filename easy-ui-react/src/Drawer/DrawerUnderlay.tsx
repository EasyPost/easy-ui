import React, { ReactNode } from "react";
import { Overlay, useModalOverlay } from "react-aria";
import { OverlayTriggerState } from "react-stately";
import { CSSTransition } from "react-transition-group";

import styles from "./Drawer.module.scss";

type DrawerUnderlayProps = {
  /**
   * Modal wrap content.
   */
  children: ReactNode;

  /**
   * Whether or not the modal is dismissable.
   */
  isDismissable?: boolean;

  /**
   * Handler that is called when the overlay's animation exits.
   */
  setAnimationExited: React.Dispatch<React.SetStateAction<boolean>>;

  /**
   * Modal state.
   */
  state: OverlayTriggerState;
};

export function DrawerUnderlay(props: DrawerUnderlayProps) {
  const { state, children, setAnimationExited, ...overlayProps } = props;
  const { isDismissable = true } = overlayProps;

  const ref = React.useRef<HTMLDivElement | null>(null);
  const underlayBgRef = React.useRef<HTMLDivElement | null>(null);
  const { modalProps, underlayProps } = useModalOverlay(
    {
      ...overlayProps,
      isDismissable: isDismissable,
      isKeyboardDismissDisabled: !isDismissable,
    },
    state,
    ref,
  );

  const createAnimationEndListener =
    (ref: React.MutableRefObject<HTMLDivElement | null>) =>
    (done: () => void) => {
      if (ref.current) {
        ref.current.addEventListener("transitionend", done, false);
      }
    };

  // Each layer's active class sets its open state. That makes the layer run its
  // own transition, and the transitionend from that transition finishes opening.
  // Without active classes, opening would wait for some other transition inside
  // the drawer to end, and the drawer would stay transparent and shifted to the
  // side until one did.
  return (
    <Overlay>
      <CSSTransition
        in={state.isOpen}
        appear
        onEntered={() => setAnimationExited(false)}
        onExited={() => setAnimationExited(true)}
        nodeRef={underlayBgRef}
        addEndListener={createAnimationEndListener(underlayBgRef)}
        classNames={{
          appear: styles.underlayBgEnter,
          appearActive: styles.underlayBgEnterDone,
          appearDone: styles.underlayBgEnterDone,
          enter: styles.underlayBgEnter,
          enterActive: styles.underlayBgEnterDone,
          enterDone: styles.underlayBgEnterDone,
          exit: styles.underlayBgExit,
        }}
      >
        <div
          ref={underlayBgRef}
          className={styles.underlayBg}
          {...underlayProps}
        >
          <CSSTransition
            in={state.isOpen}
            appear
            nodeRef={ref}
            addEndListener={createAnimationEndListener(ref)}
            classNames={{
              appear: styles.underlayBoxAppear,
              appearActive: styles.underlayBoxAppearDone,
              appearDone: styles.underlayBoxAppearDone,
              exit: styles.underlayBoxExit,
            }}
          >
            <div {...modalProps} ref={ref} className={styles.underlayBox}>
              {children}
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
    </Overlay>
  );
}
