import React, { ReactNode } from "react";
import { HorizontalGrid, HorizontalGridProps } from "../HorizontalGrid";

export type GridProps = {
  children: ReactNode;
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
