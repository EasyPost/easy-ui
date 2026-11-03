import { useResizeObserver } from "@react-aria/utils";
import {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { TableState } from "react-stately";
import { getComponentToken } from "../utilities/css";
import { EXPAND_COLUMN_KEY } from "./constants";

/**
 * Retrieves the expanded row from Aria's table state and computes the position
 * and height of the expanded row box to manage its positioning in the grid.
 */
export function useExpandedRow({
  containerRef,
  state,
}: {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  state: TableState<unknown>;
}) {
  const [expandedRowRect, setExpandedRowRect] = useState<DOMRect | null>(null);

  const expandedRow = [...state.collection.body.childNodes].find((r) => {
    return r.value
      ? r.value[EXPAND_COLUMN_KEY as keyof typeof r.value] === true
      : false;
  });

  const updateExpandedRowRect = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    const rect = getExpandedRowContentRect(containerRef.current);
    setExpandedRowRect((prevRect) =>
      prevRect && rect.height === prevRect.height && rect.y === prevRect.y
        ? prevRect
        : rect,
    );
  }, [containerRef]);

  useLayoutEffect(() => {
    if (expandedRow) {
      updateExpandedRowRect();
    }
  }, [expandedRow, updateExpandedRowRect]);

  useResizeObserver({
    ref: containerRef,
    onResize() {
      if (expandedRow) {
        updateExpandedRowRect();
      }
    },
  });

  // The expanded content can change size on its own after it opens, such as
  // when a spinner is replaced by data fetched on open, without the container
  // resizing. Observe the content too so the row keeps up with its height.
  const isExpanded = Boolean(expandedRow);
  useLayoutEffect(() => {
    const $content =
      isExpanded && containerRef.current
        ? getExpandedRowContentEl(containerRef.current)
        : null;
    if (!$content || typeof window.ResizeObserver === "undefined") {
      return;
    }
    const observer = new window.ResizeObserver(() => {
      updateExpandedRowRect();
    });
    observer.observe($content);
    return () => {
      observer.disconnect();
    };
  }, [containerRef, isExpanded, updateExpandedRowRect]);

  const expandedRowStyle = useMemo(() => {
    return {
      ...getComponentToken(
        "data-grid",
        "expanded-row-height",
        expandedRowRect?.height ? `${expandedRowRect.height}px` : "auto",
      ),
      ...getComponentToken(
        "data-grid",
        "expanded-row-position",
        expandedRowRect?.y ? `${expandedRowRect.y}px` : "0",
      ),
      ...getComponentToken(
        "data-grid",
        "expanded-row-opacity",
        expandedRowRect?.y ? "1.0" : "0.0",
      ),
    } as CSSProperties;
  }, [expandedRowRect]);

  return {
    expandedRow,
    expandedRowStyle,
  };
}

/**
 * Calculates a DOMRect (bounding client rectangle) for the expanded row
 * content box. This is used to position the expanded row content absolutely
 * within the container.
 *
 * @param $container Containerlement
 * @param isPending whether or not to compute the pending expanded row or the active one
 * @returns a DOMRect of the expanded row content
 */
function getExpandedRowContentRect($container: HTMLElement) {
  const $rows = getDataGridRowEls($container);
  const $firstColumnHeader = getFirstColumnHeaderEl($container);
  const $expandedRowContent = getExpandedRowContentEl($container);
  const $expandedRow = getExpandedRowEl($container);
  const expandedIndex = $rows.findIndex((r) => r === $expandedRow);
  const $expandedRowCells = [...$expandedRow.childNodes] as HTMLElement[];
  const heightOfPreviousRows = $rows
    .map((r) => r.childNodes[0] as HTMLElement)
    .filter((_, i) => i < expandedIndex)
    .reduce((acc, c) => acc + c.offsetHeight, 0);
  const y = heightOfPreviousRows + $firstColumnHeader.offsetHeight;
  const width =
    $expandedRowCells.reduce((acc, c) => acc + c.offsetWidth, 0) - 1;
  const height = $expandedRowContent.offsetHeight;
  return new DOMRect(0, y, width, height);
}

function getFirstColumnHeaderEl($container: HTMLElement) {
  return $container.querySelector(
    `[data-ezui-data-grid-column-header="true"]`,
  ) as HTMLElement;
}

function getDataGridRowEls($container: HTMLElement) {
  return [
    ...$container.querySelectorAll(`[data-ezui-data-grid-row="true"]`),
  ] as HTMLElement[];
}

function getExpandedRowContentEl($container: HTMLElement) {
  return $container.querySelector(
    `[data-ezui-data-grid-expanded-row-content="active"]`,
  ) as HTMLElement;
}

function getExpandedRowEl($container: HTMLElement) {
  return $container.querySelector(
    `[data-ezui-data-grid-expanded-row='true']`,
  ) as HTMLElement;
}
