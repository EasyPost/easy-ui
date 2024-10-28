import React, { ReactNode, useMemo } from "react";
import { Card } from "../Card";
import { HorizontalStack } from "../HorizontalStack";
import {
  flattenChildren,
  getDisplayNameFromReactNode,
} from "../utilities/react";

export type ToggleCardProps = {
  /**
   * The children of the <ToggleCard> element. Should render
   * `<ToggleCard.Header>` and `<ToggleCard.Body>`
   */
  children: ReactNode;
};

/**
 * A `<ToggleCard />` is a styled container with an interactive
 * header featuring a toggle control.
 *
 * @remarks
 * It is a simple compound component consisting of `<ToggleCard.Header />`
 * and `<ToggleCard.Body />`.
 *
 * `<ToggleCard.Header />` should handle the rendering for the `Toggle`
 * control and the content alongside it.
 *
 * `<ToggleCard.Body />` is responsible for rendering the body content.
 *
 * @example
 * _Controlled:_
 * ```tsx
 * <ToggleCard>
 *  <ToggleCard.Header>
 *    <Text id="some id" variant="subtitle1" color="primary.900">
 *      header
 *    </Text>
 *    <Toggle
 *      aria-labelledby="some id"
 *      isSelected={isSelected}
 *      onChange={(isSelected) => setIsSelected(isSelected)}
 *     />
 *  </ToggleCard.Header>
 *  <ToggleCard.Body>body</ToggleCard.Body>
 * </ToggleCard>
 * ```
 *
 * @example
 * _Disabled:_
 * ```tsx
 * <ToggleCard>
 *  <ToggleCard.Header>
 *    <Text id="some id" variant="subtitle1" color="primary.900">
 *      header
 *    </Text>
 *    <Toggle aria-labelledby="some id" isDisabled />
 *  </ToggleCard.Header>
 *  <ToggleCard.Body>body</ToggleCard.Body>
 * </ToggleCard>
 * ```
 *
 * @example
 * _Read-Only:_
 * ```tsx
 * <ToggleCard>
 *  <ToggleCard.Header>
 *    <Text id="some id" variant="subtitle1" color="primary.900">
 *      header
 *    </Text>
 *    <Toggle aria-labelledby="some id" isReadOnly />
 *  </ToggleCard.Header>
 *  <ToggleCard.Body>body</ToggleCard.Body>
 * </ToggleCard>
 * ```
 */
export function ToggleCard(props: ToggleCardProps) {
  const { children } = props;

  return <Card.Container borderRadius="lg">{children}</Card.Container>;
}
export type ToggleCardHeaderProps = {
  /**
   * Header content of card
   */
  children: ReactNode;
};

function ToggleCardHeader(props: ToggleCardHeaderProps) {
  const { children } = props;

  useMemo(() => {
    const headerChildren = flattenChildren(children);
    let foundToggle = false;
    for (let i = 0; i < headerChildren.length; i++) {
      if (getDisplayNameFromReactNode(headerChildren[i]) === "Toggle") {
        foundToggle = true;
        break;
      }
    }
    if (!foundToggle) {
      throw new Error("ToggleCard.Header must contain Toggle");
    }
  }, [children]);

  return (
    <Card.Area background="neutral.050" padding="0.5">
      <HorizontalStack gap="2" align="space-between" blockAlign="center">
        {children}
      </HorizontalStack>
    </Card.Area>
  );
}

export type ToggleCardBodyProps = {
  /**
   * Body content of card
   */
  children: ReactNode;
};

function ToggleCardBody(props: ToggleCardBodyProps) {
  const { children } = props;

  return (
    <Card.Area padding={{ paddingX: "0.5", paddingY: "1" }}>
      {children}
    </Card.Area>
  );
}

/** Represents the header content in a `<ToggleCard />`*/
ToggleCard.Header = ToggleCardHeader;

/** Represents the body content in a `<ToggleCard />`*/
ToggleCard.Body = ToggleCardBody;
