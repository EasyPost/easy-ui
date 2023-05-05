import { MutableRefObject, createContext, useContext } from "react";
import { AriaButtonProps, AriaMenuOptions } from "react-aria";
import { MenuTriggerState } from "react-stately";

type InternalMenuContextType = {
  menuPropsFromTrigger: AriaMenuOptions<unknown>;
  menuTriggerProps: AriaButtonProps;
  menuTriggerState: MenuTriggerState;
  triggerRef: MutableRefObject<HTMLElement | null>;
  triggerWidth: number | null;
};

export const InternalMenuContext =
  createContext<InternalMenuContextType | null>(null);

export function useInternalMenuContext() {
  const menuContext = useContext(InternalMenuContext);
  if (!menuContext) {
    throw new Error("Must be inside a Menu");
  }
  return menuContext;
}
