import React from "react";
import ArrowForwardIos from "@easypost/easy-ui-icons/ArrowForwardIos";
import { UnstyledPressButton } from "./UnstyledPressButton";
import { Icon } from "../Icon";
import { classNames } from "../utilities/css";

import styles from "./DataGrid.module.scss";

type ExpansionCellContentProps = {
  isExpanded: boolean;
  toggleExpanded: () => void;
};

export function ExpansionCellContent({
  isExpanded,
  toggleExpanded,
}: ExpansionCellContentProps) {
  const className = classNames(
    styles.expandRowButton,
    isExpanded && styles.expanded,
  );
  return (
    <UnstyledPressButton
      onClick={() => {
        toggleExpanded();
      }}
      className={className}
      aria-expanded={isExpanded}
    >
      <Icon symbol={ArrowForwardIos} size="xs" />
    </UnstyledPressButton>
  );
}
