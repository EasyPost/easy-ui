import React, { ReactNode } from "react";
import { Card } from "../Card";
import { Toggle, ToggleProps } from "../Toggle";
import { HorizontalGrid } from "../HorizontalGrid";
import { HorizontalStack } from "../HorizontalStack";

export type SplitToggleCardProps = ToggleProps & {
  /**
   * Card children.
   */
  children: ReactNode;
};

/**
 * An interactive binary control with related content.
 *
 * @remarks
 * Use a SplitToggleCard when an "on/off" or "yes/no" input is
 * needed with related content.
 *
 * @example
 * ```tsx
 * <SplitToggleCard>
 *   <Text>Toggle Label</Text>
 * </SplitToggleCard>
 * ```
 *
 * @example
 * _Default value:_
 * ```tsx
 * <SplitToggleCard defaultSelected={true}>
 *   <Text>Toggle Label</Text>
 * </SplitToggleCard>
 * ```
 *
 * @example
 * _Controlled:_
 * ```tsx
 * <SplitToggleCard
 *   isSelected={isSelected}
 *   onChange={(isSelected) => setIsSelected(isSelected)}
 * >
 *   <Text>Toggle Label</Text>
 * </SplitToggleCard>
 * ```
 *
 * @example
 * _Disabled:_
 * <SplitToggleCard isDisabled={true}>
 *   <Text>Toggle Label</Text>
 * </SplitToggleCard>
 *
 * @example
 * _Read-only:_
 * ```tsx
 * <SplitToggleCard isSelected={true} isReadOnly={true}>
 *   <Text>Toggle Label</Text>
 * </SplitToggleCard>
 * ```
 */

export const SplitToggleCard = (props: SplitToggleCardProps) => {
  const { children, ...toggleProps } = props;

  return (
    <Card.Container>
      <HorizontalGrid columns={["80px", "1fr"]}>
        <Card.Area background="secondary" padding="3">
          <HorizontalStack align="center">
            <Toggle {...toggleProps} />
          </HorizontalStack>
        </Card.Area>
        <Card.Area background="primary" padding="2">
          {children}
        </Card.Area>
      </HorizontalGrid>
    </Card.Container>
  );
};
