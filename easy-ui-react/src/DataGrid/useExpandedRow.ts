import {
  CSSProperties,
  MutableRefObject,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { TableState } from "react-stately";
import { getComponentToken } from "../utilities/css";
import { EXPAND_ROW_COLUMN_KEY } from "./constants";

export function useExpandedRow({
  tableRef,
  state,
}: {
  tableRef: MutableRefObject<HTMLDivElement | null>;
  state: TableState<unknown>;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  const expandedRow = [...state.collection.body.childNodes].find((r) => {
    return r.value
      ? r.value[EXPAND_ROW_COLUMN_KEY as keyof typeof r.value] === true
      : false;
  });

  // Determine the size of the expanded row content and where it should be
  // positioned within the data grid
  //
  // This must be done in two stages:
  // (1) determine what the width of the expanded row content should be by
  //     adding the expanded row's children together
  // (2) determine the height of the expanded row content after setting the
  //     width, since its height will be determined by its width
  useLayoutEffect(() => {
    if (tableRef.current && expandedRow) {
      const $expandedRowContent = getExpandedRowContentEl(tableRef.current);
      const $expandedRow = getExpandedRowEl(tableRef.current);
      if ($expandedRow && $expandedRowContent) {
        const $children = [...$expandedRow.childNodes] as HTMLElement[];
        const $firstChild = $children[0];
        const y = $firstChild.offsetTop + $firstChild.offsetHeight;
        const width = $children.reduce((acc, c) => acc + c.offsetWidth, 0);
        setRect(new DOMRect(0, 0, width, 0));
        const animationFrame = requestAnimationFrame(() => {
          const height = $expandedRowContent.offsetHeight;
          setRect(new DOMRect(0, y, width, height));
        });
        return () => {
          window.cancelAnimationFrame(animationFrame);
        };
      }
    }
  }, [expandedRow, tableRef]);

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

  return { expandedRow, expandedRowStyle };
}

function getExpandedRowContentEl($table: HTMLElement) {
  return $table.querySelector(
    "[data-ezui-expanded-row-content='true']",
  ) as HTMLElement;
}

function getExpandedRowEl($table: HTMLElement) {
  return $table.querySelector("[data-ezui-expanded-row='true']") as HTMLElement;
}
