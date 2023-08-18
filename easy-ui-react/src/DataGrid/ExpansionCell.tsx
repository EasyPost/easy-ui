import React from "react";
import { UnstyledPressButton } from "./UnstyledPressButton";

type ExpansionCellProps = {
  isExpanded: boolean;
  toggleExpanded: () => void;
};

export function ExpansionCell({
  isExpanded,
  toggleExpanded,
}: ExpansionCellProps) {
  return (
    <span>
      <UnstyledPressButton
        onClick={() => {
          toggleExpanded();
        }}
        aria-expanded={isExpanded}
        style={{ width: 40 }}
      >
        {isExpanded ? "C" : "E"}
      </UnstyledPressButton>
    </span>
  );
}
