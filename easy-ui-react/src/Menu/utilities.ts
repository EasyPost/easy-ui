import React from "react";
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

export function getItemSize<T>(state: TreeState<T>): number {
  return [...state.collection].reduce((acc, item) => {
    if (item.type === "section") {
      acc += [...item.childNodes].length;
    } else {
      acc += 1;
    }
    return acc;
  }, 0);
}
