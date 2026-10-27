import React, { ReactNode, useContext } from "react";
import { Text, TextVariant } from "../Text";
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
   * Text variant of the title. Use a smaller variant than the default when
   * the title sits beside other content, such as a checkbox or a button, so
   * that the title's box matches its text.
   *
   * @default heading3 (heading5 within a `FormLayout.Section`)
   */
  variant?: TextVariant;

  /**
   * Content of the title text.
   */
  children: ReactNode;
};

export function Title(props: TitleProps) {
  const { as = "span", variant, children, ...restProps } = props;
  const withinSection = useContext(WithinSectionContext);
  const textProps = withinSection
    ? ({
        variant: "heading5",
        "aria-hidden": true,
        role: "presentation",
      } as const)
    : ({ variant: "heading3" } as const);
  return (
    <Text
      as={as}
      {...restProps}
      {...textProps}
      variant={variant ?? textProps.variant}
    >
      {children}
    </Text>
  );
}

Title.displayName = "FormLayout.Title";
