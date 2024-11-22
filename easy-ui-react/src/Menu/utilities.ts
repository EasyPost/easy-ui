import React from "react";
import {
  getComponentToken,
  getResponsiveValue,
  pxToRem,
} from "../utilities/css";
import { Key } from "@react-types/shared";
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

export function useMenuSelectAll<T>(
  selectedKeys: Set<Key>,
  state: TreeState<T>,
  isFocused: boolean,
): boolean {
  // Get collection size minus section item type
  const itemSize = [...state.collection].reduce((acc, item) => {
    if (item.type === "section") {
      acc += [...item.childNodes].length;
    } else {
      acc += 1;
    }
    return acc;
  }, 0);

  const isSelectAll = selectedKeys.has(SELECT_ALL_KEY);
  const selectedSize = selectedKeys.size;
  const isSelectAllIndeterminate = selectedSize > 0 && !isSelectAll;

  React.useEffect(() => {
    // This prevent infinite loop
    if (!state.selectionManager.lastSelectedKey) return;

    if (!isSelectAll && selectedSize === itemSize - 1) {
      if (isFocused) {
        // Deselect all checkboxes when Select ALL is deselected
        state.selectionManager.clearSelection();
      } else {
        // Select Select ALL checkbox when all other checkboxes are selected
        state.selectionManager.selectAll();
      }
    } else if (isSelectAll && selectedSize > 0) {
      if (isFocused) {
        // Select all checkboxes when Seleclt ALL is selected
        state.selectionManager.selectAll();
      } else {
        // Deselect and mark Select ALL checkbox as indeterminate when deselect one of the checkbox
        state.selectionManager.select(SELECT_ALL_KEY);
      }
    }
  }, [
    selectedKeys,
    isFocused,
    isSelectAll,
    selectedSize,
    itemSize,
    state.selectionManager,
  ]);

  return isSelectAllIndeterminate;
}
