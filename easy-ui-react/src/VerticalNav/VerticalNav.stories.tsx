import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { VerticalNav } from "./VerticalNav";

type Story = StoryObj<typeof VerticalNav>;

const meta: Meta<typeof VerticalNav> = {
  title: "Components/VerticalNav",
  component: VerticalNav,
  decorators: [
    (Story) => (
      <div
        style={{
          width: 215,
          height: "calc(100svh - 2rem)",
          background: "#f1f1f1",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Default: Story = {
  render: () => (
    <VerticalNav>
      <div>test</div>
    </VerticalNav>
  ),
};
