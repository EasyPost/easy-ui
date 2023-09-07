import ArrowForwardIos from "@easypost/easy-ui-icons/ArrowForwardIos";
import React, { useCallback } from "react";
import { Icon } from "../Icon";
import { classNames } from "../utilities/css";
import { UnstyledPressButton } from "./UnstyledPressButton";

import styles from "./DataGrid.module.scss";

type ExpandCellContentProps = {
  isExpanded: boolean;
  toggleExpanded: () => void;
};

export function ExpandCellContent({
  isExpanded,
  toggleExpanded,
}: ExpandCellContentProps) {
  const handleClick = useCallback(() => {
    toggleExpanded();
  }, [toggleExpanded]);
  const className = classNames(
    styles.expandRowButton,
    isExpanded && styles.expanded,
  );
  return (
    <UnstyledPressButton
      onPress={handleClick}
      className={className}
      aria-expanded={isExpanded}
    >
      <Icon symbol={ArrowForwardIos} size="xs" />
    </UnstyledPressButton>
  );
}
