import React, { ElementType, ReactNode } from "react";
import {
  ResponsiveProp,
  getComponentToken,
  getResponsiveDesignToken,
  getResponsiveValue,
} from "../utilities/css";
import { DesignTokenNamespace } from "../types";

import styles from "./HorizontalGrid.module.scss";

type SpaceScale = DesignTokenNamespace<"space">;

export type ColumnsAlias =
  | "oneFourth"
  | "oneThird"
  | "oneHalf"
  | "twoThirds"
  | "threeFourths";
export type ColumnsType = number | string | (string | ColumnsAlias)[];
export type Columns = ResponsiveProp<ColumnsType>;
export type Gap = ResponsiveProp<SpaceScale>;
export type HorizontalGridAlignItems = "start" | "end" | "center";

export type HorizontalGridProps = {
  /**
   * HTML element type.
   * @default div
   */
  as?: ElementType;

  /** Content of the horizontal grid. */
  children: ReactNode;

  /** The number of columns to display. Accepts either a single value or an object of values for different screen sizes.
   * @example
   * columns={6}
   * columns={{xs: 1, sm: 1, md: 3, lg: 6, xl: 6}}
   */
  columns: Columns;

  /** The spacing between children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
   * @example
   * gap='2'
   * gap={{xs: '1', sm: '2', md: '3', lg: '4', xl: '5'}}
   */
  gap?: Gap;

  /** Vertical alignment of children. If not set, inline elements will stretch to the height of the parent.
   * @example
   * alignItems='start'
   */
  alignItems?: HorizontalGridAlignItems;
};

/**
 * Use to display children horizontally. Based on CSS Grid.
 *
 * @remarks
 * Properties like `gap` use Easy UI's constraint system.
 *
 * @example
 * ```tsx
 * <HorizontalGrid columns={2} gap="2">
 *   <div />
 *   <div />
 * </HorizontalGrid>
 * ```
 */
export const HorizontalGrid = React.forwardRef<null, HorizontalGridProps>(
  (props, ref) => {
    const { as: As = "div", children, columns, gap, alignItems } = props;
    const style = {
      ...getResponsiveValue(
        "horizontal-grid",
        "grid-template-columns",
        formatHorizontalGrid(columns),
      ),
      ...getResponsiveDesignToken("horizontal-grid", "gap", "space", gap),
      ...getComponentToken("horizontal-grid", "align-items", alignItems),
    } as React.CSSProperties;
    return (
      <As className={styles.HorizontalGrid} style={style} ref={ref}>
        {children}
      </As>
    );
  },
);

HorizontalGrid.displayName = "HorizontalGrid";

function formatHorizontalGrid(
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
