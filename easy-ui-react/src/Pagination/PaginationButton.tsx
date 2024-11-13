import React from "react";
import { Icon } from "../Icon";

import { UnstyledButton, UnstyledButtonProps } from "../UnstyledButton";
import { IconSymbol } from "../types";

type PaginationButtonProps = UnstyledButtonProps & {
  symbol: IconSymbol;
};

export function PaginationButton(props: PaginationButtonProps) {
  const { symbol, ...buttonProps } = props;
  return (
    <UnstyledButton {...buttonProps}>
      <Icon
        symbol={symbol}
        color={!buttonProps.isDisabled ? "primary.700" : "neutral.400"}
        size="md"
      />
    </UnstyledButton>
  );
}
