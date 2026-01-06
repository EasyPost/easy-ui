import AddIcon from "@easypost/easy-ui-icons/Add";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import InfoIcon from "@easypost/easy-ui-icons/Info";
import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { action } from "storybook/actions";
import { ThemeProvider } from "../Theme";
import {
  InlineStoryDecorator,
  InlineStoryOnDarkBackgroundDecorator,
  createLabelledOptionsControl,
  getFilledButtonsColorMapping,
  getLinkButtonsColorMapping,
  getOutlinedButtonsColorMapping,
  getTextButtonsColorMapping,
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
      CheckCircle: CheckCircleIcon,
      Info: InfoIcon,
      None: undefined,
    }),
    iconAtEnd: createLabelledOptionsControl({
      ArrowBack: ArrowBackIcon,
      Add: AddIcon,
      CheckCircle: CheckCircleIcon,
      Info: InfoIcon,
      None: undefined,
    }),
    children: {
      control: "text",
    },
  },
  component: Button,
};

export default meta;

export const Filled: Story = {
  render: Template.bind({}),
  args: {
    color: "primary",
  },
};

Filled.argTypes = {
  color: getFilledButtonsColorMapping(),
};

export const Outlined: Story = {
  render: Template.bind({}),
  args: {
    variant: "outlined",
    color: "primary",
  },
};

Outlined.argTypes = {
  color: getOutlinedButtonsColorMapping(),
};

export const Link: Story = {
  render: Template.bind({}),
  args: {
    variant: "link",
    color: "primary",
  },
};

Link.argTypes = {
  color: getLinkButtonsColorMapping(),
};

export const Text: Story = {
  render: Template.bind({}),
  args: {
    variant: "text",
    color: "primary",
  },
};

Text.argTypes = {
  color: getTextButtonsColorMapping(),
};

export const Icons: Story = {
  render: Template.bind({}),
  args: {
    iconAtStart: AddIcon,
  },
  parameters: {
    controls: {
      include: ["iconAtStart", "iconAtEnd", "children"],
    },
  },
};

export const Href: Story = {
  render: () => (
    <>
      <Button href="https://www.easypost.com/" />
      <Button variant="outlined" href="https://www.easypost.com/" />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const Small: Story = {
  render: () => (
    <>
      <Button size="sm" />
      <Button variant="outlined" size="sm" />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const Inverse: Story = {
  render: () => (
    <>
      <Button color="inverse" variant="outlined" />
      <Button color="inverse" variant="outlined" size="sm" />
    </>
  ),
  decorators: [InlineStoryOnDarkBackgroundDecorator],
};

export const Block: Story = {
  render: () => <Button isBlock />,
  decorators: [InlineStoryDecorator],
};

export const Disabled: Story = {
  render: () => (
    <>
      <Button isDisabled />
      <Button variant="outlined" isDisabled />
    </>
  ),
  decorators: [InlineStoryDecorator],
};

export const ClickEvent: Story = {
  render: () => <Button onPress={action("clicked!")} />,
  decorators: [InlineStoryDecorator],
};

export const CustomBrandColors: Story = {
  render: (args: ButtonProps) => (
    <ThemeProvider
      theme={() => ({
        "color.primary.900": "var(--ezui-color-yellow-900)",
        "color.primary.800": "var(--ezui-color-yellow-800)",
        "color.primary.700": "var(--ezui-color-yellow-700)",
        "color.primary.600": "var(--ezui-color-yellow-600)",
        "color.primary.500": "var(--ezui-color-yellow-500)",
        "color.primary.400": "var(--ezui-color-yellow-400)",
        "color.primary.300": "var(--ezui-color-yellow-300)",
        "color.primary.200": "var(--ezui-color-yellow-200)",
        "color.primary.100": "var(--ezui-color-yellow-100)",
        "color.primary.050": "var(--ezui-color-yellow-050)",
        "color.primary.025": "var(--ezui-color-yellow-025)",
        "color.on-primary.900": "var(--ezui-color-gray-900)",
        "color.on-primary.800": "var(--ezui-color-gray-900)",
        "color.on-primary.700": "var(--ezui-color-gray-900)",
        "color.on-primary.600": "var(--ezui-color-gray-900)",
        "color.on-primary.500": "var(--ezui-color-gray-900)",
        "color.on-primary.400": "var(--ezui-color-gray-000)",
        "color.on-primary.300": "var(--ezui-color-gray-000)",
        "color.on-primary.200": "var(--ezui-color-gray-000)",
        "color.on-primary.100": "var(--ezui-color-gray-000)",
        "color.on-primary.050": "var(--ezui-color-gray-000)",
        "color.on-primary.025": "var(--ezui-color-gray-000)",
      })}
    >
      <Button {...args} />
    </ThemeProvider>
  ),
  args: {
    color: "primary",
  },
};

export const Controls: Story = {
  render: Template.bind({}),
  args: {},
};
