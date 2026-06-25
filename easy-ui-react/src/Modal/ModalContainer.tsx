import React, { ReactElement, ReactNode, cloneElement, useState } from "react";
import { useOverlayTrigger } from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { ModalUnderlay } from "./ModalUnderlay";
import { ModalNestingBehavior, ModalTriggerProvider } from "./context";

type ModalContainerProps = {
  /**
   * Modal wrap content.
   */
  children: ReactNode;

  /**
   * Whether or not the modal is dismissable.
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
   * Handler that is called when the overlay is closed.
   */
  onDismiss?: () => void;
};

/**
 * Represents a container for `<Modal />`s.
 *
 * @remarks
 * A `<ModalContainer />` accepts a single Modal as a child, and manages
 * showing and hiding it in a modal. Useful in cases where there is no trigger
 * element or when the trigger unmounts while the modal is open.
 */
export function ModalContainer(props: ModalContainerProps) {
  const {
    children,
    isDismissable = true,
    allowsThirdPartyOverlays = false,
    childNestingBehavior,
    selfNestingBehavior,
    onDismiss = () => {},
  } = props;

  const childArray = React.Children.toArray(children);
  if (childArray.length > 1) {
    throw new Error("Only a single child can be passed to ModalContainer.");
  }

  const [lastChild, setLastChild] = useState<ReactElement | null>(null);

  // React.Children.toArray mutates the children, and we need them to be stable
  // between renders so that the lastChild comparison works.
  let child = null;
  if (Array.isArray(children)) {
    child = children.find(React.isValidElement);
  } else if (React.isValidElement(children)) {
    child = children;
  }

  if (child && child !== lastChild) {
    setLastChild(child);
  }

  const state = useOverlayTriggerState({
    isOpen: Boolean(child),
    onOpenChange: (isOpen) => {
      if (!isOpen) {
        onDismiss();
      }
    },
  });
  const { overlayProps } = useOverlayTrigger({ type: "dialog" }, state);

  return (
    <ModalTriggerProvider
      state={state}
      isDismissable={isDismissable}
      childNestingBehavior={childNestingBehavior}
      selfNestingBehavior={selfNestingBehavior}
      allowsThirdPartyOverlays={allowsThirdPartyOverlays}
    >
      {state.isOpen && (
        <ModalUnderlay
          state={state}
          isDismissable={isDismissable}
          allowsThirdPartyOverlays={allowsThirdPartyOverlays}
        >
          {lastChild ? cloneElement(lastChild, overlayProps) : null}
        </ModalUnderlay>
      )}
    </ModalTriggerProvider>
  );
}
