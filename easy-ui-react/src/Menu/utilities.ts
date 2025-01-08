import { Key } from "@react-types/shared";
import React, { useCallback, useEffect } from "react";
import { TreeState } from "react-stately";
import {
  getComponentToken,
  getResponsiveValue,
  pxToRem,
} from "../utilities/css";
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

export function getAllSelectableItems<T>(state: TreeState<T>): Set<Key> {
  return [...state.collection].reduce((acc, item) => {
    if (item.type === "section") {
      [...item.childNodes].forEach((child) => {
        if (
          child.key !== SELECT_ALL_KEY &&
          !state.disabledKeys.has(child.key)
        ) {
          acc.add(child.key);
        }
      });
    } else {
      if (item.key !== SELECT_ALL_KEY && !state.disabledKeys.has(item.key)) {
        acc.add(item.key);
      }
    }
    return acc;
  }, new Set<Key>());
}

export function filterSelectedKeys(keys: Set<Key>) {
  return new Set([...keys].filter((v) => v !== SELECT_ALL_KEY));
}

export function getFilteredSelectedKeys<T>(state: TreeState<T>) {
  return filterSelectedKeys(state.selectionManager.selectedKeys);
}

export function isSelectAllSelected<T>(state: TreeState<T>) {
  return (
    state.selectionManager.isSelectAll ||
    getFilteredSelectedKeys(state).size === getAllSelectableItems(state).size
  );
}

export function isSelectAllIndeterminate<T>(state: TreeState<T>) {
  return !isSelectAllSelected(state) && getFilteredSelectedKeys(state).size > 0;
}

export function useSelectionCapture() {
  const selectionPendingRef = React.useRef(false);

  const isSelectionPending = useCallback(() => {
    return selectionPendingRef.current === true;
  }, []);

  const markSelectionPending = useCallback(() => {
    selectionPendingRef.current = true;
  }, []);

  const markSelectionStale = useCallback(() => {
    selectionPendingRef.current = false;
  }, []);

  // This effect ensures that keyboard shortcuts (i.e. `cmd + a`) still
  // works with our custom "select all" logic
  useEffect(() => {
    window.addEventListener("keydown", markSelectionPending);
    window.addEventListener("pointerdown", markSelectionStale, {
      capture: true,
    });
    window.addEventListener("keyup", markSelectionStale);
    return () => {
      window.removeEventListener("keydown", markSelectionPending);
      window.removeEventListener("pointerdown", markSelectionStale, {
        capture: true,
      });
      window.removeEventListener("keyup", markSelectionStale);
    };
  }, [markSelectionPending, markSelectionStale]);

  return { isSelectionPending, markSelectionPending, markSelectionStale };
}
