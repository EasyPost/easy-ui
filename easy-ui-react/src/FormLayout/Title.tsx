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
  const sectionContext = useContext(WithinSectionContext);
  const { as = "span", children, ...restProps } = props;

  if (sectionContext && props.as) {
    throw new Error(`"as" is not a valid prop on a Title within a Section.`);
  }

  return (
    <Text
      {...restProps}
      as={sectionContext ? "legend" : as}
      variant={sectionContext ? "heading5" : "heading3"}
    >
      {children}
    </Text>
  );
}
