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
 */
export const ThirdPartyOverlayBoundary = ({
  children,
  selector,
  filter,
  minVisibleSizePx,
}: ThirdPartyOverlayBoundaryProps) => {
  useThirdPartyOverlays({ selector, filter, minVisibleSizePx });
  return <>{children}</>;
};
