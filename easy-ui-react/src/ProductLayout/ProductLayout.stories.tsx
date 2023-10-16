import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ProductLayout, ProductLayoutProps } from "./ProductLayout";

type Story = StoryObj<typeof ProductLayout>;

function Template(args: ProductLayoutProps) {
  return <ProductLayout {...args} />;
}

const meta: Meta<typeof ProductLayout> = {
  title: "Components/ProductLayout",
  component: ProductLayout,
  args: {
    children: <div>Content</div>,
  },
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
};
