import omit from "lodash/omit";
import React, { AllHTMLAttributes, ElementType, ReactNode } from "react";
import {
  DesignTokenNamespace,
  ShadowLevel,
  BorderRadius,
  ThemeTokenNamespace,
} from "../types";
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
const DEFAULT_PADDING = "2";
const DEFAULT_BORDER_RADIUS = "md";

type SpaceScale = DesignTokenNamespace<"space">;

export type CardBackground =
  | "primary"
  | "secondary"
  | ThemeTokenNamespace<"color">;
export type CardVariant = "solid" | "outlined" | "flagged";
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

  /**
   * Card shadow.
   */
  boxShadow?: ShadowLevel;

  /**
   * Card border radius.
   */
  borderRadius?: BorderRadius;
} & AllHTMLAttributes<ElementType>;

export type CardAreaProps = {
  /** Background of the card area. By default, card backgrounds are transparent. */
  background?: CardBackground;

  /** Content of the card area. */
  children: ReactNode;

  /**
   * The spacing around the content area. Accepts a spacing token or an object of spacing tokens for different screen sizes.
   *
   * @example
   * padding='2'
   * padding={{ xs: '2', sm: '3', md: '4', lg: '5', xl: '6' }}
   */
  padding?: CardPadding;

  /**
   * The horizontal spacing around the content area. Accepts a spacing token or an object of spacing tokens for different screen sizes.
   *
   * @example
   * paddingX='2'
   * paddingX={{ xs: '2', sm: '3', md: '4', lg: '5', xl: '6' }}
   */
  paddingX?: CardPadding;

  /**
   * The vertical spacing around the content area. Accepts a spacing token or an object of spacing tokens for different screen sizes.
   *
   * @example
   * paddingY='2'
   * paddingY={{ xs: '2', sm: '3', md: '4', lg: '5', xl: '6' }}
   */
  paddingY?: CardPadding;
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
    boxShadow,
    borderRadius = DEFAULT_BORDER_RADIUS,
    ...restProps
  } = props;

  const className = classNames(
    styles.container,
    styles[variationName("variant", variant)],
    variant === "flagged" && status && styles[variationName("status", status)],
    variant === "outlined" && isDisabled && styles.disabled,
    variant === "outlined" && isSelected && styles.selected,
  );

  const style = {
    ...getComponentThemeToken("card", "box-shadow", "shadow.level", boxShadow),
    ...getComponentThemeToken(
      "card",
      "border-radius",
      "shape.border_radius",
      borderRadius,
    ),
  };

  if (variant !== "flagged" && status) {
    console.warn("status is only applicable for flagged cards");
  }

  if (variant !== "outlined" && isSelected) {
    console.warn("isSelected is only applicable for outlined cards");
  }

  return (
    <As
      className={className}
      style={style}
      data-testid="container"
      disabled={isDisabled}
      {...omit(restProps, ["className", "style"])}
    >
      {children}
    </As>
  );
}

function CardArea({
  background,
  children,
  padding,
  paddingX,
  paddingY,
}: CardAreaProps) {
  const { paddingTop, paddingBottom, paddingLeft, paddingRight } =
    getPaddingValues(padding, paddingX, paddingY);

  const style = {
    ...getComponentThemeToken(
      "card-area",
      "background",
      "color",
      getBackgroundToken(background),
    ),
    ...getResponsiveDesignToken(
      "card-area",
      "padding-top",
      "space",
      paddingTop as ResponsiveProp<SpaceScale>,
    ),
    ...getResponsiveDesignToken(
      "card-area",
      "padding-bottom",
      "space",
      paddingBottom as ResponsiveProp<SpaceScale>,
    ),
    ...getResponsiveDesignToken(
      "card-area",
      "padding-left",
      "space",
      paddingLeft as ResponsiveProp<SpaceScale>,
    ),
    ...getResponsiveDesignToken(
      "card-area",
      "padding-right",
      "space",
      paddingRight as ResponsiveProp<SpaceScale>,
    ),
  } as React.CSSProperties;

  return (
    <div className={styles.area} style={style} data-testid="area">
      {children}
    </div>
  );
}

/**
 * Extracts padding passed by consumer into top,
 * right, bottom, and left values
 *
 * @param padding card padding
 * @param paddingX horizontal card padding
 * @param paddingY vertical card padding
 * @returns extracted directional padding values
 */
function getPaddingValues(
  padding?: CardPadding,
  paddingX?: CardPadding,
  paddingY?: CardPadding,
) {
  if (padding) {
    return {
      paddingTop: padding,
      paddingBottom: padding,
      paddingLeft: padding,
      paddingRight: padding,
    };
  }

  if (paddingX || paddingY) {
    return {
      paddingTop: paddingY,
      paddingBottom: paddingY,
      paddingLeft: paddingX,
      paddingRight: paddingX,
    };
  }

  // default
  return {
    paddingTop: DEFAULT_PADDING,
    paddingBottom: DEFAULT_PADDING,
    paddingLeft: DEFAULT_PADDING,
    paddingRight: DEFAULT_PADDING,
  };
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
 * <Card boxShadow="1">Content</Card>
 * ```
 *
 * @example
 * _Border radius:_
 * ```tsx
 * <Card borderRadius="sm">Content</Card>
 * ```
 *
 * @example
 * _Padding:_
 * ```tsx
 * <Card padding={{ xs: '2', sm: '3', md: '4', lg: '5', xl: '6' }}>Content</Card>
 * ```
 *
 * @example
 * _PaddingX:_
 * ```tsx
 * <Card paddingX="3">Content</Card>
 * ```
 *
 * @example
 * _PaddingY:_
 * ```tsx
 * <Card paddingY={{ xs: '1', sm: '2', md: '3'}}>Content</Card>
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
  const {
    background,
    children,
    padding,
    paddingX,
    paddingY,
    ...containerProps
  } = props;
  return (
    <CardContainer {...containerProps}>
      <CardArea
        background={background}
        padding={padding}
        paddingX={paddingX}
        paddingY={paddingY}
      >
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
