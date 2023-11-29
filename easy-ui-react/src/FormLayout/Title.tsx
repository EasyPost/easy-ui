import React, { ReactNode, useContext } from "react";
import { Text } from "../Text";
import { Heading } from "../types";
import { WithinSectionContext } from "./context";

export type TitleProps = {
  id?: string;
  as?: Heading;
  children: ReactNode;
};

export function Title(props: TitleProps) {
  const Component = useContext(WithinSectionContext)
    ? TitleWithinSection
    : TitleWithinForm;
  return <Component {...props} />;
}

Title.displayName = "FormLayout.Title";

function TitleWithinForm(props: TitleProps) {
  const { as = "span", children, ...restProps } = props;
  return (
    <Text {...restProps} as={as} variant="heading3">
      {children}
    </Text>
  );
}

function TitleWithinSection(props: TitleProps) {
  const { as = "span", children, ...restProps } = props;
  return (
    <Text
      {...restProps}
      as={as}
      variant="heading5"
      aria-hidden="true"
      role="presentation"
    >
      {children}
    </Text>
  );
}
