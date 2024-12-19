import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FakeTopLevelForgeModeSwitcher } from "./ModeSwitcher";

type Story = StoryObj<typeof FakeTopLevelForgeModeSwitcher>;

const meta: Meta<typeof FakeTopLevelForgeModeSwitcher> = {
  title: "Components/ModeSwitcher",
  component: FakeTopLevelForgeModeSwitcher,
};

export default meta;

export const Test: Story = {
  render: () => <FakeTopLevelForgeModeSwitcher />,
};
