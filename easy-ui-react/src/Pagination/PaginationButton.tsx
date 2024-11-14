import React from "react";
import { Icon } from "../Icon";

import { UnstyledButton, UnstyledButtonProps } from "../UnstyledButton";
import { IconSymbol } from "../types";
import styles from "./Pagination.module.scss";

type PaginationButtonProps = UnstyledButtonProps & {
  symbol: IconSymbol;
};

export function PaginationButton(props: PaginationButtonProps) {
  const { symbol, ...buttonProps } = props;
  return (
    <UnstyledButton {...buttonProps} className={styles.arrowButton}>
      <Icon symbol={symbol} size="md" />
    </UnstyledButton>
  );
}
