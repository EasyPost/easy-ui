import omit from "lodash/omit";
import React, { ComponentProps, ElementType, ReactNode } from "react";
import {
  classNames,
  getComponentThemeToken,
  variationName,
} from "../utilities/css";

import styles from "./Card.module.scss";

export type CardAs = "a" | "button" | "div" | "fieldset" | "label";
export type CardBackground = "primary" | "secondary";
export type CardVariant = "solid" | "outlined" | "flagged";
export type FlaggedCardStatus = "danger" | "warning" | "success";

type BaseCardContainerProps = {
  as?: CardAs;
  variant?: CardVariant;
  children: ReactNode;
} & ComponentProps<ElementType>;

export type SolidCardContainerProps = {
  variant: "solid";
} & BaseCardContainerProps;

export type OutlinedCardContainerProps = {
  isDisabled?: boolean;
  isSelected?: boolean;
  variant: "outlined";
} & BaseCardContainerProps;

export type FlaggedCardContainerProps = {
  status: FlaggedCardStatus;
  variant: "flagged";
} & BaseCardContainerProps;

export type CardContainerProps =
  | FlaggedCardContainerProps
  | SolidCardContainerProps
  | OutlinedCardContainerProps;

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
