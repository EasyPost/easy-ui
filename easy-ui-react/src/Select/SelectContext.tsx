import { MutableRefObject, createContext, useContext } from "react";
import { SelectState } from "react-stately";
import { AriaButtonProps, AriaListBoxOptions } from "react-aria";

type InternalSelectContextType = {
  triggerProps: AriaButtonProps;
  listBoxPropsFromSelect: AriaListBoxOptions<unknown>;
  triggerRef: MutableRefObject<null>;
  selectState: SelectState<unknown>;
  triggerWidth: number | null;
};

export const InternalSelectContext =
  createContext<InternalSelectContextType | null>(null);

export function useInternalSelectContext() {
  const selectContext = useContext(InternalSelectContext);
  if (!selectContext) {
    throw new Error("InternalSelectContext must be used inside a <Select />");
  }
  return selectContext;
}
