import React, { ElementType, ReactNode, forwardRef } from "react";
import { ResponsiveSpaceScale } from "../types";
import {
  ResponsiveProp,
  getComponentToken,
  getResponsiveDesignToken,
  getResponsiveValue,
} from "../utilities/css";
import { formatHorizontalGrid } from "./utilities";

import styles from "./HorizontalGrid.module.scss";

export type ColumnsAlias =
  | "oneFourth"
  | "oneThird"
  | "oneHalf"
  | "twoThirds"
  | "threeFourths";
export type ColumnsType = number | string | (string | ColumnsAlias)[];
export type Columns = ResponsiveProp<ColumnsType>;
export type HorizontalGridAlignItems = "start" | "end" | "center";

export type HorizontalGridProps = {
  /**
   * Vertical alignment of children. If not set, inline elements will stretch to the height of the parent.
   */
  alignItems?: HorizontalGridAlignItems;

  /**
   * HTML element type.
   * @default div
   */
  as?: ElementType;

  /** Content of the horizontal grid. */
  children: ReactNode;

  /**
   * The number of columns to display. Accepts either a single value, an array of column values, or an object of values for different screen sizes.
   * @example
   * columns={6}
   * columns={{xs: 1, sm: 1, md: 3, lg: 6, xl: 6}}
   */
  columns: Columns;

  /**
   * The spacing between children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
   * @example
   * gap='2'
   * gap={{xs: '1', sm: '2', md: '3', lg: '4', xl: '5'}}
   */
  gap?: ResponsiveSpaceScale;

  /** Whether or not the horizontal grid uses inline-grid instead of grid. */
  inline?: boolean;
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
export const HorizontalGrid = forwardRef<null, HorizontalGridProps>(
  (props, ref) => {
    const {
      alignItems,
      as: As = "div",
      children,
      columns,
      gap,
      inline,
    } = props;
    const style = {
      ...getResponsiveValue(
        "horizontal-grid",
        "grid-template-columns",
        formatHorizontalGrid(columns),
      ),
      ...getResponsiveDesignToken("horizontal-grid", "gap", "space", gap),
      ...getComponentToken("horizontal-grid", "align-items", alignItems),
      ...getComponentToken(
        "horizontal-grid",
        "display",
        inline ? "inline-grid" : "grid",
      ),
    } as React.CSSProperties;
    return (
      <As className={styles.HorizontalGrid} style={style} ref={ref}>
        {children}
      </As>
    );
  },
);

HorizontalGrid.displayName = "HorizontalGrid";
