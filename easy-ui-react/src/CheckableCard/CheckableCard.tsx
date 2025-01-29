import React, { ReactNode, forwardRef } from "react";
import { Card } from "../Card";
import { Text } from "../Text";
import { Checkbox } from "../Checkbox";
import { HorizontalStack } from "../HorizontalStack";
import { VerticalStack } from "../VerticalStack";

export type CheckableCardProps = {
  children?: ReactNode;
};

export const CheckableCard = forwardRef<HTMLInputElement, CheckableCardProps>(
  (props) => {
    const { children } = props;
    return (
      <Card>
        <VerticalStack gap="2">
          <HorizontalStack gap="1.5" blockAlign="center">
            <Checkbox size="lg">
              <VerticalStack gap="1">
                <Text weight="semibold" as="h3">
                  Header
                </Text>
                <Text weight="medium" color="gray.resting">
                  {children}
                </Text>
              </VerticalStack>
            </Checkbox>
          </HorizontalStack>
        </VerticalStack>
      </Card>
    );
  },
);

CheckableCard.displayName = "CheckableCard";
