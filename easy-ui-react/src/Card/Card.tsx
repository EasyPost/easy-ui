import omit from "lodash/omit";
import React, { AllHTMLAttributes, ElementType, ReactNode } from "react";
import {
  classNames,
  getComponentThemeToken,
  variationName,
} from "../utilities/css";

import styles from "./Card.module.scss";

export type CardBackground = "primary" | "secondary";
export type CardVariant = "solid" | "outlined" | "flagged";
export type FlaggedCardStatus = "danger" | "warning" | "success";

type BaseCardContainerProps = {
  as?: ElementType;
  children: ReactNode;
} & AllHTMLAttributes<ElementType>;

export type SolidCardContainerProps = {
  variant?: "solid";
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
  | SolidCardContainerProps
  | OutlinedCardContainerProps
  | FlaggedCardContainerProps;

export type CardAreaProps = {
  background?: CardBackground;
  children: ReactNode;
};

export type CardProps = CardContainerProps & CardAreaProps;

function CardContainer(props: CardProps) {
  const As = props.as || "div";
  const className = classNames(
    styles.container,
    styles[variationName("variant", props.variant || "solid")],
    props.variant === "flagged" &&
      props.status &&
      styles[variationName("status", props.status)],
    props.variant === "outlined" && props.isDisabled && styles.disabled,
    props.variant === "outlined" && props.isSelected && styles.selected,
  );
  return (
    <As
      className={className}
      data-testid="container"
      disabled={
        "button" || "fieldset"
          ? props.variant === "outlined" && props.isDisabled
          : undefined
      }
      {...omit(props, [
        "className",
        "children",
        "isDisabled",
        "isSelected",
        "status",
        "variant",
      ])}
    >
      {props.children}
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
    <div className={styles.area} style={style} data-testid="area">
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
