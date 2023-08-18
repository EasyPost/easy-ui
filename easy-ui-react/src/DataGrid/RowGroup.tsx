import React, { ReactNode } from "react";
import { useTableRowGroup } from "react-aria";

type RowGroupProps = {
  as: "thead" | "tbody";
  children: ReactNode;
};

export function RowGroup({ as: As, children }: RowGroupProps) {
  const { rowGroupProps } = useTableRowGroup();
  return (
    <As
      {...rowGroupProps}
      style={
        As === "thead"
          ? { borderBottom: "2px solid var(--spectrum-global-color-gray-800)" }
          : {}
      }
    >
      {children}
    </As>
  );
}
