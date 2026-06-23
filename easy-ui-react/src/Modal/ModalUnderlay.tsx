import React, { ReactNode, RefObject, useRef } from "react";
import {
  Overlay,
  useModalOverlay,
  useOverlay,
  usePreventScroll,
} from "react-aria";
import { DOMAttributes } from "@react-types/shared";
import { OverlayTriggerState } from "react-stately";
import { classNames } from "../utilities/css";
import { useModalTriggerContext } from "./context";

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

  /**
   * When `true`, the modal stops trapping focus and stops hiding the rest of
   * the page from assistive technologies (`aria-hidden`/`inert`). Use this only
   * for modals that intentionally host third-party overlays — e.g. Stripe
   * Link/autofill or reCAPTCHA — which render themselves into the document
   * *outside* the modal. react-aria's focus trap and `inert` would otherwise
   * blur and lock up those overlays. This trades away the modal's focus
   * containment and background hiding, so reach for it only when a third-party
   * overlay requires it.
   *
   * @default false
   */
  allowsThirdPartyOverlays?: boolean;
};

export function ModalUnderlay(props: ModalUnderlayProps) {
  // Branch into sibling components so each calls its hooks unconditionally.
  return props.allowsThirdPartyOverlays ? (
    <ThirdPartyOverlayUnderlay {...props} />
  ) : (
    <FocusTrappingUnderlay {...props} />
  );
}

/**
 * Standard modal behavior: traps focus and hides the rest of the page via
 * react-aria's `useModalOverlay` (which applies `aria-hidden`/`inert` outside
 * the modal).
 */
function FocusTrappingUnderlay(props: ModalUnderlayProps) {
  const { state, children, isDismissable = true } = props;

  const ref = useRef<HTMLDivElement>(null);
  const { modalProps, underlayProps } = useModalOverlay(
    {
      isDismissable,
      isKeyboardDismissDisabled: !isDismissable,
    },
    state,
    ref,
  );

  return (
    <ModalUnderlayContent
      modalProps={modalProps}
      underlayProps={underlayProps}
      modalRef={ref}
    >
      {children}
    </ModalUnderlayContent>
  );
}

/**
 * Like `FocusTrappingUnderlay`, but built from the lower-level overlay hooks so
 * it can omit the two behaviors that fight third-party overlays:
 * - no `ariaHideOutside`, so overlays injected outside the modal aren't
 *   `inert`'d (which would make them unclickable), and
 * - no forced focus containment, so focus can't be stolen back from them.
 *
 * `Overlay` still restores focus to the trigger when the modal closes.
 */
function ThirdPartyOverlayUnderlay(props: ModalUnderlayProps) {
  const { state, children, isDismissable = true } = props;

  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps, underlayProps } = useOverlay(
    {
      isOpen: state.isOpen,
      onClose: state.close,
      isDismissable,
      isKeyboardDismissDisabled: !isDismissable,
    },
    ref,
  );
  usePreventScroll({ isDisabled: !state.isOpen });

  return (
    <ModalUnderlayContent
      modalProps={overlayProps}
      underlayProps={underlayProps}
      modalRef={ref}
    >
      {children}
    </ModalUnderlayContent>
  );
}

type ModalUnderlayContentProps = {
  modalProps: DOMAttributes;
  underlayProps: DOMAttributes;
  modalRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

/**
 * Shared underlay markup for both underlay variants. The variants differ only
 * in which react-aria hooks produce `modalProps`/`underlayProps`.
 */
function ModalUnderlayContent({
  modalProps,
  underlayProps,
  modalRef,
  children,
}: ModalUnderlayContentProps) {
  const { hasOpenNestedModal } = useModalTriggerContext();

  const className = classNames(
    styles.underlayBg,
    hasOpenNestedModal && styles.underlayBgHidden,
  );

  return (
    <Overlay>
      <div className={className} {...underlayProps}>
        <div {...modalProps} ref={modalRef} className={styles.underlayBox}>
          <div className={styles.underlayEdge} />
          {children}
          <div className={styles.underlayEdge} />
        </div>
      </div>
    </Overlay>
  );
}
