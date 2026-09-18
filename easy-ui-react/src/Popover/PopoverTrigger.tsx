import React, { ReactElement } from "react";
import { mergeProps } from "react-aria";
import { useInternalPopoverContext } from "./PopoverContext";

export type PopoverTriggerProps = {
  /**
   * The element that will open the popover.
   *
   * It must forward its ref to a focusable element and spread the props it
   * receives onto that element, since it's cloned with the props that open the
   * overlay. Easy UI's buttons—`<Button />`, `<DropdownButton />`,
   * `<IconButton />`, `<KebabButton />`, `<SelectButton />`,
   * `<UnstyledButton />`—all satisfy this, as does any component written the
   * same way.
   */
  children: ReactElement;
};

export function PopoverTrigger(props: PopoverTriggerProps) {
  const { children } = props;
  const { triggerProps, triggerRef } = useInternalPopoverContext();

  // The child's own props merge in rather than getting overwritten, so a
  // consumer's `onPress` still fires and their `className` survives alongside
  // the props that open the popover.
  const clonedProps = mergeProps(
    triggerProps,
    children.props as Record<string, unknown>,
  );

  return React.cloneElement(children as ReactElement<Record<string, unknown>>, {
    ...clonedProps,
    ref: triggerRef,
  });
}
