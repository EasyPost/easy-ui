import { CollectionChildren, Key } from "@react-types/shared";
import React from "react";
import {
  DismissButton,
  Overlay,
  Placement,
  mergeProps,
  useMenu,
  usePopover,
} from "react-aria";
import { useTreeState } from "react-stately";
import { ResponsiveProp } from "../utilities/css";
import { useScrollbar } from "../utilities/useScrollbar";
import { useInternalMenuContext } from "./MenuContext";
import { MenuItemContent } from "./MenuItem";
import { MenuSectionContent } from "./MenuSection";
import {
  DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
  DEFAULT_PLACEMENT,
  DEFAULT_WIDTH,
  ITEM_HEIGHT,
  OVERLAY_OFFSET,
  OVERLAY_PADDING_FROM_CONTAINER,
  Y_PADDING_INSIDE_OVERLAY,
  getUnmergedPopoverStyles,
} from "./utilities";

import styles from "./Menu.module.scss";

export type MenuOverlayWidth =
  | "auto"
  | "fit-content"
  | ResponsiveProp<string | number>;

export type MenuOverlayProps<T> = {
  /** The contents of the menu. */
  children: CollectionChildren<T>;

  /** The item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with. */
  disabledKeys?: Iterable<Key>;

  /** Number of menu items to show before menu scrolls. */
  maxItemsUntilScroll?: number;

  /** Handler that is called when an item is selected. */
  onAction?: (key: Key) => void;

  /** Handler that is called when the menu should close after selecting an item. */
  onClose?: () => void;

  /**
   * The placement of the element with respect to its anchor element.
   * @default bottom
   */
  placement?: Placement;

  /**
   * The width of the menu overlay.
   * @default auto
   */
  width?: MenuOverlayWidth;
};

export function MenuOverlay<T extends object>(props: MenuOverlayProps<T>) {
  const { menuTriggerState, triggerWidth } = useInternalMenuContext();
  if (!menuTriggerState.isOpen || triggerWidth === null) {
    return null;
  }
  return <MenuOverlayContent {...props} />;
}

function MenuOverlayContent<T extends object>(props: MenuOverlayProps<T>) {
  const {
    children,
    disabledKeys,
    maxItemsUntilScroll = DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
    onAction,
    onClose,
    placement = DEFAULT_PLACEMENT,
    width = DEFAULT_WIDTH,
  } = props;

  const popoverRef = React.useRef(null);
  const menuRef = React.useRef(null);

  const menuTreeState = useTreeState({
    children,
    disabledKeys,
  });

  const { menuTriggerState, triggerRef, triggerWidth, menuPropsFromTrigger } =
    useInternalMenuContext();

  const { popoverProps, underlayProps } = usePopover(
    {
      containerPadding: OVERLAY_PADDING_FROM_CONTAINER,
      maxHeight:
        ITEM_HEIGHT * maxItemsUntilScroll + Y_PADDING_INSIDE_OVERLAY * 2 + 2,
      offset: OVERLAY_OFFSET,
      placement,
      popoverRef,
      scrollRef: menuRef,
      triggerRef,
    },
    menuTriggerState,
  );

  const { menuProps } = useMenu(
    mergeProps({ disabledKeys, onAction, onClose }, menuPropsFromTrigger),
    menuTreeState,
    menuRef,
  );

  useScrollbar(menuRef, "ezui-os-theme-overlay");

  const style = {
    ...popoverProps.style,
    ...getUnmergedPopoverStyles(width, triggerWidth),
  } as React.CSSProperties;

  return (
    <Overlay>
      <div {...underlayProps} className={styles.underlay} />
      <div
        {...mergeProps(popoverProps, { style })}
        ref={popoverRef}
        className={styles.root}
      >
        <DismissButton onDismiss={menuTriggerState.close} />
        <div
          {...menuProps}
          ref={menuRef}
          className={styles.menu}
          data-width={width}
          data-max-items-until-scroll={maxItemsUntilScroll}
          data-overlayscrollbars-initialize
        >
          <ul className={styles.menuList}>
            {[...menuTreeState.collection].map((item) => {
              return item.type === "section" ? (
                <MenuSectionContent
                  key={item.key}
                  section={item}
                  state={menuTreeState}
                />
              ) : (
                <MenuItemContent
                  key={item.key}
                  item={item}
                  state={menuTreeState}
                />
              );
            })}
          </ul>
        </div>
        <DismissButton onDismiss={menuTriggerState.close} />
      </div>
    </Overlay>
  );
}
