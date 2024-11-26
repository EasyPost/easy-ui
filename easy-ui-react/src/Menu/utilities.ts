import React from "react";
import { Key } from "@react-types/shared";
import {
  getComponentToken,
  getResponsiveValue,
  pxToRem,
} from "../utilities/css";
import { TreeState } from "react-stately";
import { MenuOverlayWidth } from "./MenuOverlay";

export const DEFAULT_MAX_ITEMS_UNTIL_SCROLL = 5;
export const DEFAULT_PLACEMENT = "bottom";
export const DEFAULT_WIDTH = "auto";
export const ITEM_HEIGHT = 32;
export const Y_PADDING_INSIDE_OVERLAY = 8;
export const OVERLAY_OFFSET = 8;
export const OVERLAY_PADDING_FROM_CONTAINER = 12;
export const SELECT_ALL_KEY = "all";

export function getUnmergedPopoverStyles(
  width: MenuOverlayWidth,
  triggerWidth: number | null,
): React.CSSProperties {
  return {
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
      width !== "auto" && width !== "fit-content" ? width : "auto",
    ),
  };
}

type Items = {
  itemSize: number;
  items: Set<Key>;
};
export function getItems<T>(state: TreeState<T>): Items {
  return [...state.collection].reduce(
    (acc, item) => {
      if (item.type === "section") {
        [...item.childNodes].forEach((child) => {
          if (
            child.key !== SELECT_ALL_KEY &&
            !state.disabledKeys.has(child.key)
          ) {
            acc.itemSize += 1;
            acc.items.add(child.key);
          }
        });
      } else {
        if (item.key !== SELECT_ALL_KEY) {
          acc.itemSize += 1;
          acc.items.add(item.key);
        }
      }
      return acc;
    },
    { itemSize: 0, items: new Set<Key>() },
  );
}

export function useSelectAllState<T>(state: TreeState<T>, key: Key) {
  const { selectedKeys } = state.selectionManager;
  const { itemSize } = getItems(state);
  const isSelectAllCheckbox = key === SELECT_ALL_KEY;
  const isSelectAllSelected =
    !selectedKeys.has(SELECT_ALL_KEY) && selectedKeys.size === itemSize;
  const isSelectAllIndeterminate =
    selectedKeys.size > 0 && !isSelectAllSelected;
  const selectAllItemProps = isSelectAllCheckbox
    ? {
        "aria-checked": isSelectAllSelected,
      }
    : {};

  return { selectAllItemProps, isSelectAllSelected, isSelectAllIndeterminate };
}
