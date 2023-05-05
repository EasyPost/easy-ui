import { MutableRefObject, createContext, useContext } from "react";
import { AriaButtonProps, AriaMenuOptions } from "react-aria";
import { MenuTriggerState } from "react-stately";

type InternalMenuContextType = {
  triggerWidth: number | null;
  triggerRef: MutableRefObject<HTMLElement | null>;
  menuTriggerProps: AriaButtonProps;
  menuTriggerState: MenuTriggerState;
  menuPropsFromTrigger: AriaMenuOptions<unknown>;
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
