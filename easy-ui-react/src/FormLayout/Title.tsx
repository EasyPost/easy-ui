import React, { ReactNode, useContext } from "react";
import { Text } from "../Text";
import { Heading } from "../types";
import { WithinSectionContext } from "./context";

export type TitleProps = {
  /**
   * Id of the HTML element.
   */
  id?: string;

  /**
   * Custom heading tag to provide as the underlying HTML element.
   *
   * @default span
   */
  as?: Heading;

  /**
   * Content of the title text.
   */
  children: ReactNode;
};

export function Title(props: TitleProps) {
  const { as = "span", children, ...restProps } = props;
  const withinSection = useContext(WithinSectionContext);
  const textProps = withinSection
    ? ({
        variant: "heading5",
        "aria-hidden": true,
        role: "presentation",
      } as const)
    : ({ variant: "heading3" } as const);
  return (
    <Text as={as} {...restProps} {...textProps}>
      {children}
    </Text>
  );
}

Title.displayName = "FormLayout.Title";
