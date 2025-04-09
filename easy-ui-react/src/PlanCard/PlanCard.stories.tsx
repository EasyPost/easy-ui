import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Badge } from "../Badge";
import { VerticalStack } from "../VerticalStack";
import { PlanCard } from "./PlanCard";
import { PlanCardIllustrationBuilding01 } from "./illustrations/Building01";
import { PlanCardIllustrationBuilding02 } from "./illustrations/Building02";
import { PlanCardIllustrationBuilding03 } from "./illustrations/Building03";
import { PlanCardIllustrationBuilding04 } from "./illustrations/Building04";

type Story = StoryObj<typeof PlanCard>;

const meta: Meta<typeof PlanCard> = {
  title: "Components/Cards/PlanCard",
  component: PlanCard,
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 295,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Starter: Story = {
  render: () => (
    <PlanCard.Button onPress={action("Click PlanCard")}>
      {({ isHovered }) => (
        <PlanCard
          background={isHovered ? "neutral.050" : "neutral.000"}
          borderColor={isHovered ? "neutral.900" : "neutral.200"}
        >
          <VerticalStack gap="2">
            <PlanCard.Callout>
              <Badge block variant="black">
                Active Plan
              </Badge>
            </PlanCard.Callout>
            <PlanCard.Header>
              <PlanCard.Title>Starter</PlanCard.Title>
              <PlanCard.Price color="neutral.500">$0.00</PlanCard.Price>
              <PlanCard.Caption>Free Forever</PlanCard.Caption>
            </PlanCard.Header>
          </VerticalStack>
          <PlanCard.Features>
            <PlanCard.Feature>Feature 1</PlanCard.Feature>
            <PlanCard.Feature>Feature 2</PlanCard.Feature>
            <PlanCard.Feature>Feature 3</PlanCard.Feature>
            <PlanCard.Feature>Feature 4</PlanCard.Feature>
            <PlanCard.Feature>Feature 5</PlanCard.Feature>
          </PlanCard.Features>
          <PlanCard.Illustration>
            <PlanCardIllustrationBuilding01 />
          </PlanCard.Illustration>
        </PlanCard>
      )}
    </PlanCard.Button>
  ),
};

export const Essential: Story = {
  render: () => (
    <PlanCard.Button onPress={action("Click PlanCard")}>
      {({ isHovered }) => (
        <PlanCard
          background={isHovered ? "positive.050" : "neutral.000"}
          borderColor={isHovered ? "positive.600" : "positive.200"}
        >
          <VerticalStack gap="2">
            <PlanCard.Callout>
              <Badge block variant="success">
                Active Plan
              </Badge>
            </PlanCard.Callout>
            <PlanCard.Header>
              <PlanCard.Title color="positive.600">Essential</PlanCard.Title>
              <PlanCard.Price>$10.00</PlanCard.Price>
              <PlanCard.Caption>Monthly</PlanCard.Caption>
            </PlanCard.Header>
          </VerticalStack>
          <PlanCard.Features>
            <PlanCard.Feature>Feature 1</PlanCard.Feature>
            <PlanCard.Feature>Feature 2</PlanCard.Feature>
            <PlanCard.Feature>Feature 3</PlanCard.Feature>
            <PlanCard.Feature>Feature 4</PlanCard.Feature>
            <PlanCard.Feature>Feature 5</PlanCard.Feature>
          </PlanCard.Features>
          <PlanCard.Illustration>
            <PlanCardIllustrationBuilding02 />
          </PlanCard.Illustration>
        </PlanCard>
      )}
    </PlanCard.Button>
  ),
};

export const Growth: Story = {
  render: () => (
    <PlanCard.Button onPress={action("Click PlanCard")}>
      {({ isHovered }) => (
        <PlanCard
          background={isHovered ? "secondary.050" : "neutral.000"}
          borderColor={isHovered ? "secondary.600" : "secondary.200"}
        >
          <VerticalStack gap="2">
            <PlanCard.Callout>
              <Badge block variant="secondary">
                Active Plan
              </Badge>
            </PlanCard.Callout>
            <PlanCard.Header>
              <PlanCard.Title color="secondary.600">Growth</PlanCard.Title>
              <PlanCard.Price color="secondary.600">$100.00</PlanCard.Price>
              <PlanCard.Caption>Monthly</PlanCard.Caption>
            </PlanCard.Header>
          </VerticalStack>
          <PlanCard.Features>
            <PlanCard.Feature>Feature 1</PlanCard.Feature>
            <PlanCard.Feature>Feature 2</PlanCard.Feature>
            <PlanCard.Feature>Feature 3</PlanCard.Feature>
            <PlanCard.Feature>Feature 4</PlanCard.Feature>
            <PlanCard.Feature>Feature 5</PlanCard.Feature>
          </PlanCard.Features>
          <PlanCard.Illustration>
            <PlanCardIllustrationBuilding03 />
          </PlanCard.Illustration>
        </PlanCard>
      )}
    </PlanCard.Button>
  ),
};

export const Premium: Story = {
  render: () => (
    <PlanCard.Button onPress={action("Click PlanCard")}>
      {({ isHovered }) => (
        <PlanCard
          background={isHovered ? "primary.050" : "neutral.000"}
          borderColor={isHovered ? "primary.500" : "primary.200"}
        >
          <VerticalStack gap="2">
            <PlanCard.Callout>
              <Badge block variant="primary">
                Active Plan
              </Badge>
            </PlanCard.Callout>
            <PlanCard.Header>
              <PlanCard.Title color="primary.500">Premium</PlanCard.Title>
              <PlanCard.Price color="primary.500">$100.00</PlanCard.Price>
              <PlanCard.Caption>Monthly</PlanCard.Caption>
            </PlanCard.Header>
          </VerticalStack>
          <PlanCard.Features>
            <PlanCard.Feature>Feature 1</PlanCard.Feature>
            <PlanCard.Feature>Feature 2</PlanCard.Feature>
            <PlanCard.Feature>Feature 3</PlanCard.Feature>
            <PlanCard.Feature>Feature 4</PlanCard.Feature>
            <PlanCard.Feature>Feature 5</PlanCard.Feature>
          </PlanCard.Features>
          <PlanCard.Illustration>
            <PlanCardIllustrationBuilding04 />
          </PlanCard.Illustration>
        </PlanCard>
      )}
    </PlanCard.Button>
  ),
};

export const Enterprise: Story = {
  render: () => (
    <PlanCard.Link href="/">
      {({ isHovered }) => (
        <PlanCard
          background={isHovered ? "primary.050" : "neutral.000"}
          borderColor={isHovered ? "primary.500" : "primary.200"}
        >
          <VerticalStack gap="2">
            <PlanCard.Callout />
            <PlanCard.Header>
              <PlanCard.Title color="primary.500">Enterprise</PlanCard.Title>
              <PlanCard.Price>Custom</PlanCard.Price>
              <PlanCard.Caption>Monthly or Yearly</PlanCard.Caption>
            </PlanCard.Header>
          </VerticalStack>
          <PlanCard.Features>
            <PlanCard.Feature>Feature 1</PlanCard.Feature>
            <PlanCard.Feature>Feature 2</PlanCard.Feature>
            <PlanCard.Feature>Feature 3</PlanCard.Feature>
            <PlanCard.Feature>Feature 4</PlanCard.Feature>
            <PlanCard.Feature>Feature 5</PlanCard.Feature>
          </PlanCard.Features>
          <PlanCard.Illustration>
            <PlanCardIllustrationBuilding04 />
          </PlanCard.Illustration>
        </PlanCard>
      )}
    </PlanCard.Link>
  ),
};

export const Static: Story = {
  render: () => (
    <PlanCard background="neutral.000" borderColor="neutral.200">
      <VerticalStack gap="2">
        <PlanCard.Callout />
        <PlanCard.Header>
          <PlanCard.Title color="positive.600">Growth</PlanCard.Title>
          <PlanCard.Price>$200.00</PlanCard.Price>
          <PlanCard.Caption>Monthly</PlanCard.Caption>
        </PlanCard.Header>
      </VerticalStack>
      <PlanCard.Features>
        <PlanCard.Feature>Feature 1</PlanCard.Feature>
        <PlanCard.Feature>Feature 2</PlanCard.Feature>
        <PlanCard.Feature>Feature 3</PlanCard.Feature>
        <PlanCard.Feature>Feature 4</PlanCard.Feature>
        <PlanCard.Feature>Feature 5</PlanCard.Feature>
      </PlanCard.Features>
      <PlanCard.Illustration>
        <PlanCardIllustrationBuilding03 />
      </PlanCard.Illustration>
    </PlanCard>
  ),
};
