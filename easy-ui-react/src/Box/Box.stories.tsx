import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import {
  UPSLogoImg,
  createBorderRadiusTokensControl,
  createColorTokensControl,
  createShadowTokensControl,
  getDesignTokensControl,
} from "../utilities/storybook";
import { Box, BoxProps } from "./Box";

type Story = StoryObj<typeof Box>;

const Template = (args: BoxProps) => <Box {...args} />;

const meta: Meta<typeof Box> = {
  title: "Primitives/Box",
  component: Box,
  args: {
    background: "primary.100",
    padding: "4",
    borderRadius: "lg",
    children: <Text variant="body1">Content</Text>,
  },
  argTypes: {
    background: createColorTokensControl(),
    color: createColorTokensControl(),
    borderColor: createColorTokensControl(),
    borderRadius: createBorderRadiusTokensControl(),
    boxShadow: createShadowTokensControl(),
    padding: getDesignTokensControl("space.{alias}"),
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

export const Padding: Story = {
  render: Template.bind({}),
  args: {
    padding: "6",
  },
};

export const Border: Story = {
  render: Template.bind({}),
  args: {
    background: "neutral.000",
    borderColor: "neutral.200",
    borderRadius: "md",
  },
};

export const Shadow: Story = {
  render: Template.bind({}),
  args: {
    background: "neutral.000",
    boxShadow: "2",
  },
};

export const Sizing: Story = {
  render: (args) => (
    <Box background="neutral.100" padding="2">
      <Box {...args} />
    </Box>
  ),
  args: {
    width: "100%",
    maxWidth: 700,
    marginX: "auto",
    textAlign: "center",
    children: <Text variant="body1">Constrained, centered container</Text>,
  },
};

export const Flex: Story = {
  render: () => (
    <HorizontalStack gap="2">
      <Box background="primary.100" padding="4" borderRadius="md" flex="1">
        <Text variant="body1">flex=&quot;1&quot;</Text>
      </Box>
      <Box background="neutral.100" padding="4" borderRadius="md">
        <Text variant="body1">Natural width</Text>
      </Box>
    </HorizontalStack>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const FlexContainer: Story = {
  render: Template.bind({}),
  args: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2",
    background: "neutral.100",
    children: (
      <>
        <Text variant="body1">One</Text>
        <Text variant="body1">Two</Text>
      </>
    ),
  },
};

export const Position: Story = {
  render: () => (
    <Box position="relative" height={160} background="neutral.100">
      <Box
        position="absolute"
        inset="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text variant="body1">Centered overlay</Text>
      </Box>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Media: Story = {
  render: () => (
    <HorizontalStack gap="2">
      <Box
        as={UPSLogoImg}
        alt="UPS"
        width={80}
        height={40}
        objectFit="contain"
        borderColor="neutral.200"
        borderRadius="md"
      />
    </HorizontalStack>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Button: Story = {
  render: () => (
    <Box
      as="button"
      onClick={() => {}}
      display="flex"
      alignItems="center"
      gap="1"
      padding="3"
      background="neutral.000"
      borderColor="neutral.200"
      borderRadius="md"
      cursor="pointer"
      textAlign="start"
    >
      <Text variant="body1">Unstyled by default</Text>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Responsive: Story = {
  render: () => (
    <VerticalStack gap="2">
      <Box
        background="primary.100"
        padding={{ xs: "2", md: "6" }}
        borderRadius="lg"
        maxWidth={{ xs: "100%", lg: 480 }}
      >
        <Text variant="body1">Resize the window</Text>
      </Box>
    </VerticalStack>
  ),
  parameters: {
    controls: { disable: true },
  },
};
