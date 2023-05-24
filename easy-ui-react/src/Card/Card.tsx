import React, { ReactNode } from "react";
import {
  classNames,
  getComponentThemeToken,
  variationName,
} from "../utilities/css";

import styles from "./Card.module.scss";

export type CardBackground = "primary" | "subdued";
export type CardVariant =
  | "solid"
  | "outlined"
  | "danger"
  | "warning"
  | "success";

export type CardContainerProps = {
  variant?: CardVariant;
  children: ReactNode;
};

export type CardAreaProps = {
  background?: CardBackground;
  children: ReactNode;
};

export type CardProps = CardContainerProps & CardAreaProps;

function CardContainer({ variant = "solid", children }: CardContainerProps) {
  const className = classNames(
    styles.container,
    styles[variationName("variant", variant)],
  );
  return <div className={className}>{children}</div>;
}

function CardArea({ background, children }: CardAreaProps) {
  const style = {
    ...getComponentThemeToken(
      "card-area",
      "background",
      "color.surface.card",
      background,
    ),
  } as React.CSSProperties;
  return (
    <div className={styles.area} style={style}>
      {children}
    </div>
  );
}

export function Card(props: CardProps) {
  const { background, children, variant } = props;
  return (
    <CardContainer variant={variant}>
      <CardArea background={background}>{children}</CardArea>
    </CardContainer>
  );
}

Card.Container = CardContainer;
Card.Area = CardArea;
