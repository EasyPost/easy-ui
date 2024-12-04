import ArrowForwardIos from "@easypost/easy-ui-icons/ArrowForwardIos";
import React, { useCallback } from "react";
import { Icon } from "../Icon";
import { classNames } from "../utilities/css";
import { UnstyledPressButton } from "../UnstyledButton/UnstyledPressButton";
import { Text } from "../Text";

import styles from "./ExpandCellContent.module.scss";

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
  const className = classNames(styles.button, isExpanded && styles.expanded);
  return (
    <UnstyledPressButton
      onPress={handleClick}
      className={className}
      aria-expanded={isExpanded}
    >
      <Text visuallyHidden>Expand</Text>
      <Icon symbol={ArrowForwardIos} size="xs" />
    </UnstyledPressButton>
  );
}
