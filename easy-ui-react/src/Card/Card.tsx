import omit from "lodash/omit";
import React, { AllHTMLAttributes, ElementType, ReactNode } from "react";
import {
  classNames,
  getComponentThemeToken,
  variationName,
} from "../utilities/css";

import styles from "./Card.module.scss";

const DEFAULT_ELEMENT_TYPE = "div";
const DEFAULT_VARIANT = "outlined";

export type CardBackground = "primary" | "secondary";
export type CardVariant = "solid" | "outlined" | "flagged";
export type CardStatus = "danger" | "warning" | "success";

export type CardContainerProps = {
  /** Custom element for the card container. */
  as?: ElementType;

  /** Content of the card. */
  children: ReactNode;

  /** Render the card as disabled. Noticeable only on outlined cards. */
  isDisabled?: boolean;

  /** Render the card as selected. Noticeable only on outlined cards. */
  isSelected?: boolean;

  /**
   * Card status. Noticeable only on flagged cars.
   */
  status?: CardStatus;

  /**
   * Card variant.
   * @default solid
   */
  variant?: CardVariant;
} & AllHTMLAttributes<ElementType>;

export type CardAreaProps = {
  /** Background of the card area. By default, card backgrounds are transparent. */
  background?: CardBackground;

  /** Content of the card area. */
  children: ReactNode;
};

export type CardProps = CardContainerProps & CardAreaProps;

function CardContainer(props: CardContainerProps) {
  const {
    as: As = DEFAULT_ELEMENT_TYPE,
    children,
    isDisabled,
    isSelected,
    status,
    variant = DEFAULT_VARIANT,
    ...restProps
  } = props;
  const className = classNames(
    styles.container,
    styles[variationName("variant", variant)],
    variant === "flagged" && status && styles[variationName("status", status)],
    variant === "outlined" && isDisabled && styles.disabled,
    variant === "outlined" && isSelected && styles.selected,
  );

  if (variant !== "flagged" && status) {
    console.warn("status is only applicable for flagged cards");
  }

  if (variant !== "outlined" && isSelected) {
    console.warn("isSelected is only applicable for outlined cards");
  }

  return (
    <As
      className={className}
      data-testid="container"
      disabled={isDisabled}
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
    <div className={styles.area} style={style} data-testid="area">
      {children}
    </div>
  );
}

/**
 * A styled container that groups related content.
 *
 * @remarks
 * Basic cards are implemented using `<Card />`. For more complex use cases,
 * `<Card.Container />` and `<Card.Area />` can be used to control
 * individual pieces.
 *
 * @example
 * _Solid:_
 * ```tsx
 * <Card>Content</Card>
 * ```
 *
 * @example
 * _Outlined:_
 * ```tsx
 * <Card variant="outlined">Content</Card>
 * ```
 *
 * @example
 * _Flagged:_
 * ```tsx
 * <Card variant="flagged" status="danger">Content</Card>
 * ```
 *
 * @example
 * _Composition of parts:_
 * ```tsx
 * <Card.Container variant="outlined">
 *   <HorizontalGrid columns={2}>
 *     <Card.Area background="primary">
 *       <Placeholder width="auto" />
 *     </Card.Area>
 *     <Card.Area background="secondary">
 *       <Placeholder width="auto" />
 *     </Card.Area>
 *   </HorizontalGrid>
 * </Card.Container>
 * ```
 */
export function Card(props: CardProps) {
  const { background, children, ...containerProps } = props;
  return (
    <CardContainer {...containerProps}>
      <CardArea background={background}>{children}</CardArea>
    </CardContainer>
  );
}

/**
 * Represents the outer container of a `<Card />`.
 *
 * @remarks
 * Should likely contain a `<Card.Area />` within.
 */
Card.Container = CardContainer;

/**
 * Represents the inner container of a `<Card />`.
 *
 * @remarks
 * Should likely be within a `<Card.Container />`.
 */
Card.Area = CardArea;
