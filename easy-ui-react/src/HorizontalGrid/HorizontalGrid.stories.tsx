import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { HorizontalGrid, HorizontalGridProps } from "../HorizontalGrid";
import {
  PlaceholderBox,
  PlaceholderBoxProps,
  getDesignTokensControl,
} from "../utilities/storybook";

type Story = StoryObj<typeof HorizontalGrid>;

const Content = (props: PlaceholderBoxProps) => (
  <PlaceholderBox
    width="100%"
    height={150}
    style={{ flex: "0 0 auto" }}
    {...props}
  />
);

const Template = (args: HorizontalGridProps) => <HorizontalGrid {...args} />;

const meta: Meta<typeof HorizontalGrid> = {
  title: "Primitives/HorizontalGrid",
  component: HorizontalGrid,
  args: {
    columns: 4,
    gap: "2",
    children: (
      <>
        <Content />
        <Content />
        <Content />
        <Content />
      </>
    ),
  },
  argTypes: {
    gap: getDesignTokensControl("space.{alias}"),
  },
  parameters: {
    controls: {
      exclude: ["as", "children"],
    },
  },
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
};

export const Columns4: Story = {
  render: Template.bind({}),
  args: {
    columns: 4,
  },
};

export const ColumnsFractional: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <Content />
        <Content />
      </>
    ),
    columns: ["oneFourth", "threeFourths"],
  },
};

export const ColumnsCustom: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <Content />
        <Content width={100} />
        <Content width={100} />
      </>
    ),
    columns: ["1fr", "auto", "auto"],
  },
};

export const ColumnsResponsive: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <Content />
        <Content />
        <Content />
        <Content />
      </>
    ),
    columns: { xs: 1, md: 2, lg: 4 },
  },
};

export const Gap: Story = {
  render: Template.bind({}),
  args: {
    gap: "4",
  },
};

export const AlignItems: Story = {
  render: Template.bind({}),
  args: {
    alignItems: "center",
    children: (
      <>
        <Content />
        <Content height={100} />
        <Content />
      </>
    ),
    columns: 3,
  },
};

export const Inline: Story = {
  render: Template.bind({}),
  args: {
    inline: true,
  },
};
