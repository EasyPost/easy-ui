import AddIcon from "@easypost/easy-ui-icons/Add";
import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import InfoIcon from "@easypost/easy-ui-icons/Info";
import { action } from "storybook/actions";
import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
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
import { ThemeProvider } from "../Theme";
import { VerticalStack } from "../VerticalStack";

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

export const OverrideWithTheme: Story = {
  render: () => (
    <>
      <VerticalStack gap="2">
        <div>
          <ThemeProvider
            theme={() => ({
              "component.button.primary.filled.font.color":
                "var(--ezui-color-neutral-900)",
              "component.button.primary.filled.active.font.color":
                "var(--ezui-color-neutral-900)",
              "component.button.primary.resting.color":
                "var(--ezui-color-yellow-500)",
              "component.button.primary.hover.focus.color":
                "var(--ezui-color-yellow-600)",
              "component.button.primary.active.color":
                "var(--ezui-color-yellow-700)",
            })}
          >
            <Button color="primary">Overridden</Button>
          </ThemeProvider>
        </div>
        <div>
          <Button color="primary">Standard</Button>
        </div>
      </VerticalStack>
    </>
  ),
};

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

export const Controls: Story = {
  render: Template.bind({}),
  args: {},
};
