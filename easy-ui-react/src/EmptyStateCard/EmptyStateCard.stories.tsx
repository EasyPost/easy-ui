import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { EmptyStateCard, EmptyStateCardProps } from "./EmptyStateCard";
import { Button } from "../Button";
import { getDesignTokensControl } from "../utilities/storybook";

type Story = StoryObj<typeof EmptyStateCard>;

const Template = (args: EmptyStateCardProps) => {
  const { children, ...restArgs } = args;
  return <EmptyStateCard {...restArgs}>{children}</EmptyStateCard>;
};

const meta: Meta<typeof EmptyStateCard> = {
  title: "Components/Cards/EmptyStateCard",
  component: EmptyStateCard,
  argTypes: {
    secondaryGap: getDesignTokensControl("space.{alias}"),
    primaryGap: getDesignTokensControl("space.{alias}"),
  },
};

export default meta;

export const Gap: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <EmptyStateCard.Header>
          <EmptyStateCard.HeaderText>
            Shipment Insurance
          </EmptyStateCard.HeaderText>
        </EmptyStateCard.Header>
        <EmptyStateCard.Body>
          <EmptyStateCard.BodyText>
            Rest easy knowing if one of your customers orders is damaged, lost
            in transit or stolen you are covered! Automatically add insurance to
            all your shipments
          </EmptyStateCard.BodyText>
        </EmptyStateCard.Body>
        <EmptyStateCard.Action>
          <Button>Manage Insurance Settings</Button>
        </EmptyStateCard.Action>
      </>
    ),
    primaryGap: "1",
    secondaryGap: "2",
  },
  parameters: {
    controls: {
      include: ["primaryGap", "secondaryGap"],
    },
  },
};

export const Position: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <EmptyStateCard.Header>
          <EmptyStateCard.HeaderText>Analytics</EmptyStateCard.HeaderText>
        </EmptyStateCard.Header>
        <EmptyStateCard.Body>
          <EmptyStateCard.BodyText>
            Start shipping to get insights on your shipping costs and
            performance.
          </EmptyStateCard.BodyText>
        </EmptyStateCard.Body>
        <EmptyStateCard.Action>
          <Button>Buy a Label</Button>
        </EmptyStateCard.Action>
      </>
    ),
    contentAlignment: "center",
  },
  parameters: {
    controls: {
      include: ["contentAlignment"],
    },
  },
};
