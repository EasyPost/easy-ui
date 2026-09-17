import { FocusableElement } from "@react-types/shared";
import {
  DOMAttributes,
  MutableRefObject,
  createContext,
  useContext,
} from "react";
import { AriaButtonProps } from "react-aria";
import { OverlayTriggerState } from "react-stately";

type InternalPopoverContextType = {
  /** Open state shared by the trigger, the overlay, and `usePopoverTrigger`. */
  state: OverlayTriggerState;
  /** Props cloned onto the trigger's child. */
  triggerProps: AriaButtonProps;
  /** Element the overlay positions itself against. */
  triggerRef: MutableRefObject<HTMLElement | null>;
  /** Carries the id the trigger's `aria-controls` points at. */
  overlayProps: DOMAttributes<FocusableElement> & { id?: string };
};

export const InternalPopoverContext =
  createContext<InternalPopoverContextType | null>(null);

export function useInternalPopoverContext() {
  const popoverContext = useContext(InternalPopoverContext);
  if (!popoverContext) {
    throw new Error("InternalPopoverContext must be used inside a <Popover />");
  }
  return popoverContext;
}

type InternalPopoverOverlayContextType = {
  /**
   * Id the dialog's `aria-labelledby` points at, for `<Popover.Title />` to
   * claim. Nothing renders it when there's no title, in which case the name
   * comes from `aria-label` instead.
   */
  titleId: string;
  /** The scrolling region, which is `<Popover.Body />`. */
  bodyRef: MutableRefObject<HTMLDivElement | null>;
};

export const InternalPopoverOverlayContext =
  createContext<InternalPopoverOverlayContextType | null>(null);

export function useInternalPopoverOverlayContext() {
  const overlayContext = useContext(InternalPopoverOverlayContext);
  if (!overlayContext) {
    throw new Error(
      "InternalPopoverOverlayContext must be used inside a <Popover.Overlay />",
    );
  }
  return overlayContext;
}

/**
 * Returns the state of the nearest enclosing `<Popover />`, for closing it from
 * content inside the overlay.
 *
 * @example
 * ```tsx
 * function SaveButton() {
 *   const { close } = usePopoverTrigger();
 *   return <Button onPress={close}>Save</Button>;
 * }
 * ```
 */
export const usePopoverTrigger = () => {
  return useInternalPopoverContext().state;
};
