import MoreVertIcon from "@easypost/easy-ui-icons/MoreVert";
import { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { HorizontalStack } from "../HorizontalStack";
import { IconButton } from "../IconButton";
import { Spinner } from "../Spinner";
import { Text } from "../Text";
import { TextField } from "../TextField";
import { VerticalStack } from "../VerticalStack";
import {
  FedExLogoImg,
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

export const ElementReset: Story = {
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

// ---------------------------------------------------------------------------
// Recipes
//
// The stories above demonstrate one property at a time. These are whole
// compositions, each standing in for a pattern that repeats across application
// code today as a one-off CSS module.
// ---------------------------------------------------------------------------

/** A bordered surface, the most common shape a CSS module is written for. */
export const CardSurface: Story = {
  render: () => (
    <Box
      maxWidth={420}
      padding="4"
      background="neutral.000"
      borderColor="neutral.200"
      borderRadius="lg"
      boxShadow="1"
    >
      <VerticalStack gap="1">
        <Text variant="subtitle1">1Z999AA10123456784</Text>
        <Text variant="body2" color="subdued">
          UPS Ground &middot; Delivered March 14
        </Text>
      </VerticalStack>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A whole card that is also a button. `as="button"` applies the unstyled reset,
 * which replaces the `all: unset` blocks copied between applications—and keeps
 * the focus ring that `all: unset` throws away.
 */
export const SelectableCard: Story = {
  render: () => {
    const options = [
      { id: "ground", title: "Ground", detail: "3–5 business days" },
      { id: "express", title: "Express", detail: "Next business day" },
    ];
    const RecipeStory = () => {
      const [selected, setSelected] = useState("ground");
      return (
        <HorizontalStack gap="2">
          {options.map((option) => (
            <Box
              key={option.id}
              as="button"
              type="button"
              onClick={() => setSelected(option.id)}
              aria-pressed={selected === option.id}
              flex="1"
              padding="3"
              cursor="pointer"
              textAlign="start"
              background={
                selected === option.id ? "primary.050" : "neutral.000"
              }
              borderRadius="md"
              borderWidth="1"
              borderColor={
                selected === option.id ? "primary.500" : "neutral.200"
              }
            >
              <VerticalStack gap="0.5">
                <Text variant="subtitle2">{option.title}</Text>
                <Text variant="body2" color="subdued">
                  {option.detail}
                </Text>
              </VerticalStack>
            </Box>
          ))}
        </HorizontalStack>
      );
    };
    return <RecipeStory />;
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A single border width is all a divider is. Suppressing the width on the last
 * row is how a ruled list avoids a trailing rule.
 */
export const Dividers: Story = {
  render: () => {
    const steps = ["Label created", "In transit", "Out for delivery"];
    return (
      <VerticalStack gap="4">
        <VerticalStack gap="2">
          <Text variant="body1">Above the rule</Text>
          <Box borderTopWidth="1" borderColor="neutral.200" />
          <Text variant="body1">Below the rule</Text>
        </VerticalStack>
        <Box maxWidth={320}>
          {steps.map((step, index) => {
            // The color has to come off with the width. A `borderColor` on its
            // own implies a border on every side, so leaving it in place on the
            // last row would draw a box around it instead of no rule at all.
            const isRuled = index !== steps.length - 1;
            return (
              <Box
                key={step}
                paddingY="2"
                borderBottomWidth={isRuled ? "1" : undefined}
                borderColor={isRuled ? "neutral.200" : undefined}
              >
                <Text variant="body2">{step}</Text>
              </Box>
            );
          })}
        </Box>
      </VerticalStack>
    );
  },
  parameters: {
    controls: { disable: true },
  },
};

/** A title on one side, an action on the other, and a rule underneath. */
export const SectionHeader: Story = {
  render: () => (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      paddingBottom="2"
      borderBottomWidth="1"
      borderColor="neutral.200"
    >
      <Text variant="subtitle1">Shipments</Text>
      <Button size="sm">Create</Button>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A field that takes the remaining width next to a fixed-width action. A stack
 * child cannot express this on its own, which is why `flex` exists on `<Box />`.
 */
export const SearchRow: Story = {
  render: () => (
    <HorizontalStack gap="2" blockAlign="end">
      <Box flex="1">
        <TextField label="Search shipments" placeholder="Tracking number" />
      </Box>
      <Button>Search</Button>
    </HorizontalStack>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/** A page's content column: full width, capped, and centered. */
export const PageContainer: Story = {
  render: () => (
    <Box background="neutral.050" paddingY="4">
      <Box width="100%" maxWidth={720} marginX="auto" paddingX="4">
        <Box
          padding="4"
          background="neutral.000"
          borderColor="neutral.200"
          borderRadius="lg"
        >
          <Text variant="body1">Centered content, capped at 720px</Text>
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A toolbar that stays put while the panel scrolls. `zIndex` is constrained to
 * the token scale, which is what keeps `z-index: 9999` out of application code.
 */
export const StickyToolbar: Story = {
  render: () => (
    // A scrollable region needs `tabIndex` to be reachable by keyboard, and a
    // role for its label to be announced.
    <Box
      height={220}
      maxWidth={420}
      overflowY="auto"
      borderColor="neutral.200"
      borderRadius="md"
      tabIndex={0}
      role="group"
      aria-label="Shipment rows"
    >
      <Box
        position="sticky"
        top="0"
        zIndex="nav"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingX="3"
        paddingY="2"
        background="neutral.000"
        borderBottomWidth="1"
        borderColor="neutral.200"
      >
        <Text variant="subtitle2">Sticky toolbar</Text>
        <Text variant="caption" color="subdued">
          Scroll the panel
        </Text>
      </Box>
      <Box padding="3">
        <VerticalStack gap="2">
          {Array.from({ length: 12 }, (_, index) => (
            <Text key={index} variant="body2">
              Row {index + 1}
            </Text>
          ))}
        </VerticalStack>
      </Box>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A scrim and its content are separate boxes on purpose: nesting the spinner
 * inside the translucent box would fade the spinner too.
 */
export const LoadingOverlay: Story = {
  render: () => (
    <Box
      position="relative"
      maxWidth={420}
      minHeight={200}
      padding="4"
      background="neutral.000"
      borderColor="neutral.200"
      borderRadius="lg"
    >
      <VerticalStack gap="1">
        <Text variant="subtitle1">Rate quote</Text>
        <Text variant="body2" color="subdued">
          417 Montgomery St to 1600 Pennsylvania Ave
        </Text>
      </VerticalStack>
      <Box
        position="absolute"
        inset="0"
        background="neutral.000"
        borderRadius="lg"
        opacity="underlay"
      />
      <Box
        position="absolute"
        inset="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner isIndeterminate>Comparing carriers</Spinner>
      </Box>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/** A dot pinned to a control's corner. `pointerEvents` keeps it unclickable. */
export const NotificationDot: Story = {
  render: () => (
    <Box position="relative" display="inline-block">
      <IconButton icon={MoreVertIcon} accessibilityLabel="More actions" />
      <Box
        position="absolute"
        top="0"
        right="0"
        width={8}
        height={8}
        borderRadius="full"
        background="negative.500"
        pointerEvents="none"
      />
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/** A capped list that scrolls instead of growing without bound. */
export const ScrollContainer: Story = {
  render: () => (
    <Box
      maxWidth={360}
      maxHeight={180}
      overflowY="auto"
      padding="2"
      borderColor="neutral.200"
      borderRadius="md"
      tabIndex={0}
      role="group"
      aria-label="Carrier options"
    >
      <VerticalStack gap="1">
        {Array.from({ length: 14 }, (_, index) => (
          <Text key={index} variant="body2">
            Carrier option {index + 1}
          </Text>
        ))}
      </VerticalStack>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A negative margin cancels the parent's padding so a callout spans the full
 * card. `overflow="hidden"` is what keeps the bleed inside the rounded corners.
 */
export const FullBleedCallout: Story = {
  render: () => (
    <Box
      maxWidth={420}
      padding="4"
      overflow="hidden"
      background="neutral.000"
      borderColor="neutral.200"
      borderRadius="lg"
    >
      <VerticalStack gap="2">
        <Text variant="subtitle1">Ship to</Text>
        <Box
          marginX="-4"
          paddingX="4"
          paddingY="2"
          background="warning.050"
          borderTopWidth="1"
          borderBottomWidth="1"
          borderColor="warning.200"
        >
          <Text variant="body2">This address could not be verified.</Text>
        </Box>
        <Text variant="body2" color="subdued">
          417 Montgomery St, San Francisco, CA
        </Text>
      </VerticalStack>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Fixed dimensions plus `objectFit`, the pattern behind more repeated CSS
 * modules than any other in the audit.
 */
export const CarrierLogos: Story = {
  render: () => (
    <HorizontalStack gap="2">
      {[
        { Logo: UPSLogoImg, name: "UPS" },
        { Logo: FedExLogoImg, name: "FedEx" },
      ].map(({ Logo, name }) => (
        <Box
          key={name}
          padding="2"
          background="neutral.000"
          borderColor="neutral.200"
          borderRadius="md"
        >
          <Box
            as={Logo}
            alt={name}
            width={80}
            height={40}
            objectFit="contain"
          />
        </Box>
      ))}
    </HorizontalStack>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/** Wrapping content with different spacing along each axis. */
export const TagList: Story = {
  render: () => (
    <Box display="flex" flexWrap="wrap" columnGap="2" rowGap="1" maxWidth={320}>
      {["Ground", "Express", "International", "Signature", "Insured"].map(
        (tag) => (
          <Badge key={tag}>{tag}</Badge>
        ),
      )}
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * `fieldset` and `legend` carry browser styling that has to be stripped before
 * they are usable. `as` does it, so grouping fields stays accessible and plain.
 */
export const FieldGroup: Story = {
  render: () => (
    <Box
      as="fieldset"
      maxWidth={320}
      display="flex"
      flexDirection="column"
      gap="2"
    >
      <Box as="legend" paddingBottom="1">
        <Text variant="subtitle2">Delivery options</Text>
      </Box>
      <Checkbox>Signature required</Checkbox>
      <Checkbox>Saturday delivery</Checkbox>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};
