import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { LockedStateCard, LockedStateCardProps } from "./LockedStateCard";
import { Button } from "../Button";
import { Icon } from "../Icon";
import Visibility from "@easypost/easy-ui-icons/Visibility";

type Story = StoryObj<typeof LockedStateCard>;

const Template = (args: LockedStateCardProps) => {
  const { children, ...restArgs } = args;
  return <LockedStateCard {...restArgs}>{children}</LockedStateCard>;
};

const meta: Meta<typeof LockedStateCard> = {
  title: "Components/Cards/LockedStateCard",
  component: LockedStateCard,
};

export default meta;

export const Simple: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <LockedStateCard.Section>
        <LockedStateCard.TextGroup>
          <LockedStateCard.HeaderText>
            Looking to create something more advanced?
          </LockedStateCard.HeaderText>
          <LockedStateCard.BodyText>
            EasyPost’s API Suite delivers the best developer experience by
            offering a comprehensive suite of tools and features to ensure we
            meet the shipping needs of every single shipper. 
          </LockedStateCard.BodyText>
        </LockedStateCard.TextGroup>
        <LockedStateCard.ActionGroup>
          <Button color="secondary">Upgrade Plans</Button>
        </LockedStateCard.ActionGroup>
      </LockedStateCard.Section>
    ),
  },
};

export const Alignment: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <LockedStateCard.Section inlineAlign="center">
        <LockedStateCard.TextGroup gap="2">
          <Icon color="secondary.500" size="3xl" symbol={Visibility} />
          <LockedStateCard.HeaderText>
            Looking to create something more advanced?
          </LockedStateCard.HeaderText>
          <LockedStateCard.BodyText>
            EasyPost’s API Suite delivers the best developer experience by
            offering a comprehensive suite of tools and features to ensure we
            meet the shipping needs of every single shipper. 
          </LockedStateCard.BodyText>
        </LockedStateCard.TextGroup>
        <LockedStateCard.ActionGroup gap="2">
          <Button color="secondary">Upgrade Plan</Button>
        </LockedStateCard.ActionGroup>
      </LockedStateCard.Section>
    ),
  },
};
