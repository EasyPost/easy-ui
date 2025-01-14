import React, { ReactNode, RefObject } from "react";
import {
  ListBox,
  ListBoxItem,
  ListBoxItemProps,
  Popover,
} from "react-aria-components";
import { AsyncListData } from "react-stately";
import { MenuOverlayProps } from "../Menu/MenuOverlay";
import {
  DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
  getMenuPopoverMaxHeight,
  ITEM_HEIGHT,
  Y_PADDING_INSIDE_OVERLAY,
} from "../Menu/utilities";
import { Spinner } from "../Spinner";
import { Text, TextProps } from "../Text";
import { getComponentToken, pxToRem } from "../utilities/css";
import { useScrollbar } from "../utilities/useScrollbar";
import { Item } from "./MultiSelect";

import styles from "./MultiSelectDropdown.module.scss";

type MultiSelectDropdownProps<T extends object> = {
  children: React.ReactNode | ((item: T) => React.ReactNode);
  isLoading?: AsyncListData<T>["isLoading"];
  maxItemsUntilScroll?: MenuOverlayProps<T>["maxItemsUntilScroll"];
  menuRef: RefObject<HTMLDivElement>;
  triggerRef: RefObject<HTMLDivElement>;
  width: number;
};

type MultiSelectDropdownOptionProps = {
  children: React.ReactNode;
} & ListBoxItemProps;

export function MultiSelectDropdown<T extends Item>(
  props: MultiSelectDropdownProps<T>,
) {
  const {
    children,
    maxItemsUntilScroll = DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
    isLoading,
    triggerRef,
    menuRef,
    width,
  } = props;

  const style = {
    width,
    ...getComponentToken("menu", "item_height", `${pxToRem(ITEM_HEIGHT)}rem`),
    ...getComponentToken(
      "menu",
      "padding.y",
      `${pxToRem(Y_PADDING_INSIDE_OVERLAY)}rem`,
    ),
  };

  return (
    <Popover
      isNonModal
      className={styles.popover}
      style={style}
      triggerRef={triggerRef}
      scrollRef={menuRef}
      trigger="ComboBox"
      maxHeight={getMenuPopoverMaxHeight({ maxItemsUntilScroll })}
    >
      {isLoading ? (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}>
            <Spinner isIndeterminate aria-label="Loading" size="sm" />
          </div>
        </div>
      ) : (
        <ScrollContainer scrollRef={menuRef}>
          <ListBox
            renderEmptyState={() => (
              <div className={styles.listEmptyState}>
                <Text variant="subtitle2" color="neutral.400">
                  No results found
                </Text>
              </div>
            )}
            selectionMode="multiple"
          >
            {children}
          </ListBox>
        </ScrollContainer>
      )}
    </Popover>
  );
}

export function MultiSelectDropdownOption(
  props: MultiSelectDropdownOptionProps,
) {
  return <ListBoxItem {...props} className={styles.option} />;
}

export function MultiSelectDropdownOptionText(props: TextProps) {
  return <Text variant="body1" {...props} />;
}

function ScrollContainer({
  scrollRef,
  children,
}: {
  scrollRef: RefObject<HTMLDivElement>;
  children: ReactNode;
}) {
  useScrollbar(scrollRef, "ezui-os-theme-overlay");
  return (
    <div className={styles.menu} ref={scrollRef}>
      {children}
    </div>
  );
}
