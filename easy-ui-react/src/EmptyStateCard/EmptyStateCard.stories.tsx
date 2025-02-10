import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { EmptyStateCard, EmptyStateCardProps } from "./EmptyStateCard";
import { Button } from "../Button";
import { PlaceholderBox } from "../utilities/storybook";

type Story = StoryObj<typeof EmptyStateCard>;

const Template = (args: EmptyStateCardProps) => {
  const { children, ...restArgs } = args;
  return <EmptyStateCard {...restArgs}>{children}</EmptyStateCard>;
};

const meta: Meta<typeof EmptyStateCard> = {
  title: "Components/Cards/EmptyStateCard",
  component: EmptyStateCard,
};

export default meta;

export const Simple: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <EmptyStateCard.Section>
        <EmptyStateCard.TextGroup>
          <EmptyStateCard.HeaderText>
            Shipment Insurance
          </EmptyStateCard.HeaderText>
          <EmptyStateCard.BodyText>
            Rest easy knowing if one of your customers orders is damaged, lost
            in transit or stolen you are covered! Automatically add insurance to
            all your shipments
          </EmptyStateCard.BodyText>
        </EmptyStateCard.TextGroup>
        <EmptyStateCard.ActionGroup>
          <Button>Manage Insurance Settings</Button>
        </EmptyStateCard.ActionGroup>
      </EmptyStateCard.Section>
    ),
  },
};

export const Alignment: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <EmptyStateCard.Section inlineAlign="center">
        <EmptyStateCard.TextGroup gap="2">
          <EmptyStateCard.HeaderText>Analytics</EmptyStateCard.HeaderText>
          <EmptyStateCard.BodyText>
            Start shipping to get insights on your shipping costs and
            performance.
          </EmptyStateCard.BodyText>
        </EmptyStateCard.TextGroup>
        <EmptyStateCard.ActionGroup gap="2">
          <Button>Buy a label</Button>
          <Button color="success">Fund your wallet</Button>
        </EmptyStateCard.ActionGroup>
      </EmptyStateCard.Section>
    ),
  },
};

export const Decorative: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <EmptyStateCard.MultiSection gap="1">
        <EmptyStateCard.Section>
          <EmptyStateCard.TextGroup>
            <EmptyStateCard.HeaderText variant="heading3">
              Welcome to EasyPost Nexus
            </EmptyStateCard.HeaderText>
          </EmptyStateCard.TextGroup>
          <EmptyStateCard.ActionGroup>
            <Button>Buy a label</Button>
          </EmptyStateCard.ActionGroup>
        </EmptyStateCard.Section>
        <EmptyStateCard.Section hasDecorativeBackground>
          <EmptyStateCard.TextGroup gap="2">
            <EmptyStateCard.TextGroup gap="0">
              <EmptyStateCard.HeaderText>Spend $100</EmptyStateCard.HeaderText>
              <EmptyStateCard.HeaderText color="positive.500">
                Get $100
              </EmptyStateCard.HeaderText>
            </EmptyStateCard.TextGroup>
            <EmptyStateCard.BodyText variant="button">
              Fund your wallet with $100 and we will give you $100 more to buy
              labels
            </EmptyStateCard.BodyText>
          </EmptyStateCard.TextGroup>
        </EmptyStateCard.Section>
      </EmptyStateCard.MultiSection>
    ),
  },
};

export const Custom: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <EmptyStateCard.MultiSection>
        <EmptyStateCard.Section gap="1.5">
          <EmptyStateCard.TextGroup gap="2">
            <EmptyStateCard.TextGroup gap="0.5">
              <EmptyStateCard.HeaderText variant="heading3">
                Welcome to EasyPost Nexus
              </EmptyStateCard.HeaderText>
              <EmptyStateCard.HeaderText variant="heading4">
                Start fulfilling your orders fast!
              </EmptyStateCard.HeaderText>
            </EmptyStateCard.TextGroup>
            <EmptyStateCard.BodyText>
              Get ready for your first order:
            </EmptyStateCard.BodyText>
          </EmptyStateCard.TextGroup>
          <EmptyStateCard.ActionGroup>
            <Button>Buy a label</Button>
            <Button color="success">Fund your wallet</Button>
          </EmptyStateCard.ActionGroup>
        </EmptyStateCard.Section>
        <EmptyStateCard.Section>
          <PlaceholderBox width="100" height="100" />
        </EmptyStateCard.Section>
      </EmptyStateCard.MultiSection>
    ),
  },
};
