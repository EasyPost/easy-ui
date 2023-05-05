import { CollectionChildren } from "@react-types/shared";
import React, { Key } from "react";
import {
  DismissButton,
  OverlayContainer,
  Placement,
  mergeProps,
  useMenu,
  usePopover,
} from "react-aria";
import { useTreeState } from "react-stately";
import {
  ResponsiveProp,
  getComponentToken,
  getResponsiveValue,
  pxToRem,
} from "../utilities/css";
import { useInternalMenuContext } from "./MenuContext";

import styles from "./Menu.module.scss";
import { MenuSectionContent } from "./MenuSection";
import { MenuItemContent } from "./MenuItem";

const ITEM_HEIGHT = 32;
const DEFAULT_MAX_ITEMS_UNTIL_SCROLL = 5;
const Y_PADDING_INSIDE_OVERLAY = 8;
const OVERLAY_OFFSET = 8;
const OVERLAY_PADDING_FROM_CONTAINER = 12;

export type MenuOverlayWidth =
  | "auto"
  | "fit-content"
  | "fit-trigger"
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
    placement = "bottom",
    width = "auto",
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
      isKeyboardDismissDisabled: false,
      isNonModal: false,
      maxHeight:
        ITEM_HEIGHT * maxItemsUntilScroll + Y_PADDING_INSIDE_OVERLAY * 2 + 2,
      offset: OVERLAY_OFFSET,
      placement,
      popoverRef,
      triggerRef,
      scrollRef: menuRef,
    },
    menuTriggerState,
  );

  const { menuProps } = useMenu(
    mergeProps({ disabledKeys, onAction, onClose }, menuPropsFromTrigger),
    menuTreeState,
    menuRef,
  );

  const style = {
    ...popoverProps.style,
    ...getComponentToken("menu", "item_height", `${pxToRem(ITEM_HEIGHT)}rem`),
    ...getComponentToken(
      "menu",
      "padding.y",
      `${pxToRem(Y_PADDING_INSIDE_OVERLAY)}rem`,
    ),
    ...getComponentToken(
      "menu",
      "min-width",
      width === "auto" ? `${triggerWidth}px` : undefined,
    ),
    ...getResponsiveValue(
      "menu",
      "width",
      width !== "auto" && width !== "fit-content" && width !== "fit-trigger"
        ? width
        : width === "fit-trigger"
        ? `${pxToRem(triggerWidth as number)}rem`
        : "auto",
    ),
  } as React.CSSProperties;

  return (
    <OverlayContainer>
      <div {...underlayProps} className={styles.underlay} />
      <div
        {...mergeProps(popoverProps, { style })}
        ref={popoverRef}
        className={styles.root}
      >
        <DismissButton onDismiss={menuTriggerState.close} />
        <ul {...menuProps} ref={menuRef} className={styles.list}>
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
        <DismissButton onDismiss={menuTriggerState.close} />
      </div>
    </OverlayContainer>
  );
}
