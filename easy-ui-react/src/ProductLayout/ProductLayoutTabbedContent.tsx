import { AriaLabelingProps } from "@react-types/shared";
import React, { ReactElement, ReactNode } from "react";

export type ProductLayoutTabbedContentProps = AriaLabelingProps & {
  children: ReactNode;
  tabs: ReactElement[];
};

export function ProductLayoutTabbedContent(
  props: ProductLayoutTabbedContentProps,
) {
  const { children } = props;
  return <div>{children}</div>;
}
