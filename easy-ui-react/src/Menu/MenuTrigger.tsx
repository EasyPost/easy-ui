import React, { ReactElement } from "react";
import { mergeProps } from "react-aria";
import { useInternalMenuContext } from "./MenuContext";

export type MenuTriggerProps = {
  /** The element that will activate the menu. */
  children: ReactElement;
};

export function MenuTrigger(props: MenuTriggerProps) {
  const { children } = props;
  const { triggerRef, menuTriggerProps } = useInternalMenuContext();
  const clonedProps = mergeProps(menuTriggerProps, children.props);
  return React.cloneElement(children, { ...clonedProps, ref: triggerRef });
}
