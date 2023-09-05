import { useResizeObserver } from "@react-aria/utils";
import {
  CSSProperties,
  MutableRefObject,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Node, TableState } from "react-stately";
import { getComponentToken } from "../utilities/css";
import { EXPAND_COLUMN_KEY } from "./constants";

/**
 * Manages the size and positioning of the expanded row content with
 * minimal-to-no jank. It uses an invisible placeholder box to set and get the
 * appropriate bounding client rectangle representative of the expanded row
 * content box, before applying it to the visible expanded row.
 */
export function useExpandedRow({
  tableRef,
  state,
}: {
  tableRef: MutableRefObject<HTMLDivElement | null>;
  state: TableState<unknown>;
}) {
  const [pendingExpandedRowWidth, setPendingExpandedRowWidth] = useState<
    number | null
  >(null);
  const [expandedRowRect, setExpandedRowRect] = useState<DOMRect | null>(null);
  const [expandedRow, setExpandedRow] = useState<Node<unknown> | null>(null);

  const pendingExpandedRow = [...state.collection.body.childNodes].find((r) => {
    return r.value
      ? r.value[EXPAND_COLUMN_KEY as keyof typeof r.value] === true
      : false;
  });

  if (expandedRow && !pendingExpandedRow) {
    setExpandedRow(null);
  }

  useEffect(() => {
    if (tableRef.current && pendingExpandedRow) {
      const rect = getExpandedRowContentRect(tableRef.current, true);
      setPendingExpandedRowWidth(rect.width);
      const animationFrame = requestAnimationFrame(() => {
        if (tableRef.current && pendingExpandedRow) {
          setExpandedRowRect(getExpandedRowContentRect(tableRef.current, true));
          setExpandedRow(pendingExpandedRow);
        }
      });
      return () => {
        window.cancelAnimationFrame(animationFrame);
      };
    }
  }, [pendingExpandedRow, tableRef]);

  useResizeObserver({
    ref: tableRef,
    onResize() {
      if (tableRef.current && pendingExpandedRow) {
        const rect = getExpandedRowContentRect(tableRef.current, false);
        setExpandedRowRect(rect);
        setPendingExpandedRowWidth(rect.width);
      }
    },
  });

  const pendingExpandedRowStyle = useMemo(() => {
    return {
      ...getComponentToken(
        "data-grid",
        "pending-expanded-row-width",
        pendingExpandedRowWidth != null
          ? `${pendingExpandedRowWidth}px`
          : "100%",
      ),
    } as CSSProperties;
  }, [pendingExpandedRowWidth]);

  const expandedRowStyle = useMemo(() => {
    return {
      ...getComponentToken(
        "data-grid",
        "expanded-row-height",
        expandedRowRect?.height ? `${expandedRowRect.height}px` : "auto",
      ),
      ...getComponentToken(
        "data-grid",
        "expanded-row-width",
        expandedRowRect?.width ? `${expandedRowRect.width}px` : "100%",
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
    pendingExpandedRow,
    expandedRow,
    expandedRowStyle,
    pendingExpandedRowStyle,
  };
}

/**
 * Calculates a DOMRect (bounding client rectangle) for the expanded row
 * content box. This is used to position the expanded row content absolutely
 * within the table.
 *
 * @param $table Table element
 * @param isPending whether or not to compute the pending expanded row or the active one
 * @returns a DOMRect of the expanded row content
 */
function getExpandedRowContentRect($table: HTMLElement, isPending: boolean) {
  const $rows = getDataGridRowEls($table);
  const $firstColumnHeader = getFirstColumnHeaderEl($table);
  const $expandedRowContent = getExpandedRowContentEl($table, isPending);
  const $expandedRow = getExpandedRowEl($table);
  const expandedIndex = $rows.findIndex((r) => r === $expandedRow);
  const $expandedRowCells = [...$expandedRow.childNodes] as HTMLElement[];
  const heightOfPreviousRows = $rows
    .map((r) => r.childNodes[0] as HTMLElement)
    .filter((_, i) => i < expandedIndex)
    .reduce((acc, c) => acc + c.offsetHeight, 0);
  const y =
    heightOfPreviousRows +
    $firstColumnHeader.offsetHeight +
    $expandedRowCells[0].offsetHeight;
  const width =
    $expandedRowCells.reduce((acc, c) => acc + c.offsetWidth, 0) - 1;
  const height = $expandedRowContent.offsetHeight;
  return new DOMRect(0, y, width, height);
}

function getFirstColumnHeaderEl($table: HTMLElement) {
  return $table.querySelector(
    `[data-ezui-data-grid-column-header="true"]`,
  ) as HTMLElement;
}

function getDataGridRowEls($table: HTMLElement) {
  return [
    ...$table.querySelectorAll(`[data-ezui-data-grid-row="true"]`),
  ] as HTMLElement[];
}

function getExpandedRowContentEl($table: HTMLElement, isPending: boolean) {
  return $table.querySelector(
    `[data-ezui-data-grid-expanded-row-content='${
      isPending ? "pending" : "active"
    }']`,
  ) as HTMLElement;
}

function getExpandedRowEl($table: HTMLElement) {
  return $table.querySelector(
    `[data-ezui-data-grid-expanded-row='true']`,
  ) as HTMLElement;
}
