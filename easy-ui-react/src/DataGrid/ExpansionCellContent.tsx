import React from "react";
import { UnstyledPressButton } from "./UnstyledPressButton";

type ExpansionCellContentProps = {
  isExpanded: boolean;
  toggleExpanded: () => void;
};

export function ExpansionCellContent({
  isExpanded,
  toggleExpanded,
}: ExpansionCellContentProps) {
  return (
    <div>
      <UnstyledPressButton
        onClick={() => {
          toggleExpanded();
        }}
        aria-expanded={isExpanded}
        style={{ width: 40 }}
      >
        {isExpanded ? "C" : "E"}
      </UnstyledPressButton>
    </div>
  );
}
