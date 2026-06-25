import React, { ReactElement, cloneElement } from "react";
import { useOverlayTrigger } from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { ModalUnderlay } from "./ModalUnderlay";
import { ModalNestingBehavior, ModalTriggerProvider } from "./context";

export type CloseableModalElement = (close: () => void) => ReactElement;

export type ModalTriggerProps = {
  /**
   * Content of modal trigger. Must be exactly two elements.
   */
  children: [ReactElement, CloseableModalElement | ReactElement];

  /**
   * Whether the modal is open by default (uncontrolled).
   */
  defaultOpen?: boolean;

  /**
   * Whether or not the modal can be dismissed.
   *
   * @default true
   */
  isDismissable?: boolean;

  /**
   * Disables focus trapping and background aria-hiding so the modal can host
   * third-party overlays (e.g. Stripe Link/autofill, reCAPTCHA) that render
   * outside the modal. Use sparingly — see `ModalUnderlay` for the tradeoffs.
   *
   * @default false
   */
  allowsThirdPartyOverlays?: boolean;

  /**
   * Controls how this modal's nested children stack relative to it, and cascades
   * to descendant modals. `stack` gives each child its own backdrop,
   * `stack-shared-backdrop` makes children share this modal's backdrop, and
   * `replace` hides this modal while a child is open. When unset, it inherits the
   * nearest ancestor modal's value (or `stack` at the root).
   */
  childNestingBehavior?: ModalNestingBehavior;

  /**
   * Controls how this modal stacks relative to its parent, overriding the
   * parent's `childNestingBehavior` for just this modal. `stack` keeps both
   * backdrops, `stack-shared-backdrop` suppresses this modal's backdrop, and
   * `replace` hides the parent while this modal is open. Local to this modal — it
   * does not cascade. Useful for surgically changing one nested modal in a larger
   * tree without touching its parent.
   */
  selfNestingBehavior?: ModalNestingBehavior;

  /**
   * Whether the modal is open by default (controlled).
   */
  isOpen?: boolean;

  /**
   * Handler that is called when the overlay's open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
};

export function ModalTrigger(props: ModalTriggerProps) {
  const {
    children,
    isDismissable = true,
    allowsThirdPartyOverlays = false,
    childNestingBehavior,
    selfNestingBehavior,
    ...inTriggerProps
  } = props;

  const state = useOverlayTriggerState(inTriggerProps);
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: "dialog" },
    state,
  );

  if (children.length !== 2) {
    throw new Error(
      "children must be exactly one trigger element and one modal element",
    );
  }

  const [trigger, modal] = children;

  return (
    <ModalTriggerProvider
      state={state}
      isDismissable={isDismissable}
      childNestingBehavior={childNestingBehavior}
      selfNestingBehavior={selfNestingBehavior}
      allowsThirdPartyOverlays={allowsThirdPartyOverlays}
    >
      {cloneElement(trigger, triggerProps)}
      {state.isOpen && (
        <ModalUnderlay {...props} state={state}>
          {cloneElement(
            typeof modal === "function" ? modal(state.close) : modal,
            overlayProps,
          )}
        </ModalUnderlay>
      )}
    </ModalTriggerProvider>
  );
}
