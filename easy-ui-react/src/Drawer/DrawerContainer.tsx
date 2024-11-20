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
import { DrawerUnderlay } from "./DrawerUnderlay";
import { DrawerTriggerContext } from "./context";

type DrawerContainerProps = {
  /**
   * Drawer wrap content.
   */
  children: ReactNode;

  /**
   * Whether or not the drawer is dismissable.
   */
  isDismissable?: boolean;

  /**
   * Handler that is called when the overlay is closed.
   */
  onDismiss?: () => void;
};

export function DrawerContainer(props: DrawerContainerProps) {
  const { children, isDismissable = true, onDismiss = () => {} } = props;

  const existingDrawerTriggerContext = useContext(DrawerTriggerContext);
  if (existingDrawerTriggerContext) {
    throw new Error(
      "Drawer.Container must be used outside of a Drawer.Trigger",
    );
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
    <DrawerTriggerContext.Provider value={context}>
      {state.isOpen && (
        <DrawerUnderlay state={state} isDismissable={isDismissable}>
          {lastChild ? cloneElement(lastChild, overlayProps) : null}
        </DrawerUnderlay>
      )}
    </DrawerTriggerContext.Provider>
  );
}
