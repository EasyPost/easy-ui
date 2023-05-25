import omit from "lodash/omit";
import React, { ComponentProps, ElementType, ReactNode } from "react";
import {
  classNames,
  getComponentThemeToken,
  variationName,
} from "../utilities/css";

import styles from "./Card.module.scss";

export type CardAs = "div" | "label" | "button" | "a" | "fieldset";
export type CardBackground = "primary" | "secondary";
export type CardStatus = "danger" | "warning" | "success";
export type CardVariant = "solid" | "outlined" | "flagged";

type BaseCardContainerProps = {
  as?: CardAs;
  isDisabled?: boolean;
  isSelected?: boolean;
  variant?: CardVariant;
  children: ReactNode;
} & ComponentProps<ElementType>;

export type StandardCardContainerProps = {
  variant: "solid" | "outlined";
} & BaseCardContainerProps;

export type FlaggedCardContainerProps = {
  status: CardStatus;
  variant: "flagged";
} & BaseCardContainerProps;

export type CardContainerProps =
  | FlaggedCardContainerProps
  | StandardCardContainerProps;

export type CardAreaProps = {
  background?: CardBackground;
  children: ReactNode;
};

export type CardProps = CardContainerProps & CardAreaProps;

function CardContainer({
  as: As = "div",
  status,
  isDisabled = false,
  isSelected = false,
  variant = "flagged",
  children,
  ...restProps
}: CardProps) {
  const className = classNames(
    styles.container,
    styles[variationName("variant", variant)],
    variant === "flagged" && status && styles[variationName("status", status)],
    isDisabled && styles.disabled,
    isSelected && styles.selected,
  );
  return (
    <As
      className={className}
      disabled={"button" || "fieldset" ? isDisabled : undefined}
      {...omit(restProps, ["className"])}
    >
      {children}
    </As>
  );
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
  const { background, children, ...containerProps } = props;
  return (
    <CardContainer {...containerProps}>
      <CardArea background={background}>{children}</CardArea>
    </CardContainer>
  );
}

Card.Container = CardContainer;
Card.Area = CardArea;
