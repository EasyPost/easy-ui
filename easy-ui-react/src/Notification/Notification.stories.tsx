import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { NotificationProps } from "./Notification";
import { SimulatedNotificationTrigger } from "./utilities";
import { InlineStoryDecorator } from "../utilities/storybook";

type Story = StoryObj<typeof SimulatedNotificationTrigger>;

const Template = (args: NotificationProps) => (
  <SimulatedNotificationTrigger {...args} />
);

const meta: Meta<typeof SimulatedNotificationTrigger> = {
  title: "Components/Notification",
  argTypes: {},
  component: SimulatedNotificationTrigger,
};

export default meta;

export const Controls: Story = {
  render: Template.bind({}),
  args: {},
};

export const SuccessNotification: Story = {
  render: () => (
    <>
      <SimulatedNotificationTrigger type="toast" status="success" />
      <SimulatedNotificationTrigger type="alert" status="success" />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const PromotionalNotification: Story = {
  render: () => (
    <>
      <SimulatedNotificationTrigger type="toast" status="promotional" />
      <SimulatedNotificationTrigger type="alert" status="promotional" />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const NeutralNotification: Story = {
  render: () => (
    <>
      <SimulatedNotificationTrigger type="toast" status="neutral" />
      <SimulatedNotificationTrigger type="alert" status="neutral" />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const WarningNotification: Story = {
  render: () => (
    <>
      <SimulatedNotificationTrigger type="toast" status="warning" />
      <SimulatedNotificationTrigger type="alert" status="warning" />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const ErrorNotification: Story = {
  render: () => (
    <>
      <SimulatedNotificationTrigger type="toast" status="error" />
      <SimulatedNotificationTrigger type="alert" status="error" />
    </>
  ),
  decorators: [InlineStoryDecorator],
};
