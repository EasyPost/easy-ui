import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { OverlayLayoutDecorator } from "../utilities/storybook";
import { Menu } from "../Menu";
import { KebabButton } from "./KebabButton";

type Story = StoryObj<typeof KebabButton>;

const meta: Meta<typeof KebabButton> = {
  title: "Components/Button/KebabButton",
  component: KebabButton,
  argTypes: {
    accessibilityLabel: {
      control: "text",
      description: "Optional custom accessibility label describing the action.",
    },
  },
  args: { accessibilityLabel: "Actions" },
};

export default meta;

export const WithMenu: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger>
        <KebabButton onPress={action("Clicked")} />
      </Menu.Trigger>
      <Menu.Overlay onAction={action("Select")}>
        <Menu.Item key="copy">Copy</Menu.Item>
        <Menu.Item key="cut">Cut</Menu.Item>
        <Menu.Item key="paste">Paste</Menu.Item>
      </Menu.Overlay>
    </Menu>
  ),
  decorators: [OverlayLayoutDecorator],
};
