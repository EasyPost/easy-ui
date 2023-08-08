import React, { ReactNode } from "react";
import { Overlay, useModalOverlay } from "react-aria";
import { OverlayTriggerState } from "react-stately";

import styles from "./Modal.module.scss";

type ModalUnderlayProps = {
  /**
   * Modal state.
   */
  state: OverlayTriggerState;

  /**
   * Modal wrap content.
   */
  children: ReactNode;

  /**
   * Whether or not the modal is dismissable.
   */
  isDismissable?: boolean;
};

export function ModalUnderlay(props: ModalUnderlayProps) {
  const { state, children, ...overlayProps } = props;
  const { isDismissable = true } = overlayProps;

  const ref = React.useRef(null);
  const { modalProps, underlayProps } = useModalOverlay(
    {
      ...overlayProps,
      isDismissable: isDismissable,
      isKeyboardDismissDisabled: !isDismissable,
    },
    state,
    ref,
  );

  return (
    <Overlay>
      <div className={styles.underlayBg} {...underlayProps}>
        <div {...modalProps} ref={ref} className={styles.underlayBox}>
          <div className={styles.underlayEdge} />
          {children}
          <div className={styles.underlayEdge} />
        </div>
      </div>
    </Overlay>
  );
}
