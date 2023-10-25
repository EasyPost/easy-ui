import React, { ReactNode } from "react";

export type SidePanelProps = {
  children: ReactNode;
};

export function SidePanel({ children }: SidePanelProps) {
  return <>{children}</>;
}
