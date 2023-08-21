import React, { ReactElement, cloneElement, useContext, useMemo } from "react";
import { useOverlayTrigger } from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { CloseableModalElement } from "./ModalTrigger";
import { ModalUnderlay } from "./ModalUnderlay";
import { ModalTriggerContext } from "./context";

type ModalContainerProps = {
  /**
   * Modal wrap content.
   */
  children: CloseableModalElement | ReactElement | null | undefined | false;

  /**
   * Whether or not the modal is dismissable.
   */
  isDismissable?: boolean;

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
  const { children, isDismissable = true, onDismiss = () => {} } = props;

  const existingModalTriggerContext = useContext(ModalTriggerContext);
  if (existingModalTriggerContext) {
    throw new Error("Modal.Container must be used outside of a Modal.Trigger");
  }

  const state = useOverlayTriggerState({
    isOpen: Boolean(children),
    onOpenChange: (isOpen) => {
      if (!isOpen) {
        onDismiss();
      }
    },
  });
  const { overlayProps } = useOverlayTrigger({ type: "dialog" }, state);

  const context = useMemo(() => {
    return { state, isDismissable };
  }, [state, isDismissable]);

  return (
    <ModalTriggerContext.Provider value={context}>
      {state.isOpen && (
        <ModalUnderlay state={state} isDismissable={isDismissable}>
          {children
            ? typeof children === "function"
              ? children(state.close)
              : cloneElement(children, overlayProps)
            : null}
        </ModalUnderlay>
      )}
    </ModalTriggerContext.Provider>
  );
}
