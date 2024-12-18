import React, { ReactNode, MutableRefObject } from "react";
import {
  AriaDialogProps,
  DismissButton,
  Overlay,
  usePopover,
} from "react-aria";

import {
  DEFAULT_PLACEMENT,
  OVERLAY_OFFSET,
  OVERLAY_PADDING_FROM_CONTAINER,
} from "../Menu/utilities";
import styles from "./DatePicker.module.scss";
import { DatePickerState, DateRangePickerState } from "react-stately";

type DatePickerOverlayProps = {
  children: ReactNode;
  triggerRef: MutableRefObject<null>;
  dialogProps: AriaDialogProps;
  state: DatePickerState | DateRangePickerState;
};

export function DatePickerOverlay(props: DatePickerOverlayProps) {
  const { state } = props;
  if (!state.isOpen) {
    return null;
  }

  return <DatePickerContent {...props} />;
}

function DatePickerContent(props: DatePickerOverlayProps) {
  const { children, triggerRef, dialogProps, state } = props;

  const popoverRef = React.useRef(null);

  const { popoverProps, underlayProps } = usePopover(
    {
      containerPadding: OVERLAY_PADDING_FROM_CONTAINER,
      offset: OVERLAY_OFFSET,
      placement: DEFAULT_PLACEMENT,
      popoverRef,
      triggerRef,
    },
    state,
  );

  return (
    <Overlay>
      <div {...underlayProps} className={styles.underlay} />
      <div {...popoverProps} ref={popoverRef} className={styles.popover}>
        <DismissButton onDismiss={state.close} />
        <div {...dialogProps} className={styles.dialog}>
          {children}
        </div>
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}
