import { useResizeObserver } from "@react-aria/utils";
import {
  CSSProperties,
  MutableRefObject,
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
  tableRef,
  state,
}: {
  tableRef: MutableRefObject<HTMLDivElement | null>;
  state: TableState<unknown>;
}) {
  const [expandedRowRect, setExpandedRowRect] = useState<DOMRect | null>(null);

  const expandedRow = [...state.collection.body.childNodes].find((r) => {
    return r.value
      ? r.value[EXPAND_COLUMN_KEY as keyof typeof r.value] === true
      : false;
  });

  useLayoutEffect(() => {
    if (tableRef.current && expandedRow) {
      setExpandedRowRect(getExpandedRowContentRect(tableRef.current));
    }
  }, [tableRef, expandedRow]);

  useResizeObserver({
    ref: tableRef,
    onResize() {
      if (tableRef.current && expandedRow) {
        const rect = getExpandedRowContentRect(tableRef.current);
        if (
          !expandedRowRect ||
          rect.height !== expandedRowRect.height ||
          rect.y !== expandedRowRect.y
        ) {
          setExpandedRowRect(rect);
        }
      }
    },
  });

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
 * within the table.
 *
 * @param $table Table element
 * @param isPending whether or not to compute the pending expanded row or the active one
 * @returns a DOMRect of the expanded row content
 */
function getExpandedRowContentRect($table: HTMLElement) {
  const $rows = getDataGridRowEls($table);
  const $firstColumnHeader = getFirstColumnHeaderEl($table);
  const $expandedRowContent = getExpandedRowContentEl($table);
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

function getExpandedRowContentEl($table: HTMLElement) {
  return $table.querySelector(
    `[data-ezui-data-grid-expanded-row-content="active"]`,
  ) as HTMLElement;
}

function getExpandedRowEl($table: HTMLElement) {
  return $table.querySelector(
    `[data-ezui-data-grid-expanded-row='true']`,
  ) as HTMLElement;
}
