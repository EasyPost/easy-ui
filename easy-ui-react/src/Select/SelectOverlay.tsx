import React from "react";
import {
  DismissButton,
  Overlay,
  mergeProps,
  useListBox,
  usePopover,
} from "react-aria";
import { useInternalSelectContext } from "./SelectContext";
import { SelectOptionContent } from "./SelectOption";
import styles from "./Select.module.scss";
import {
  getUnmergedPopoverStyles,
  DEFAULT_PLACEMENT,
  DEFAULT_WIDTH,
  ITEM_HEIGHT,
  Y_PADDING_INSIDE_OVERLAY,
  OVERLAY_OFFSET,
  OVERLAY_PADDING_FROM_CONTAINER,
  DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
} from "../Menu/utilities";
import { useScrollbar } from "../utilities/useScrollbar";
import { SelectSectionContent } from "./SelectSection";

export function SelectOverlay() {
  const { selectState, triggerWidth } = useInternalSelectContext();

  if (!selectState.isOpen || triggerWidth === null) {
    return null;
  }
  return <SelectOverlayContent />;
}

function SelectOverlayContent() {
  const { selectState, triggerRef, listBoxPropsFromSelect, triggerWidth } =
    useInternalSelectContext();

  const popoverRef = React.useRef(null);
  const listBoxRef = React.useRef(null);

  const { popoverProps, underlayProps } = usePopover(
    {
      containerPadding: OVERLAY_PADDING_FROM_CONTAINER,
      maxHeight:
        ITEM_HEIGHT * DEFAULT_MAX_ITEMS_UNTIL_SCROLL +
        Y_PADDING_INSIDE_OVERLAY * 2 +
        2,
      offset: OVERLAY_OFFSET,
      placement: DEFAULT_PLACEMENT,
      popoverRef,
      scrollRef: listBoxRef,
      triggerRef,
    },
    selectState,
  );

  const { listBoxProps } = useListBox(
    listBoxPropsFromSelect,
    selectState,
    listBoxRef,
  );

  useScrollbar(listBoxRef, "ezui-os-theme-overlay");

  const style = {
    ...popoverProps.style,
    ...getUnmergedPopoverStyles(DEFAULT_WIDTH, triggerWidth),
  } as React.CSSProperties;

  return (
    <Overlay>
      <div {...underlayProps} className={styles.underlay} />
      <div
        {...mergeProps(popoverProps, { style })}
        ref={popoverRef}
        className={styles.listboxRoot}
      >
        <DismissButton onDismiss={selectState.close} />
        <div
          {...listBoxProps}
          ref={listBoxRef}
          className={styles.listbox}
          data-width={DEFAULT_WIDTH}
          data-max-items-until-scroll={DEFAULT_MAX_ITEMS_UNTIL_SCROLL}
          data-overlayscrollbars-initialize
        >
          <ul className={styles.listboxList}>
            {[...selectState.collection].map((item) => {
              return item.type === "section" ? (
                <SelectSectionContent
                  key={item.key}
                  section={item}
                  state={selectState}
                />
              ) : (
                <SelectOptionContent
                  key={item.key}
                  item={item}
                  state={selectState}
                />
              );
            })}
          </ul>
        </div>
        <DismissButton onDismiss={selectState.close} />
      </div>
    </Overlay>
  );
}
