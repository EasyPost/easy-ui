import React, { ReactNode } from "react";
import { Text, TextProps } from "../Text";
import { Card } from "../Card";
import { VerticalStack, VerticalStackProps } from "../VerticalStack";

export type EmptyStateCardProps = Omit<
  VerticalStackProps,
  "children" | "as" | "reverseOrder"
> & {
  /**
   * The children of the <EmptyStateCard> element. Should render
   * `<EmptyStateCard.Header>`, `<EmptyStateCard.Body>`, and
   * `<EmptyStateCard.Action>` at minimum.
   */
  children: ReactNode;
};

/**
 * An `<EmptyStateCard />` is a styled container with a header, body, and action sections,
 * designed to display relevant information when there is no nearby data to display.
 *
 * @remarks
 * Can accept a subset of properties from the `<VerticalStack />` component to assist
 * with custom content alignment.
 *
 * @example
 * ```tsx
 * <EmptyStateCard>
 *  <EmptyStateCard.Header>
 *    <EmptyStateCard.HeaderText>
 *      Shipment Insurance
 *    </EmptyStateCard.HeaderText>
 *  </EmptyStateCard.Header>
 *  <EmptyStateCard.Body>
 *    <EmptyStateCard.BodyText>
 *      Rest easy knowing if one of your customers orders is damaged, lost
 *      in transit or stolen you are covered! Automatically add insurance to
 *      all your shipments
 *    </EmptyStateCard.BodyText>
 *  </EmptyStateCard.Body>
 *  <EmptyStateCard.Action>
 *    <Button>Manage Insurance Settings</Button>
 *  </EmptyStateCard.Action>
 * </EmptyStateCard>
 * ```
 */
export function EmptyStateCard(props: EmptyStateCardProps) {
  const {
    children,
    gap = "2",
    align = "space-between",
    inlineAlign = "start",
    ...restVerticalStackProps
  } = props;

  return (
    <Card background="primary.800" borderRadius="lg" padding="5" boxShadow="1">
      <VerticalStack
        gap={gap}
        align={align}
        inlineAlign={inlineAlign}
        {...restVerticalStackProps}
      >
        {children}
      </VerticalStack>
    </Card>
  );
}
export type EmptyStateCardHeaderProps = {
  /**
   * Header content of card
   */
  children: ReactNode;
};

function EmptyStateCardHeader(props: EmptyStateCardHeaderProps) {
  const { children } = props;

  return <div>{children}</div>;
}

function EmptyStateCardHeaderText(props: TextProps) {
  const {
    variant = "heading5",
    color = "neutral.000",
    ...restTextProps
  } = props;

  return <Text variant={variant} color={color} {...restTextProps} />;
}

export type EmptyStateCardBodyProps = {
  /**
   * Body content of card
   */
  children: ReactNode;
};

function EmptyStateCardBody(props: EmptyStateCardBodyProps) {
  const { children } = props;

  return <div>{children}</div>;
}

function EmptyStateCardBodyText(props: TextProps) {
  const {
    variant = "subtitle1",
    color = "neutral.000",
    ...restTextProps
  } = props;

  return <Text variant={variant} color={color} {...restTextProps} />;
}

export type EmptyStateCardActionProps = {
  /**
   * Body content of card
   */
  children: ReactNode;
};

function EmptyStateCardAction(props: EmptyStateCardActionProps) {
  const { children } = props;

  return <div>{children}</div>;
}

/** Represents the header section in a `<EmptyStateCard />`*/
EmptyStateCard.Header = EmptyStateCardHeader;

/** Represents the header text in a `<EmptyStateCard.Header />`*/
EmptyStateCard.HeaderText = EmptyStateCardHeaderText;

/** Represents the body section in a `<EmptyStateCard />`*/
EmptyStateCard.Body = EmptyStateCardBody;

/** Represents the body text in a `<EmptyStateCard.Body />`*/
EmptyStateCard.BodyText = EmptyStateCardBodyText;

/** Represents the action section in a `<EmptyStateCard />`*/
EmptyStateCard.Action = EmptyStateCardAction;
