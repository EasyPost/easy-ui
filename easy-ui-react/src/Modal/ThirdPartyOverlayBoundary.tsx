import * as React from "react";
import {
  UseThirdPartyOverlaysOptions,
  useThirdPartyOverlays,
} from "./useThirdPartyOverlays";

export type ThirdPartyOverlayBoundaryProps = {
  /** The `Modal` (or any subtree) hosting the third-party widget. */
  children: React.ReactNode;
} & Omit<UseThirdPartyOverlaysOptions, "ignoreWithin">;

/**
 * Declarative wrapper around {@link useThirdPartyOverlays}. Wrap a `Modal` with
 * it so a widget's body-level overlays stay interactive. Because `Modal` portals
 * its content out of this subtree, the boundary doesn't rely on a ref — the hook
 * tells inline widgets (inside the dialog) apart from escaped overlays
 * automatically, so it works wherever it sits relative to the modal.
 *
 * It can wrap a `Modal` directly (as the modal child of `Modal.Trigger` /
 * `ModalContainer`) or wrap the trigger/container itself — both work.
 */
export const ThirdPartyOverlayBoundary = ({
  children,
  selector,
  filter,
  minVisibleSizePx,
  ...injectedProps
}: ThirdPartyOverlayBoundaryProps) => {
  useThirdPartyOverlays({ selector, filter, minVisibleSizePx });

  // `Modal.Trigger` and `ModalContainer` clone their modal child to inject
  // overlay props onto it. When the boundary *is* that child — i.e. it wraps a
  // `Modal` directly — forward those injected props to the wrapped element so
  // the boundary stays transparent and the `Modal` receives exactly what it
  // would have without the wrapper.
  if (React.isValidElement(children) && Object.keys(injectedProps).length > 0) {
    return React.cloneElement(children, injectedProps);
  }

  return <>{children}</>;
};
