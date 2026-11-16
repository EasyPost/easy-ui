import { useIsomorphicLayoutEffect } from "../utilities/react";
import { useModalTriggerContext } from "./context";

/**
 * Relaxes the surrounding modal's focus trap and background hiding while
 * `isOpen` is `true`, so a third-party overlay opened from inside the modal
 * (e.g. Stripe's Financial Connections frame) stays usable.
 *
 * @remarks
 * Use this when a modal only needs to host a third-party overlay for part of its
 * lifetime. Unlike `allowsThirdPartyOverlays`, which is fixed when the modal
 * renders, this can switch on and off while the modal is open without
 * remounting its content. While `isOpen` is `true`, the nearest modal and every
 * focus-trapping modal above it stop trapping focus and stop hiding the page
 * (`aria-hidden`/`inert`). Closing on Escape or on interaction outside, scroll
 * locking, and restoring focus on close are unchanged.
 *
 * Must be called from within a `<Modal />`.
 *
 * @param isOpen - Whether the third-party overlay is currently open.
 */
export function useThirdPartyOverlay(isOpen: boolean) {
  const { registerThirdPartyOverlay } = useModalTriggerContext();

  // Layout effect so the modal relaxes before the browser paints the overlay,
  // matching how nested modals register in `useModalNesting`.
  useIsomorphicLayoutEffect(() => {
    if (!isOpen) {
      return;
    }
    return registerThirdPartyOverlay();
  }, [isOpen, registerThirdPartyOverlay]);
}
