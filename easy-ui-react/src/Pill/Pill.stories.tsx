import React, { useState, useCallback } from "react";
import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import Package2Icon from "@easypost/easy-ui-icons/Package2";
import {
  InlineStoryDecorator,
  createLabelledOptionsControl,
  FedExLogoImg,
} from "../utilities/storybook";
import { Pill, PillProps } from "./Pill";

type Story = StoryObj<typeof Pill>;

const Template = (args: PillProps) => <Pill {...args} />;

const meta: Meta<typeof Pill> = {
  title: "Components/Pill",
  component: Pill,
  decorators: [InlineStoryDecorator],
  argTypes: {
    label: {
      control: "text",
    },
    icon: createLabelledOptionsControl({
      LocalShippingIcon,
      Package2Icon,
      FedExLogoImg,
    }),
  },
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
  args: {
    label: "First Last #1234567890",
    onDismiss: undefined,
  },
};

export const StandardIconSymbol: Story = {
  render: Template.bind({}),
  args: {
    label: "First Last #1234567890",
    onDismiss: undefined,
    icon: LocalShippingIcon,
  },
};

export const ImageSymbol: Story = {
  render: Template.bind({}),
  args: {
    label: "First Last #1234567890",
    onDismiss: undefined,
    icon: FedExLogoImg,
  },
};

export const Dismissal: Story = {
  render: Template.bind({}),
  args: {
    label: "First Last #1234567890",
    onDismiss: action("clicked!"),
    icon: Package2Icon,
  },
};

export const Group: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [pills, setPills] = useState<{ id: number; text: string }[]>([
      { id: 0, text: "First Last 123" },
      { id: 1, text: "First Last 456" },
      { id: 2, text: "First Last 789" },
      { id: 3, text: "First Last 012" },
    ]);

    const handleDismissal = useCallback((id: number) => {
      setPills((prevPills) => prevPills.filter((pill) => pill.id !== id));
    }, []);

    return (
      <>
        {pills.map((pill) => (
          <Pill
            label={pill.text}
            key={pill.id}
            icon={FedExLogoImg}
            onDismiss={() => handleDismissal(pill.id)}
          />
        ))}
      </>
    );
  },
};
