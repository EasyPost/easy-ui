import React, {
  ReactElement,
  ReactNode,
  cloneElement,
  useContext,
  useMemo,
  useState,
} from "react";
import { useOverlayTrigger } from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { ModalUnderlay } from "./ModalUnderlay";
import { ModalTriggerContext } from "./context";

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

  const context = useMemo(() => {
    return { state, isDismissable };
  }, [state, isDismissable]);

  return (
    <ModalTriggerContext.Provider value={context}>
      {state.isOpen && (
        <ModalUnderlay state={state} isDismissable={isDismissable}>
          {lastChild ? cloneElement(lastChild, overlayProps) : null}
        </ModalUnderlay>
      )}
    </ModalTriggerContext.Provider>
  );
}
