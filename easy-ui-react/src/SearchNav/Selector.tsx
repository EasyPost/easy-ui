import React, { useMemo } from "react";
import { useSelectState } from "react-stately";
import { AriaSelectProps, useSelect } from "react-aria";
import { BaseSelectProps } from "../Select";
import { InternalSelectContext } from "../Select/SelectContext";
import { SelectOverlay } from "../Select/SelectOverlay";
import { useTriggerWidth } from "../Menu/useTriggerWidth";
import { SelectorTrigger } from "./SelectorTrigger";

export type SelectorProps<T> = AriaSelectProps<T> &
  BaseSelectProps<T> & {
    /**
     * aria-label that applies to expanded <SearchNav.Select> and
     * to <Menu.Section> when <SearchNav> collapses.
     */
    "aria-label": string;
  };

export function Selector<T extends object>(props: SelectorProps<T>) {
  const triggerRef = React.useRef(null);
  const selectState = useSelectState(props);
  const { "aria-label": label } = props;

  const {
    valueProps,
    triggerProps,
    menuProps: listBoxPropsFromSelect,
  } = useSelect(props, selectState, triggerRef);

  const triggerWidth = useTriggerWidth(triggerRef);

  const context = useMemo(() => {
    return {
      triggerProps,
      listBoxPropsFromSelect,
      triggerRef,
      selectState,
      triggerWidth,
    };
  }, [triggerProps, listBoxPropsFromSelect, selectState, triggerWidth]);

  return (
    <InternalSelectContext.Provider value={context}>
      <SelectorTrigger valueProps={valueProps} label={label} />
      <SelectOverlay />
    </InternalSelectContext.Provider>
  );
}

Selector.displayName = "SearchNav.Selector";
