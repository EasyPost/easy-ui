import React, { ReactNode } from "react";
import { Card } from "../Card";
import { Checkbox, CheckboxProps } from "../Checkbox";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";

import styles from "./CheckableCard.module.scss";

export type CheckableCardProps = Omit<CheckboxProps, "size"> & {
  /**
   * The header for the checkable card.
   */
  header: ReactNode;

  /**
   * The content for the checkable card.
   */
  children: ReactNode;
};

/**
 * A styled container with a `Checkbox` form element.
 *
 * @example
 * ```tsx
 * <CheckableCard
 *   isSelected={isSelected}
 *   onChange={(isSelected) => setIsSelected(isSelected)}
 *   header="Header"
 * >
 *   Content
 * </CheckableCard>
 * ```
 */
export function CheckableCard(props: CheckableCardProps) {
  const { header, children, ...checkboxProps } = props;
  return (
    <Card>
      <VerticalStack gap="2">
        <HorizontalStack gap="1.5" blockAlign="center">
          <VerticalStack gap="1">
            <Checkbox {...checkboxProps} size="lg">
              <Text weight="semibold" as="h3">
                {header}
              </Text>
            </Checkbox>
            <div className={styles.textContainer}>
              <Text weight="medium" color="gray.resting">
                {children}
              </Text>
            </div>
          </VerticalStack>
        </HorizontalStack>
      </VerticalStack>
    </Card>
  );
}
