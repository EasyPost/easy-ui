import React, { ReactNode } from "react";
import { Card } from "../Card";
import { HorizontalStack } from "../HorizontalStack";
import type { ToggleProps } from "../Toggle";
import { Toggle } from "../Toggle";

import styles from "./ToggleCard.module.scss";

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
 * `<ToggleCard.Header />` automatically handles the rendering for the `Toggle`
 * control and accepts the corresponding props. Consumers only need to pass in
 * the content to render alongside the `Toggle` control.
 *
 * `<ToggleCard.Body />` is responsible for rendering the body content.
 *
 * @example
 * _Controlled:_
 * ```tsx
 * <ToggleCard>
 *  <ToggleCard.Header
 *    isSelected={isSelected}
 *    onChange={(isSelected) => setIsSelected(isSelected)}
 *    aria-labelledby="some id"
 *  >
 *    <Text id="some id" variant="subtitle1" color="primary.900">
 *      Header
 *    </Text>
 *  </ToggleCard.Header>
 *  <ToggleCard.Body>Content</ToggleCard.Body>
 * </ToggleCard>
 * ```
 *
 * @example
 * _Disabled:_
 * ```tsx
 * <ToggleCard>
 *  <ToggleCard.Header isDisabled aria-labelledby="some id">
 *    <Text id="some id" variant="subtitle1" color="primary.900">
 *      Header
 *    </Text>
 *  </ToggleCard.Header>
 *  <ToggleCard.Body>Content</ToggleCard.Body>
 * </ToggleCard>
 * ```
 *
 * @example
 * _Read-Only:_
 * ```tsx
 * <ToggleCard>
 *  <ToggleCard.Header isReadOnly aria-labelledby="some id">
 *    <Text id="some id" variant="subtitle1" color="primary.900">
 *      Header
 *    </Text>
 *  </ToggleCard.Header>
 *  <ToggleCard.Body>Content</ToggleCard.Body>
 * </ToggleCard>
 * ```
 *
 * @example
 * _Toggle position:_
 * ```tsx
 * <ToggleCard>
 *  <ToggleCard.Header togglePosition="start" aria-label="carrier activation">
 *    <Icon size="sm" symbol={PoweredByEasyPostLogo}>
 *  </ToggleCard.Header>
 *  <ToggleCard.Body>Content</ToggleCard.Body>
 * </ToggleCard>
 * ```
 */
export function ToggleCard(props: ToggleCardProps) {
  const { children } = props;

  return <Card.Container>{children}</Card.Container>;
}
export type ToggleCardHeaderProps = Omit<ToggleProps, "children"> & {
  /**
   * Position of toggle; by default,
   * the toggle control is positioned to the end.
   * @default end
   */
  togglePosition?: "start" | "end";
  /**
   * Children for toggle control.
   */
  toggleChildren?: ReactNode;
  /**
   * Header content of card
   */
  children: ReactNode;
};

function ToggleCardHeader(props: ToggleCardHeaderProps) {
  const {
    children,
    togglePosition = "end",
    toggleChildren,
    ...toggleProps
  } = props;

  return (
    <Card.Area background="neutral.050" padding="0.5">
      <HorizontalStack gap="2" align="space-between" blockAlign="center">
        {togglePosition === "start" ? (
          <>
            <Toggle {...toggleProps}>{toggleChildren}</Toggle>
            {children}
          </>
        ) : (
          <>
            {children}
            <Toggle {...toggleProps}>{toggleChildren}</Toggle>
          </>
        )}
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
    <Card.Area padding="0.5">
      <div className={styles.body}>{children}</div>
    </Card.Area>
  );
}

/** Represents the header content in a `<ToggleCard />`*/
ToggleCard.Header = ToggleCardHeader;

/** Represents the body content in a `<ToggleCard />`*/
ToggleCard.Body = ToggleCardBody;
