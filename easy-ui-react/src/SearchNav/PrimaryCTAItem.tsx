import React from "react";
import { AriaButtonProps } from "react-aria";
import { Button } from "../Button";
import { RouterLinkProps } from "../utilities/router";

export type CTAItemProps = AriaButtonProps<"button"> &
  RouterLinkProps & {
    /**
     * Text content to display.
     */
    label: string;
  };

export type PrimaryCTAItemProps = CTAItemProps;

export function PrimaryCTAItem(props: PrimaryCTAItemProps) {
  const { label, ...restProps } = props;

  return (
    <Button {...restProps} variant="outlined" size="sm" color="support">
      {label}
    </Button>
  );
}

PrimaryCTAItem.displayName = "SearchNav.PrimaryCTAItem";
