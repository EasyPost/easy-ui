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

ToggleCard.Header = ToggleCardHeader;

ToggleCard.Body = ToggleCardBody;
