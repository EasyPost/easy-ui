import { useResizeObserver } from "@react-aria/utils";
import {
  CSSProperties,
  MutableRefObject,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Node, TableState } from "react-stately";
import { getComponentToken } from "../utilities/css";
import { EXPAND_COLUMN_KEY } from "./constants";

/**
 * Manages the size and positioning of the expanded row content.
 */
export function useExpandedRow({
  tableRef,
  state,
}: {
  tableRef: MutableRefObject<HTMLDivElement | null>;
  state: TableState<unknown>;
}) {
  const [pendingWidth, setPendingWidth] = useState<number | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [expandedRow, setExpandedRow] = useState<Node<unknown> | null>(null);

  const pendingExpandedRow = [...state.collection.body.childNodes].find((r) => {
    return r.value
      ? r.value[EXPAND_COLUMN_KEY as keyof typeof r.value] === true
      : false;
  });

  if (!pendingExpandedRow && expandedRow) {
    setExpandedRow(null);
  }

  // Determine the size of the expanded row content and where it should be
  // positioned within the data grid
  //
  // This must be done in two stages:
  // (1) determine what the width of the expanded row content should be by
  //     adding the expanded row's children together
  // (2) determine the height of the expanded row content after setting the
  //     width, since its height will be determined by its width
  // (3) finally, after knowing the contents, set it as the content to render
  //     in the table
  useLayoutEffect(() => {
    if (tableRef.current && pendingExpandedRow) {
      const rect = getExpandedRowContentRect(tableRef.current, true);
      setPendingWidth(rect.width);
      const animationFrame = requestAnimationFrame(() => {
        if (tableRef.current && pendingExpandedRow) {
          setRect(getExpandedRowContentRect(tableRef.current, true));
          setExpandedRow(pendingExpandedRow);
        }
      });
      return () => {
        window.cancelAnimationFrame(animationFrame);
      };
    }
  }, [pendingExpandedRow, tableRef]);

  // update the expanded row content rect on table resize
  useResizeObserver({
    ref: tableRef,
    onResize() {
      if (tableRef.current && pendingExpandedRow) {
        const rect = getExpandedRowContentRect(tableRef.current, false);
        setRect(rect);
        setPendingWidth(rect.width);
      }
    },
  });

  const pendingExpandedRowStyle = useMemo(() => {
    return {
      ...getComponentToken(
        "data-grid",
        "pending-expanded-row-width",
        pendingWidth != null ? `${pendingWidth}px` : "100%",
      ),
    } as CSSProperties;
  }, [pendingWidth]);

  const expandedRowStyle = useMemo(() => {
    return {
      ...getComponentToken(
        "data-grid",
        "expanded-row-height",
        rect?.height ? `${rect.height}px` : "auto",
      ),
      ...getComponentToken(
        "data-grid",
        "expanded-row-width",
        rect?.width ? `${rect.width}px` : "100%",
      ),
      ...getComponentToken(
        "data-grid",
        "expanded-row-position",
        rect?.y ? `${rect.y}px` : "0",
      ),
      ...getComponentToken(
        "data-grid",
        "expanded-row-opacity",
        rect?.y ? "1.0" : "0.0",
      ),
    } as CSSProperties;
  }, [rect]);

  return {
    pendingExpandedRow,
    expandedRow,
    expandedRowStyle,
    pendingExpandedRowStyle,
  };
}

function getExpandedRowContentEl($table: HTMLElement, isPending: boolean) {
  return $table.querySelector(
    `[data-ezui-expanded-row-content='${isPending ? "pending" : "base"}']`,
  ) as HTMLElement;
}

function getExpandedRowEl($table: HTMLElement) {
  return $table.querySelector(`[data-ezui-expanded-row='true']`) as HTMLElement;
}

function getExpandedRowContentRect($tableEl: HTMLElement, isPending: boolean) {
  const $expandedRowContent = getExpandedRowContentEl($tableEl, isPending);
  const $expandedRow = getExpandedRowEl($tableEl);
  const $children = [...$expandedRow.childNodes] as HTMLElement[];
  const $firstChild = $children[0];
  // figure out top from previous row heights
  const rows = [
    ...$tableEl.querySelectorAll(`[data-ezui-data-grid-row="true"]`),
  ];
  const expandedIndex = rows.findIndex((r) => r === $expandedRow);
  const top = rows
    .map((r) => r.childNodes[0] as HTMLElement)
    .filter((_, i) => i < expandedIndex)
    .reduce((acc, c) => {
      console.log("oh", c.offsetHeight);
      return acc + c.offsetHeight;
    }, 0);
  // const top = $firstChild.offsetTop;
  const columnHeader = $tableEl.querySelector(
    `[role="columnheader"]`,
  ) as HTMLElement;
  const y = top + columnHeader.offsetHeight + $firstChild.offsetHeight;
  console.log("top", top, y, expandedIndex);
  // sum up the row's children for its width. subtract one to ensure we never
  // get scrollbars from fractional quirks
  const width = $children.reduce((acc, c) => acc + c.offsetWidth, 0) - 1;
  const height = $expandedRowContent.offsetHeight;
  return new DOMRect(0, y, width, height);
}
