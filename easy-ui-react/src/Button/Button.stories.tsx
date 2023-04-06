import AddIcon from "@easypost/easy-ui-icons/Add";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import InfoIcon from "@easypost/easy-ui-icons/Info";
import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  ButtonStoryDecorator,
  ButtonStoryOnDarkBackgroundDecorator,
  createLabelledOptionsControl,
} from "../utilities/storybook";
import { Button, ButtonProps } from "./Button";

type Story = StoryObj<typeof Button>;

const Template = (args: ButtonProps) => <Button {...args} />;

const meta: Meta<typeof Button> = {
  title: "Components/Button/Button",
  argTypes: {
    iconAtStart: createLabelledOptionsControl({
      ArrowBack: ArrowBackIcon,
      Add: AddIcon,
    }),
    iconAtEnd: createLabelledOptionsControl({
      ArrowBack: ArrowBackIcon,
      Add: AddIcon,
    }),
    children: {
      control: "text",
    },
  },
  component: Button,
};

export default meta;

export const Controls: Story = {
  render: Template.bind({}),
  args: {},
};

export const FilledButtons: Story = {
  render: () => (
    <>
      <Button />
      <Button color="secondary" />
      <Button color="success" />
      <Button color="warning" />
      <Button color="neutral" />
      <Button size="sm" />
      <Button color="secondary" size="sm" />
      <Button color="success" size="sm" />
      <Button color="warning" size="sm" />
      <Button color="neutral" size="sm" />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const OutlinedButtons: Story = {
  render: () => (
    <>
      <Button variant="outlined" />
      <Button color="secondary" variant="outlined" />
      <Button color="support" variant="outlined" />
      <Button variant="outlined" size="sm" />
      <Button color="secondary" variant="outlined" size="sm" />
      <Button color="support" variant="outlined" size="sm" />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const LinkButtons: Story = {
  render: () => (
    <>
      <Button variant="link" />
      <Button color="secondary" variant="link" />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const InverseButtons: Story = {
  render: () => (
    <>
      <Button color="inverse" variant="outlined" />
      <Button color="inverse" variant="outlined" size="sm" />
    </>
  ),
  decorators: [ButtonStoryOnDarkBackgroundDecorator],
};

export const WithHref: Story = {
  render: () => (
    <>
      <Button href="https://www.easypost.com/" />
      <Button variant="outlined" href="https://www.easypost.com/" />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const WithIcons: Story = {
  render: () => (
    <>
      <Button iconAtEnd={CheckCircleIcon} />
      <Button color="neutral" iconAtEnd={AddIcon} />
      <Button color="success" iconAtStart={ArrowBackIcon} />
      <Button color="warning" iconAtStart={InfoIcon} />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const BlockButton: Story = {
  render: () => <Button isBlock />,
  decorators: [ButtonStoryDecorator],
};

export const DisabledButtons: Story = {
  render: () => (
    <>
      <Button isDisabled />
      <Button variant="outlined" isDisabled />
    </>
  ),
  decorators: [ButtonStoryDecorator],
};

export const ClickEvent: Story = {
  render: () => <Button onPress={action("clicked!")} />,
  decorators: [ButtonStoryDecorator],
};
