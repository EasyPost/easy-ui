import React, { ReactNode, RefObject, useEffect, useRef } from "react";
import { Overlay, useOverlay, usePreventScroll } from "react-aria";
// `react-aria` doesn't re-export `ariaHideOutside`; the relaxable variant calls
// it directly so it can gate page-hiding on an open third-party descendant.
import { ariaHideOutside } from "@react-aria/overlays";
import { DOMAttributes } from "@react-types/shared";
import { OverlayTriggerState } from "react-stately";
import { classNames } from "../utilities/css";
import { useModalTriggerContext } from "./context";

import styles from "./Modal.module.scss";

// Marks every Easy UI modal box. A modal ignores interact-outside events that
// land inside another (nested) Easy UI modal's box, so opening or clicking a
// nested modal never dismisses the one beneath it. Backdrop clicks land outside
// the box and still dismiss.
const MODAL_BOX_ATTRIBUTE = "data-easy-ui-modal-box";

function shouldCloseOnInteractOutside(target: Element) {
  return !target.closest(`[${MODAL_BOX_ATTRIBUTE}]`);
}

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
   * Keeps this modal box visible when a surrounding Easy UI modal's
   * `ariaHideOutside` would otherwise `inert` it. Needed by the third-party
   * variant, which doesn't run `ariaHideOutside` itself.
   */
  keepVisibleUnderModal?: boolean;

  /**
   * Drives focus containment on the underlay's `Overlay`. The standard variant
   * toggles this as a third-party descendant opens and closes; the third-party
   * variant leaves it at its default (it never contains focus).
   */
  shouldContainFocus?: boolean;
};

export function ModalUnderlay(props: ModalUnderlayProps) {
  // Branch into sibling components so each calls its hooks unconditionally. The
  // branch keys off the stable `allowsThirdPartyOverlays` prop only, so a modal
  // never swaps variants at runtime (which would remount its children — and any
  // third-party overlay).
  return props.allowsThirdPartyOverlays ? (
    <ThirdPartyOverlayUnderlay {...props} />
  ) : (
    <FocusTrappingUnderlay {...props} />
  );
}

/**
 * Standard modal behavior: traps focus and hides the rest of the page
 * (`aria-hidden`/`inert`). It reproduces `useModalOverlay` from the lower-level
 * hooks rather than calling it directly so both behaviors can be toggled off in
 * place — no remount — while an `allowsThirdPartyOverlays` descendant is open.
 *
 * That relaxation is automatic and necessary: react-aria keeps only the
 * *topmost* `ariaHideOutside` observer active, and a third-party descendant uses
 * `useOverlay` (no `ariaHideOutside`), so it never takes that observer over. Left
 * trapping, this modal's observer would `inert` the descendant's injected
 * overlay (e.g. Stripe Link) and its focus trap would steal focus back. Skipping
 * `ariaHideOutside` also tears down this modal's observer so an outer ancestor's
 * observer (if any) takes back over — every focus-trapping ancestor relaxes in
 * turn. With no third-party descendant open (`shouldTrap` true), this is
 * behaviorally identical to `useModalOverlay`.
 */
function FocusTrappingUnderlay(props: ModalUnderlayProps) {
  const { state, children, isDismissable = true } = props;
  const { hasOpenThirdPartyDescendant } = useModalTriggerContext();
  const shouldTrap = !hasOpenThirdPartyDescendant;

  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps, underlayProps } = useOverlay(
    {
      isOpen: state.isOpen,
      onClose: state.close,
      isDismissable,
      isKeyboardDismissDisabled: !isDismissable,
      shouldCloseOnInteractOutside,
    },
    ref,
  );
  usePreventScroll({ isDisabled: !state.isOpen });

  // Mirror `useModalOverlay`'s page-hiding, but only while trapping.
  useEffect(() => {
    if (state.isOpen && shouldTrap && ref.current) {
      return ariaHideOutside([ref.current], { shouldUseInert: true });
    }
  }, [state.isOpen, shouldTrap]);

  return (
    <ModalUnderlayContent
      modalProps={overlayProps}
      underlayProps={underlayProps}
      modalRef={ref}
      shouldContainFocus={shouldTrap}
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
      shouldCloseOnInteractOutside,
    },
    ref,
  );
  usePreventScroll({ isDisabled: !state.isOpen });

  return (
    <ModalUnderlayContent
      modalProps={overlayProps}
      underlayProps={underlayProps}
      modalRef={ref}
      keepVisibleUnderModal
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
  keepVisibleUnderModal = false,
  shouldContainFocus = false,
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
    <Overlay shouldContainFocus={shouldContainFocus}>
      <div className={className} {...underlayProps}>
        <div
          {...modalProps}
          ref={modalRef}
          className={styles.underlayBox}
          // Marks this as an Easy UI modal box so a surrounding Easy UI modal's
          // interact-outside ignores clicks inside it (see
          // `shouldCloseOnInteractOutside`): opening or clicking a nested modal
          // won't dismiss the one beneath, while backdrop clicks still do.
          {...{ [MODAL_BOX_ATTRIBUTE]: "true" }}
          // Modals that host third-party overlays don't run `ariaHideOutside`
          // themselves, so a surrounding standard modal would otherwise `inert`
          // this one. `data-live-announcer` is honored by react-aria's
          // `ariaHideOutside` to keep an element visible — and, unlike
          // `data-react-aria-top-layer`, it does NOT make react-aria treat clicks
          // inside this modal as "not outside," so nested overlays (e.g. Select)
          // still dismiss correctly.
          data-live-announcer={keepVisibleUnderModal ? "true" : undefined}
        >
          <div className={styles.underlayEdge} />
          {children}
          <div className={styles.underlayEdge} />
        </div>
      </div>
    </Overlay>
  );
}
