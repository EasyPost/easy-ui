import React, { ReactNode } from "react";

export type ProductLayoutContentProps = {
  children: ReactNode;
};

export function ProductLayoutContent(props: ProductLayoutContentProps) {
  const { children } = props;
  return <div>{children}</div>;
}
