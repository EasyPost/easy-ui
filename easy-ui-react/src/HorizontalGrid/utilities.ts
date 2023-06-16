import { ResponsiveProp } from "../utilities/css";
import type { Columns, ColumnsType } from "./HorizontalGrid";

export function formatHorizontalGrid(
  columns?: Columns,
): ResponsiveProp<string | undefined> {
  if (
    typeof columns === "object" &&
    columns !== null &&
    !Array.isArray(columns)
  ) {
    return Object.fromEntries(
      Object.entries(columns).map(
        ([breakpointAlias, breakpointHorizontalGrid]) => [
          breakpointAlias,
          getColumnValue(breakpointHorizontalGrid),
        ],
      ),
    );
  }

  return getColumnValue(columns);
}

function getColumnValue(columns?: ColumnsType) {
  if (!columns) return undefined;

  if (typeof columns === "number" || !isNaN(Number(columns))) {
    return `repeat(${Number(columns)}, minmax(0, 1fr))`;
  }

  if (typeof columns === "string") return columns;

  return columns
    .map((column) => {
      switch (column) {
        case "oneFourth":
        case "oneThird":
        case "oneHalf":
          return "minmax(0, 1fr)";
        case "twoThirds":
          return "minmax(0, 2fr)";
        case "threeFourths":
          return "minmax(0, 3fr)";
        default:
          return column;
      }
    })
    .join(" ");
}
