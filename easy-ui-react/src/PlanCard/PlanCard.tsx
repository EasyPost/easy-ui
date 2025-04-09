import React, { ReactNode, useRef } from "react";
import { AriaLinkOptions, mergeProps, useHover, useLink } from "react-aria";
import { Card, CardProps } from "../Card";
import { Text, TextProps } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { UnstyledButton, UnstyledButtonProps } from "../UnstyledButton";

import styles from "./PlanCard.module.scss";

type ChildrenFn = ({ isHovered }: { isHovered: boolean }) => ReactNode;

export type PlanCardLinkProps = Omit<AriaLinkOptions, "children"> & {
  /**
   * The children of the `PlanCard.Link` element.
   */
  children: ChildrenFn | ReactNode;
};

export type PlanCardButtonProps = Omit<UnstyledButtonProps, "children"> & {
  /**
   * The children of the `PlanCard.Button` element.
   */
  children: ChildrenFn | ReactNode;
};

export type PlanCardProps = CardProps & {
  /**
   * The children of the `PlanCard` element.
   */
  children: ReactNode;
};

/**
 * A `<PlanCard />` is a styled container designed to display and
 * compare subscription plan information.
 *
 * @example
 * ```tsx
 * <PlanCard>
 *   <VerticalStack gap="2">
 *     <PlanCard.Callout>
 *       <Badge block>Active Plan</Badge>
 *     </PlanCard.Callout>
 *     <PlanCard.Header>
 *       <PlanCard.Title>Starter</PlanCard.Title>
 *       <PlanCard.Price>$10.00</PlanCard.Price>
 *       <PlanCard.Caption>Free Forever</PlanCard.Caption>
 *     </PlanCard.Header>
 *   </VerticalStack>
 *   <PlanCard.Features>
 *     <PlanCard.Feature>Feature 1</PlanCard.Feature>
 *     <PlanCard.Feature>Feature 2</PlanCard.Feature>
 *     <PlanCard.Feature>Feature 3</PlanCard.Feature>
 *     <PlanCard.Feature>Feature 4</PlanCard.Feature>
 *     <PlanCard.Feature>Feature 5</PlanCard.Feature>
 *   </PlanCard.Features>
 *   <PlanCard.Illustration>
 *     <PlanCardStartupIllustration />
 *   </PlanCard.Illustration>
 * </PlanCard>
 * ```
 */
export function PlanCard(props: PlanCardProps) {
  const { children, ...cardProps } = props;
  return (
    <Card
      variant="outlined"
      background="neutral.000"
      borderColor="neutral.200"
      borderRadius="lg"
      paddingY="2"
      paddingX="4"
      {...cardProps}
    >
      <VerticalStack gap="3">{children}</VerticalStack>
    </Card>
  );
}

function PlanCardLink({ children, ...props }: PlanCardLinkProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const { isHovered, hoverProps } = useHover(props);
  const { linkProps } = useLink(props, ref);
  return (
    <a ref={ref} className={styles.link} {...mergeProps(hoverProps, linkProps)}>
      {typeof children === "function" ? children({ isHovered }) : children}
    </a>
  );
}

function PlanCardButton({ children, ...props }: PlanCardButtonProps) {
  const { isHovered, hoverProps } = useHover({});
  return (
    <UnstyledButton
      className={styles.button}
      {...mergeProps(hoverProps, props)}
    >
      {typeof children === "function" ? children({ isHovered }) : children}
    </UnstyledButton>
  );
}

function PlanCardHeader({ children }: { children: ReactNode }) {
  return (
    <VerticalStack gap="0.5" inlineAlign="center">
      {children}
    </VerticalStack>
  );
}

function PlanCardCallout({ children }: { children?: ReactNode }) {
  return <div className={styles.callout}>{children}</div>;
}

function PlanCardTitle({ children, ...textProps }: TextProps) {
  return (
    <Text as="h3" variant="heading5" color="neutral.600" {...textProps}>
      {children}
    </Text>
  );
}

function PlanCardPrice({ children, ...textProps }: TextProps) {
  return (
    <Text
      variant="heading2"
      weight="normal"
      color="neutral.800"
      fontVariantNumeric="tabular-nums"
      {...textProps}
    >
      {children}
    </Text>
  );
}

function PlanCardCaption({ children, ...textProps }: TextProps) {
  return (
    <Text variant="caption" color="primary.800" {...textProps}>
      {children}
    </Text>
  );
}

function PlanCardFeatures({ children }: { children: ReactNode }) {
  return (
    <VerticalStack gap="1" inlineAlign="center">
      {children}
    </VerticalStack>
  );
}

function PlanCardFeature({ children, ...textProps }: TextProps) {
  return (
    <Text variant="body2" color="primary.800" {...textProps}>
      {children}
    </Text>
  );
}

function PlanCardIllustration({ children }: { children: ReactNode }) {
  return <div className={styles.illustration}>{children}</div>;
}

/**
 * Wrap a `PlanCard` in a button element. Useful for making actions on a `PlanCard`.
 */
PlanCard.Button = PlanCardButton;

/**
 * Wrap a `PlanCard` in a link element. Useful for making navigation on a `PlanCard`.
 */
PlanCard.Link = PlanCardLink;

/**
 * Represents the header of a `<PlanCard />`.
 */
PlanCard.Header = PlanCardHeader;

/**
 * Represents the callout of a `<PlanCard />`. Can be empty or contain a `<Badge />`.
 */
PlanCard.Callout = PlanCardCallout;

/**
 * Represents the title text of a `<PlanCard />`. Supports all `<Text />` props.
 * @see {@link Text}
 */
PlanCard.Title = PlanCardTitle;

/**
 * Represents the title text of a `<PlanCard />`. Supports all `<Text />` props.
 * @see {@link Text}
 */
PlanCard.Price = PlanCardPrice;

/**
 * Represents the title text of a `<PlanCard />`. Supports all `<Text />` props.
 * @see {@link Text}
 */
PlanCard.Caption = PlanCardCaption;

/**
 * Represents a feature list of a `<PlanCard />`.
 */
PlanCard.Features = PlanCardFeatures;

/**
 * Represents a feature of a `<PlanCard />`. Supports all `<Text />` props.
 * @see {@link Text}
 */
PlanCard.Feature = PlanCardFeature;

/**
 * Represents the bottom illustration of a `<PlanCard />`. Supports any image or SVG as children.
 */
PlanCard.Illustration = PlanCardIllustration;
