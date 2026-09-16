import AccountTreeIcon from "@easypost/easy-ui-icons/AccountTree";
import { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { Button } from "../Button";
import { Card } from "../Card";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
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

export const BorderRadius: Story = {
  render: () => (
    <HorizontalStack gap="2">
      {(
        [
          ["borderRadius", { borderRadius: "lg" }],
          ["borderRadiusTop", { borderRadiusTop: "lg" }],
          ["borderRadiusRight", { borderRadiusRight: "lg" }],
          ["borderRadiusTopLeft", { borderRadiusTopLeft: "lg" }],
        ] as const
      ).map(([label, radius]) => (
        <Box key={label} {...radius} padding="2" background="primary.100">
          <Text variant="caption">{label}</Text>
        </Box>
      ))}
    </HorizontalStack>
  ),
  parameters: {
    controls: { disable: true },
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
      {/*
       * The ladder below replaces a hand-written `@media` block that is
       * byte-identical in two unrelated features (the Luma insights panel and
       * the sub-account analytics panel). Note that the original steps at
       * 768px/992px/1300px are Bootstrap-era breakpoints, not Easy UI's — the
       * migration is to the nearest token breakpoint, not a literal port.
       */}
      <Box
        display="flex"
        flexDirection="column"
        background="primary.100"
        padding={{ xs: "2", md: "6" }}
        borderRadius="lg"
        minWidth={{ xs: 296, md: 440, lg: 680, xl: 1040 }}
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
// Layout shapes drawn from CSS Modules in the EasyPost web app. Attribution and
// counts live in Box.mdx and documentation/specs/Box.md.
//
// Absent on purpose: a plain card surface, a title-and-action section header, a
// selectable card, and a search row. `Card`, `SectionCard`, `CheckableCard`,
// and `HorizontalGrid` own those.
// ---------------------------------------------------------------------------

/** A centered, width-capped content column. */
export const PageContainer: Story = {
  render: () => (
    <Box background="neutral.050" paddingY="4">
      <Box width="100%" maxWidth={1320} marginX="auto" paddingX="3">
        <Box
          padding="4"
          background="neutral.000"
          borderColor="neutral.200"
          borderRadius="lg"
        >
          <Text variant="body1">Sub Account Settings Management</Text>
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/** A width cap on a single control rather than on a page. */
export const ControlWidthCap: Story = {
  render: () => (
    <VerticalStack gap="2">
      <Box width="100%" maxWidth={250}>
        <TextField label="Carrier" placeholder="Select a carrier" />
      </Box>
      <Box width="100%" maxWidth={175}>
        <TextField label="Weight adjustment" placeholder="0.0" />
      </Box>
    </VerticalStack>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A full-height centered shell around a single card. The real page uses
 * `minHeight="100dvh"`; this caps the height to fit the canvas.
 */
export const CenteredPage: Story = {
  render: () => (
    <Box
      minHeight={320}
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding="4"
      background="neutral.050"
    >
      <Box width="100%" maxWidth="28rem">
        <Box
          padding="6"
          background="neutral.000"
          borderRadius="lg"
          boxShadow="1"
        >
          <VerticalStack gap="3">
            <VerticalStack gap="1">
              <Text variant="subtitle1">Authorize EasyPost</Text>
              <Text variant="body2" color="subdued">
                This application is requesting access to your account.
              </Text>
            </VerticalStack>
            {/* The real module's `.actions { width: 100% }`. */}
            <Box width="100%">
              <Button isBlock>Authorize</Button>
            </Box>
          </VerticalStack>
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * One hairline rule. A conditional rule has to drop `borderColor` along with
 * the width, since a color on its own implies all four sides.
 */
export const Divider: Story = {
  render: () => (
    <Box maxWidth={320}>
      <VerticalStack gap="3">
        <VerticalStack gap="2">
          <HorizontalStack align="space-between">
            <Text variant="body2">Duties and taxes</Text>
            <Text variant="body2">$12.40</Text>
          </HorizontalStack>
          <Box borderTopWidth="1" borderColor="neutral.200" />
          <HorizontalStack align="space-between">
            <Text variant="subtitle2">Estimated total</Text>
            <Text variant="subtitle2">$48.10</Text>
          </HorizontalStack>
        </VerticalStack>
        {/* The vertical spelling, as the subscription slat writes it. */}
        <HorizontalStack gap="2" blockAlign="center">
          <Text variant="body2">Ground</Text>
          <Box width={1} alignSelf="stretch" background="neutral.700" />
          <Text variant="body2">2-day</Text>
        </HorizontalStack>
      </VerticalStack>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A padded header band with a rule under it. The title-and-action row inside is
 * a `HorizontalStack`; only the band needs a Box.
 */
export const PanelHeader: Story = {
  render: () => (
    <Box
      maxWidth={420}
      background="neutral.000"
      borderColor="neutral.200"
      borderRadius="lg"
      overflow="hidden"
    >
      <Box padding="3" borderBottomWidth="1" borderColor="neutral.200">
        <HorizontalStack align="space-between" blockAlign="center">
          <HorizontalStack gap="2" blockAlign="center">
            <Icon symbol={AccountTreeIcon} color="primary.800" />
            <Text variant="subtitle1">Sub Account Settings</Text>
          </HorizontalStack>
          <Button size="sm">Manage</Button>
        </HorizontalStack>
      </Box>
      <Box padding="3">
        <Text variant="body2" color="subdued">
          Two child accounts inherit these settings.
        </Text>
      </Box>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A fixed-height panel whose middle section scrolls. `flex="1"` needs
 * `minHeight={0}` to shrink, or the panel grows instead of scrolling.
 */
export const ScrollPanel: Story = {
  render: () => (
    <Box
      width="100%"
      maxWidth={420}
      height={280}
      display="flex"
      flexDirection="column"
      overflow="hidden"
      background="neutral.000"
      borderColor="neutral.200"
      borderRadius="lg"
    >
      <Box padding="2" borderBottomWidth="1" borderColor="neutral.200">
        <Text variant="subtitle2">Luma Advisor</Text>
      </Box>
      <Box
        flex="1"
        minHeight={0}
        overflowY="auto"
        padding="2"
        tabIndex={0}
        role="group"
        aria-label="Transcript"
      >
        <VerticalStack gap="2">
          {Array.from({ length: 10 }, (_, index) => (
            <Text key={index} variant="body2">
              Which carrier had the lowest cost per label in March? ({index + 1}
              )
            </Text>
          ))}
        </VerticalStack>
      </Box>
      <Box padding="2" borderTopWidth="1" borderColor="neutral.200">
        <Box display="flex" justifyContent="end">
          <Button size="sm">Send</Button>
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A spinner centered over the content it stands in for.
 *
 * Missing: the source crossfades the layers with `opacity: 0 | 1`, and the
 * opacity scale has one alias. This covers the content with an opaque
 * `background` instead.
 */
export const CenteredOverlay: Story = {
  render: () => (
    <Box
      position="relative"
      maxWidth={320}
      borderColor="neutral.200"
      borderRadius="lg"
      overflow="hidden"
    >
      <Box padding="4" pointerEvents="none">
        <VerticalStack gap="1">
          <Text variant="subtitle2">Nexus filings</Text>
          <Text variant="heading4">12 states</Text>
        </VerticalStack>
      </Box>
      <Box
        position="absolute"
        inset="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        background="neutral.000"
      >
        {/*
         * `color` is set because `Spinner`'s default `neutral.500` label only
         * reaches 3.65:1 on a white background.
         */}
        <Spinner size="sm" color="neutral.700" isIndeterminate>
          Refreshing
        </Spinner>
      </Box>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A banner pinned to the top of a scrolling dialog. `zIndex` is a token scale,
 * which is what keeps `z-index: 9999` out of application code.
 */
export const StickyBanner: Story = {
  render: () => (
    <Box
      height={220}
      maxWidth={420}
      overflowY="auto"
      background="neutral.000"
      borderColor="neutral.200"
      borderRadius="md"
      tabIndex={0}
      role="group"
      aria-label="Registration details"
    >
      <Box
        position="sticky"
        top="0"
        zIndex="drawer"
        paddingX="1.5"
        paddingY="1"
        background="positive.100"
        borderRadiusBottom="md"
      >
        <HorizontalStack gap="2" blockAlign="center" align="space-between">
          <Text variant="subtitle2">Your account is approved</Text>
          <Text variant="caption" color="subdued">
            Scroll for details
          </Text>
        </HorizontalStack>
      </Box>
      <Box padding="3">
        <VerticalStack gap="2">
          {Array.from({ length: 12 }, (_, index) => (
            <Text key={index} variant="body2">
              Detail row {index + 1}
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

/** A fixed-size box holding a contained image. */
export const CarrierLogo: Story = {
  render: () => (
    <VerticalStack gap="3">
      <HorizontalStack gap="2" blockAlign="center">
        <Box
          as={UPSLogoImg}
          alt="UPS"
          width="4rem"
          height="4rem"
          objectFit="contain"
        />
        <Text variant="heading5">UPS</Text>
      </HorizontalStack>
      {/* The wrapper-plus-child spelling, as the carrier tables write it. */}
      <HorizontalStack gap="2" blockAlign="center">
        <Box
          width="4rem"
          height="4rem"
          padding="1"
          background="neutral.000"
          borderColor="neutral.200"
          borderRadius="md"
        >
          <Box
            as={FedExLogoImg}
            alt="FedEx"
            width="100%"
            height="100%"
            objectFit="contain"
          />
        </Box>
        <Text variant="heading5">FedEx</Text>
      </HorizontalStack>
    </VerticalStack>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A whole card that is also a button. `as="button"` applies the reset without
 * discarding the focus ring.
 */
export const CardButton: Story = {
  render: () => {
    const options = [
      { id: "bank", title: "Add a Bank Account", detail: "2–3 business days" },
      { id: "card", title: "Add a Credit Card", detail: "Processed instantly" },
    ];
    const RecipeStory = () => {
      const [selected, setSelected] = useState("bank");
      return (
        <HorizontalStack gap="2">
          {options.map((option) => (
            <Box
              key={option.id}
              as="button"
              type="button"
              onClick={() => setSelected(option.id)}
              aria-pressed={selected === option.id}
              display="block"
              flex="1"
              width="100%"
              cursor="pointer"
              textAlign="start"
              borderRadius="lg"
            >
              <Card padding="4" isSelected={selected === option.id}>
                <VerticalStack gap="0.5">
                  <Text variant="subtitle2">{option.title}</Text>
                  <Text variant="body2" color="subdued">
                    {option.detail}
                  </Text>
                </VerticalStack>
              </Card>
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
 * A labelled field with an icon rail beside it.
 *
 * Missing: the rail is drawn with a `::before`, which no style prop can
 * express, so it stays in CSS.
 */
export const IconRailField: Story = {
  render: () => (
    <Box display="flex" alignItems="start" gap="1" maxWidth={360}>
      <Box display="inline-flex" background="neutral.000" paddingBottom="0.5">
        <Icon symbol={AccountTreeIcon} color="primary.700" />
      </Box>
      <Box flex="1">
        <VerticalStack gap="0.5">
          <Text variant="subtitle1">Carrier accounts</Text>
          <Text variant="caption">
            Which of your carrier accounts this sub account may use.
          </Text>
        </VerticalStack>
      </Box>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A panel that fills the height it is given, with a colored header band.
 * `overflow="hidden"` keeps the band inside the panel's rounded corners.
 */
export const FlexFillPanel: Story = {
  render: () => (
    <Box
      display="flex"
      flexDirection="column"
      height={240}
      padding="2"
      background="neutral.050"
    >
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        background="neutral.000"
        borderColor="neutral.300"
        borderRadius="lg"
        boxShadow="1"
        overflow="hidden"
        width="100%"
        maxWidth={1310}
        marginX="auto"
      >
        <Box paddingY="2" paddingX="3" background="primary.700">
          <Text variant="subtitle1" color="neutral.000">
            Rule details
          </Text>
        </Box>
        <Box flex="1" padding="3">
          <Text variant="body2" color="neutral.700">
            The panel body takes the remaining height.
          </Text>
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A region that fills its parent and centers a loading or empty state. Only the
 * centering is a Box; the state's own content belongs to `EmptyStateCard`.
 */
export const CenteredStateRegion: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" height={240} padding="2">
      <Box
        flex="1 1 auto"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="8rem"
        background="neutral.000"
        borderColor="neutral.200"
        borderRadius="lg"
      >
        <Spinner size="md" color="neutral.700" value={40}>
          Refreshing analytics
        </Spinner>
      </Box>
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * An image that reserves its space before it loads, so nothing below it shifts.
 * `aspectRatio` takes a free value, so it can come from a prop.
 */
export const AspectRatioMedia: Story = {
  render: () => (
    <Box width="100%" maxWidth={320} padding="3" background="neutral.050">
      <Box
        as={UPSLogoImg}
        alt="UPS"
        display="block"
        width="100%"
        height="auto"
        maxHeight={100}
        aspectRatio="241 / 241"
        objectFit="contain"
        marginX="auto"
      />
    </Box>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * A logo cropped to a circle or a rounded tile. `overflow="hidden"` is what
 * crops the image to the shape.
 */
export const LogoDisc: Story = {
  render: () => (
    <HorizontalStack gap="3" blockAlign="center">
      <Box
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        width={32}
        height={32}
        padding="0.5"
        background="neutral.000"
        borderColor="neutral.200"
        borderRadius="full"
        overflow="hidden"
      >
        <Box
          as={FedExLogoImg}
          alt="FedEx"
          width="100%"
          height="100%"
          objectFit="contain"
        />
      </Box>
      <Box
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        width={60}
        height={60}
        padding="1"
        background="neutral.000"
        borderColor="neutral.200"
        borderRadius="lg"
        overflow="hidden"
      >
        <Box
          as={UPSLogoImg}
          alt="UPS"
          width="100%"
          height="100%"
          objectFit="contain"
        />
      </Box>
    </HorizontalStack>
  ),
  parameters: {
    controls: { disable: true },
  },
};
