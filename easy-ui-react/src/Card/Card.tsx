import omit from "lodash/omit";
import React, { AllHTMLAttributes, ElementType, ReactNode } from "react";
import { DesignTokenNamespace } from "../types";
import {
  ResponsiveProp,
  classNames,
  getComponentThemeToken,
  getResponsiveDesignToken,
  variationName,
} from "../utilities/css";

import styles from "./Card.module.scss";

const DEFAULT_ELEMENT_TYPE = "div";
const DEFAULT_VARIANT = "outlined";

type SpaceScale = DesignTokenNamespace<"space">;

export type CardBackground = "primary" | "secondary";
export type CardVariant = "solid" | "outlined" | "flagged" | "shadow";
export type CardStatus = "danger" | "warning" | "success" | "neutral";
export type CardPadding = ResponsiveProp<SpaceScale>;

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
   * Card status. Noticeable only on flagged cards.
   */
  status?: CardStatus;

  /**
   * Card variant.
   * @default outlined
   */
  variant?: CardVariant;
} & AllHTMLAttributes<ElementType>;

export type CardAreaProps = {
  /** Background of the card area. By default, card backgrounds are transparent. */
  background?: CardBackground;

  /** Content of the card area. */
  children: ReactNode;

  /**
   * The spacing around the content area. Accepts a spacing token or an object of spacing tokens for different screen sizes.
   *
   * @default '2'
   * @example
   * padding='2'
   * padding={{ xs: '2', sm: '3', md: '4', lg: '5', xl: '6' }}
   */
  padding?: CardPadding;
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

function CardArea({ background, children, padding = "2" }: CardAreaProps) {
  const style = {
    ...getComponentThemeToken(
      "card-area",
      "background",
      "color",
      getBackgroundToken(background),
    ),
    ...getResponsiveDesignToken("card-area", "padding", "space", padding),
  } as React.CSSProperties;
  return (
    <div className={styles.area} style={style} data-testid="area">
      {children}
    </div>
  );
}

function getBackgroundToken(background: CardAreaProps["background"]) {
  const tokens = {
    primary: "neutral.000",
    secondary: "neutral.050",
  };
  if (background && tokens.hasOwnProperty(background)) {
    return tokens[background as keyof typeof tokens];
  }
  return background;
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
 * _Shadow:_
 * ```tsx
 * <Card variant="shadow">Content</Card>
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
  const { background, children, padding, ...containerProps } = props;
  return (
    <CardContainer {...containerProps}>
      <CardArea background={background} padding={padding}>
        {children}
      </CardArea>
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
