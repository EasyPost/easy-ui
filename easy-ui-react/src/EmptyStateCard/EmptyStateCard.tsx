import React, { ReactNode, useMemo } from "react";
import { Text, TextProps } from "../Text";
import { Card } from "../Card";
import { VerticalStack } from "../VerticalStack";
import {
  flattenChildren,
  getDisplayNameFromReactNode,
} from "../utilities/react";
import { ResponsiveSpaceScale } from "../types";

export type EmptyStateCardProps = {
  /**
   * The children of the <EmptyStateCard> element. Should render
   * `<EmptyStateCard.Header>`, `<EmptyStateCard.Body>`, and
   * `<EmptyStateCard.Action>` at minimum.
   */
  children: ReactNode;
  /**
   * Gap between `<EmptyStateCard.Header>` and `<EmptyStateCard.Body>`
   * @default 2
   */
  gapBetweenHeaderAndBody?: ResponsiveSpaceScale;
  /**
   * Gap between `<EmptyStateCard.Body>` and `<EmptyStateCard.Action>`
   * @default 2
   */
  gapBetweenBodyAndAction?: ResponsiveSpaceScale;
  /**
   * Content alignment
   * @default start
   */
  contentAlignment?: "start" | "center";
};

/**
 * An `<EmptyStateCard />` is a styled container with a header, body, and action sections,
 * designed to display relevant information when there is no nearby data to display.
 *
 * @remarks
 * Supports custom spacing between elements and center alignment.
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
    gapBetweenBodyAndAction = "2",
    gapBetweenHeaderAndBody = "2",
    contentAlignment = "start",
  } = props;

  const { header, body, action } = useMemo(() => {
    const topLevelChildren = flattenChildren(children);
    const size = topLevelChildren.length;

    const header = getEmptyStateCardNode(
      size > 0 ? topLevelChildren[0] : null,
      "EmptyStateCard.Header",
    );

    const body = getEmptyStateCardNode(
      size > 1 ? topLevelChildren[1] : null,
      "EmptyStateCard.Body",
    );

    const action = getEmptyStateCardNode(
      size > 2 ? topLevelChildren[2] : null,
      "EmptyStateCard.Action",
    );

    return {
      header,
      body,
      action,
    };
  }, [children]);

  return (
    <Card background="primary.800" borderRadius="lg" padding="5" boxShadow="1">
      <VerticalStack
        gap={gapBetweenBodyAndAction}
        inlineAlign={contentAlignment}
      >
        <VerticalStack gap={gapBetweenHeaderAndBody}>
          {header}
          {body}
        </VerticalStack>
        {action}
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

function getEmptyStateCardNode(node: ReactNode, displayName: string) {
  if (!node || getDisplayNameFromReactNode(node) !== displayName) {
    throw new Error(`EmptyStateCard must contain ${displayName}`);
  }

  return node;
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
