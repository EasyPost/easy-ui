import React, { ReactNode } from "react";
import { Text } from "../Text";

export type ProductLayoutHeaderProps = {
  title: ReactNode;
  helpMenuItems: ReactNode[];
  primaryAction?: ProductLayoutHeaderActionProps;
  secondaryAction?: ProductLayoutHeaderActionProps;
};

export type ProductLayoutHeaderActionProps = {
  content: string;
  onAction: () => void;
  isDisabled?: boolean;
};

export function ProductLayoutHeader(props: ProductLayoutHeaderProps) {
  const { title } = props;
  return (
    <header>
      <Text as="h2">{title}</Text>
    </header>
  );
}
