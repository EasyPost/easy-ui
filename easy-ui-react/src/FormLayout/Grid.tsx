import React, { ReactNode } from "react";
import { HorizontalGrid, HorizontalGridProps } from "../HorizontalGrid";

export type GridProps = {
  /**
   * Content of the grid.
   */
  children: ReactNode;

  /**
   * The number of columns to display. Accepts either a single value, an
   * array of column values, or an object of values for different screen sizes.
   *
   * @example
   * columns={6}
   * columns={{xs: 1, sm: 1, md: 3, lg: 6, xl: 6}}
   */
  columns: HorizontalGridProps["columns"];
};

export function Grid(props: GridProps) {
  const { children, columns } = props;
  return (
    <HorizontalGrid columns={columns} gap="2">
      {children}
    </HorizontalGrid>
  );
}
