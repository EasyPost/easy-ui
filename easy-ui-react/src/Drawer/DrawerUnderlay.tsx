import React, { ReactNode } from "react";
import { Overlay, useModalOverlay } from "react-aria";
import { OverlayTriggerState } from "react-stately";

import styles from "./Drawer.module.scss";

type DrawerUnderlayProps = {
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

export function DrawerUnderlay(props: DrawerUnderlayProps) {
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
          {children}
        </div>
      </div>
    </Overlay>
  );
}
