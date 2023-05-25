import omit from "lodash/omit";
import React, { ComponentProps, ElementType, ReactNode } from "react";
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
export type CardAs = "div" | "label" | "button" | "a" | "fieldset";

export type CardContainerProps<T extends CardAs = "div"> = {
  as?: T;
  isDisabled?: boolean;
  isSelected?: boolean;
  variant?: CardVariant;
  children: ReactNode;
};

export type CardAreaProps = {
  background?: CardBackground;
  children: ReactNode;
};

export type CardProps<T extends CardAs> = CardContainerProps<T> & CardAreaProps;

function CardContainer(
  props: CardProps<"div"> & ComponentProps<"div">,
): React.JSX.Element;
function CardContainer(
  props: CardProps<"button"> & ComponentProps<"button">,
): React.JSX.Element;
function CardContainer(
  props: CardProps<"a"> & ComponentProps<"a">,
): React.JSX.Element;
function CardContainer(
  props: CardProps<"label"> & ComponentProps<"label">,
): React.JSX.Element;
function CardContainer(
  props: CardProps<"fieldset"> & ComponentProps<"fieldset">,
): React.JSX.Element;
function CardContainer(
  props: CardProps<CardAs> & ComponentProps<ElementType>,
): React.JSX.Element;
function CardContainer({
  as: As = "div",
  isDisabled = false,
  isSelected = false,
  variant = "solid",
  children,
  ...restProps
}: CardProps<CardAs>) {
  const className = classNames(
    styles.container,
    styles[variationName("variant", variant)],
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

export function Card(
  props: CardProps<"div"> & ComponentProps<"div">,
): React.JSX.Element;
export function Card(
  props: CardProps<"a"> & ComponentProps<"a">,
): React.JSX.Element;
export function Card(
  props: CardProps<"label"> & ComponentProps<"label">,
): React.JSX.Element;
export function Card(
  props: CardProps<"button"> & ComponentProps<"button">,
): React.JSX.Element;
export function Card(
  props: CardProps<"fieldset"> & ComponentProps<"fieldset">,
): React.JSX.Element;
export function Card(
  props: CardProps<CardAs> & ComponentProps<ElementType>,
): React.JSX.Element;
export function Card(props: CardProps<CardAs>) {
  const { background, children, ...containerProps } = props;
  return (
    <CardContainer {...containerProps}>
      <CardArea background={background}>{children}</CardArea>
    </CardContainer>
  );
}

Card.Container = CardContainer;
Card.Area = CardArea;
