import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import { InlineStoryDecorator, FedExLogoImg } from "../utilities/storybook";
import { PillGroup, PillGroupProps, usePillListState } from "./PillGroup";

type Story = StoryObj<typeof PillGroup>;

const Template = (args: PillGroupProps<object>) => {
  const { children, ...restArgs } = args;
  return <PillGroup {...restArgs}>{children}</PillGroup>;
};

const meta: Meta<typeof PillGroup> = {
  title: "Components/PillGroup",
  component: PillGroup,
  args: {
    horizontalStackContainerProps: { gap: "2" },
  },
  decorators: [InlineStoryDecorator],
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <PillGroup.Pill label="First Last #123" />
        <PillGroup.Pill label="First Last #456" />
        <PillGroup.Pill label="First Last #789" />
      </>
    ),
  },
};

export const StandardIconSymbol: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <PillGroup.Pill label="First Last #123" icon={LocalShippingIcon} />
        <PillGroup.Pill label="First Last #456" icon={LocalShippingIcon} />
        <PillGroup.Pill label="First Last #789" icon={LocalShippingIcon} />
      </>
    ),
  },
};

export const ImageSymbol: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <PillGroup.Pill label="First Last #123" icon={FedExLogoImg} />
        <PillGroup.Pill label="First Last #456" icon={FedExLogoImg} />
        <PillGroup.Pill label="First Last #789" icon={FedExLogoImg} />
      </>
    ),
  },
};

export const Positioning: Story = {
  args: {
    children: (
      <>
        <PillGroup.Pill label="First Last #123" icon={FedExLogoImg} />
        <PillGroup.Pill label="First Last #456" icon={LocalShippingIcon} />
        <PillGroup.Pill label="First Last #789" icon={FedExLogoImg} />
        <PillGroup.Pill label="First Last #123" icon={LocalShippingIcon} />
        <PillGroup.Pill label="First Last #456" icon={FedExLogoImg} />
        <PillGroup.Pill label="First Last #789" icon={LocalShippingIcon} />
      </>
    ),
    horizontalStackContainerProps: {
      gap: { xs: "2", sm: "4", md: "6" },
    },
  },
};

export const Removal: Story = {
  render: () => {
    const list = usePillListState([
      { id: 1, name: "Food" },
      { id: 2, name: "Travel" },
      { id: 3, name: "Gaming" },
      { id: 4, name: "Shopping" },
    ]);

    return (
      <PillGroup
        items={list.items}
        horizontalStackContainerProps={{
          gap: "2",
        }}
        onRemove={(keys) => list.remove(...keys)}
        label="News Categories"
      >
        {(item) => <PillGroup.Pill label={item.name} icon={FedExLogoImg} />}
      </PillGroup>
    );
  },
};

export const Background: Story = {
  render: () => {
    const list = usePillListState([
      { id: 1, name: "Food" },
      { id: 2, name: "Travel" },
      { id: 3, name: "Gaming" },
      { id: 4, name: "Shopping" },
    ]);

    return (
      <PillGroup
        items={list.items}
        horizontalStackContainerProps={{
          gap: "2",
        }}
        onRemove={(keys) => list.remove(...keys)}
        label="News Categories"
        background="neutral.050"
      >
        {(item) => <PillGroup.Pill label={item.name} icon={FedExLogoImg} />}
      </PillGroup>
    );
  },
};

export const Border: Story = {
  render: () => {
    const list = usePillListState([
      { id: 1, name: "Food" },
      { id: 2, name: "Travel" },
      { id: 3, name: "Gaming" },
      { id: 4, name: "Shopping" },
    ]);

    return (
      <PillGroup
        items={list.items}
        horizontalStackContainerProps={{
          gap: "2",
        }}
        onRemove={(keys) => list.remove(...keys)}
        label="News Categories"
        background="neutral.050"
        isBorderless
      >
        {(item) => <PillGroup.Pill label={item.name} icon={FedExLogoImg} />}
      </PillGroup>
    );
  },
};
