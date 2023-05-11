import React, { ReactElement } from "react";
import { useInternalMenuContext } from "./MenuContext";

export type MenuTriggerProps = {
  /** The element that will activate the menu. */
  children: ReactElement;
};

export function MenuTrigger(props: MenuTriggerProps) {
  const { children } = props;
  const { triggerRef, menuTriggerProps } = useInternalMenuContext();
  return React.cloneElement(children, { ...menuTriggerProps, ref: triggerRef });
}
