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

type ModalUnderlayContentProps = {
  modalProps: DOMAttributes;
  underlayProps: DOMAttributes;
  modalRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;

  /**
   * Marks the modal box as a top layer so a surrounding Easy UI modal's
   * `ariaHideOutside` keeps it (and any third-party overlays it hosts) visible
   * and interactive instead of `inert`'ing it.
   */
  isTopLayer?: boolean;
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
 * close-on-interact-outside is preserved; react-aria already ignores clicks on
 * `[data-react-aria-top-layer]` elements, so a properly tagged third-party
 * overlay won't dismiss the modal.
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
      isTopLayer
    >
      {children}
    </ModalUnderlayContent>
  );
}

/**
 * Shared underlay markup for both underlay variants. The variants differ only
 * in which react-aria hooks produce `modalProps`/`underlayProps`.
 */
function ModalUnderlayContent({
  modalProps,
  underlayProps,
  modalRef,
  children,
  isTopLayer = false,
}: ModalUnderlayContentProps) {
  const { isNested, hasReplacingChild, selfNestingBehavior } =
    useModalTriggerContext();

  // A nested modal whose connection to this one resolved to `replace` hides this
  // modal entirely (tracked as `hasReplacingChild`), so only the topmost modal
  // is visible. When this modal's own connection to its parent resolves to
  // `stack-shared-backdrop`, it suppresses its own backdrop so only the lowest
  // modal's backdrop shows. `stack` does neither.
  const className = classNames(
    styles.underlayBg,
    hasReplacingChild && styles.underlayBgHidden,
    isNested &&
      selfNestingBehavior === "stack-shared-backdrop" &&
      styles.underlayBgNoBackdrop,
  );

  return (
    <Overlay>
      <div className={className} {...underlayProps}>
        <div
          {...modalProps}
          ref={modalRef}
          className={styles.underlayBox}
          // When this modal hosts third-party overlays, an outer Easy UI modal's
          // `ariaHideOutside` would otherwise `inert` this modal — making it
          // non-interactive and letting clicks fall through to the content
          // beneath, which dismisses it. Tagging the box as a top layer keeps it
          // (and its ancestors) visible and exempt from interact-outside, while
          // the untagged underlay still dismisses on a backdrop click.
          data-react-aria-top-layer={isTopLayer ? "true" : undefined}
        >
          <div className={styles.underlayEdge} />
          {children}
          <div className={styles.underlayEdge} />
        </div>
      </div>
    </Overlay>
  );
}
