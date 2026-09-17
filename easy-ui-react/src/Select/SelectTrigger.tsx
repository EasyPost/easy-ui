import React from "react";
import { useInternalSelectContext } from "./SelectContext";
import { SelectButton, SelectButtonProps } from "./SelectButton";

/**
 * The trigger only supplies content and appearance—the button's behavior comes
 * from the select's own context—so the props that drive behavior are left out.
 */
export type SelectTriggerProps = Pick<
  SelectButtonProps,
  | "size"
  | "isDisabled"
  | "hasError"
  | "iconAtStart"
  | "description"
  | "valueProps"
  | "children"
>;

export function SelectTrigger(props: SelectTriggerProps) {
  const { triggerProps, triggerRef, selectState } = useInternalSelectContext();

  // `triggerProps` spreads last so the wiring from `useSelect()`—the id the
  // value's `aria-labelledby` points at, the press and keyboard handlers—can't
  // be overwritten by a caller.
  return (
    <SelectButton
      {...props}
      {...triggerProps}
      ref={triggerRef}
      isOpen={selectState.isOpen}
    />
  );
}
