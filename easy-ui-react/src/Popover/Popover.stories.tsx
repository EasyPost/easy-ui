import PackageIcon from "@easypost/easy-ui-icons/Package";
import { Meta, StoryObj } from "@storybook/react-vite";
import React, { ReactNode, forwardRef, useState } from "react";
import { Placement } from "react-aria";
import { action } from "storybook/actions";
import { Badge } from "../Badge";
import { Box } from "../Box";
import { Button } from "../Button";
import { DropdownButton } from "../DropdownButton";
import { HorizontalStack } from "../HorizontalStack";
import { Modal } from "../Modal";
import { RadioButtonGroup } from "../RadioButtonGroup";
import { Select, SelectButton } from "../Select";
import { Text } from "../Text";
import { TextField } from "../TextField";
import { UnstyledButton } from "../UnstyledButton";
import { VerticalStack } from "../VerticalStack";
import {
  FedExLogoImg,
  OverlayLayoutDecorator,
  UPSLogoImg,
  overlayPlacements,
} from "../utilities/storybook";
import {
  Popover,
  PopoverOverlayProps,
  PopoverProps,
  usePopoverTrigger,
} from "./Popover";
import { DEFAULT_POPOVER_PLACEMENT } from "./utilities";

type Story = StoryObj<typeof Popover>;

// The shared list is spelled with physical alignments (`bottom left`), and a
// popover defaults to the logical `bottom start`, so prepend it—otherwise the
// placement control would open on a value it doesn't offer. Declared up here
// because `argTypes` reads it as the module loads.
const placements = [
  DEFAULT_POPOVER_PLACEMENT,
  ...overlayPlacements,
] as Placement[];

// A field-shaped trigger is as wide as its container, which in a story canvas is
// the whole page. These stories cap it at something a form would really use, and
// `SelectRate` also reads it through `width="trigger"`.
const TRIGGER_MAX_WIDTH = 320;

// The square each carrier mark is scaled inside of—see `RateRow`.
const CARRIER_MARK_SIZE = 32;

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  parameters: {
    controls: {
      exclude: ["children", "onOpenChange"],
    },
  },
};

export default meta;

const Template = (args: PopoverProps) => {
  const { children, ...restArgs } = args;
  return (
    <Popover {...restArgs}>
      <Popover.Trigger>
        <DropdownButton>Click me</DropdownButton>
      </Popover.Trigger>
      {children}
    </Popover>
  );
};

export const Simple: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <Popover.Overlay aria-label="Details">
        <Text>Anything can go in here.</Text>
      </Popover.Overlay>
    ),
  },
};

export const HeaderBodyFooter: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <Popover.Overlay width={320}>
        <Popover.Header>
          <Popover.Title>Popover Title</Popover.Title>
        </Popover.Header>
        <Popover.Body>
          <Text>
            The header and footer stay pinned; only the body scrolls when the
            content outgrows the popover.
          </Text>
        </Popover.Body>
        <Popover.Footer>
          <DismissButton>Done</DismissButton>
        </Popover.Footer>
      </Popover.Overlay>
    ),
  },
};

/**
 * A select-shaped trigger opening a form. `<SelectButton />` is exported from
 * the `Select` family for exactly this: it's the field visual with none of
 * `Select`'s behavior, so a popover can borrow it.
 */
export const ShipmentPackaging: Story = {
  render: () => (
    <Popover>
      {/* A field-shaped trigger fills its container, so the story pins it to a
      realistic width instead of letting it span the whole canvas. */}
      <Box maxWidth={TRIGGER_MAX_WIDTH}>
        <Popover.Trigger>
          <SelectButton iconAtStart={PackageIcon}>Add Packaging</SelectButton>
        </Popover.Trigger>
      </Box>
      <Popover.Overlay width={480}>
        <Popover.Header>
          {/* `wrap={false}` keeps the toggles on the title's line; the title
          truncates on its own if there isn't room for both. */}
          <HorizontalStack
            align="space-between"
            blockAlign="center"
            gap="2"
            wrap={false}
          >
            <Popover.Title>Shipment Packaging</Popover.Title>
            <UnitToggles />
          </HorizontalStack>
        </Popover.Header>
        <Popover.Body>
          {/* Equal grid tracks rather than a stack of `width="100%"` boxes: the
          tracks are `minmax(0, 1fr)`, so the fields line up and neither one's
          content can push the other narrow. */}
          <Box display="grid" gridTemplateColumns={2} gap="2">
            <Select label="Package" placeholder="Select a package">
              <Select.Option key="custom">Custom Package</Select.Option>
              <Select.Option key="flat-rate">
                USPS Flat Rate Envelope
              </Select.Option>
              <Select.Option key="regional-a">
                USPS Regional Box A
              </Select.Option>
            </Select>
            <TextField label="Total Weight" placeholder="0.0" />
          </Box>
        </Popover.Body>
        <Popover.Footer>
          <HorizontalStack align="end">
            <DismissButton>Packaging Complete</DismissButton>
          </HorizontalStack>
        </Popover.Footer>
      </Popover.Overlay>
    </Popover>
  ),
};

/**
 * The same shape as `ShipmentPackaging` with more fields and a second action.
 * `<Popover.Body />` is the only region that scrolls, so both footer buttons
 * stay reachable no matter how tall the form gets.
 */
export const CustomPackage: Story = {
  render: () => (
    <Popover>
      <Box maxWidth={TRIGGER_MAX_WIDTH}>
        <Popover.Trigger>
          <SelectButton iconAtStart={PackageIcon}>Custom Package</SelectButton>
        </Popover.Trigger>
      </Box>
      <Popover.Overlay width={480} maxHeight={360}>
        <Popover.Header>
          <HorizontalStack
            align="space-between"
            blockAlign="center"
            gap="2"
            wrap={false}
          >
            <Popover.Title>Custom Package</Popover.Title>
            <UnitToggles />
          </HorizontalStack>
        </Popover.Header>
        <Popover.Body>
          <VerticalStack gap="2">
            <Box display="grid" gridTemplateColumns={3} gap="2">
              <TextField label="Width" placeholder="0.0" />
              <TextField label="Height" placeholder="0.0" />
              <TextField label="Length" placeholder="0.0" />
            </Box>
            <Box display="grid" gridTemplateColumns={2} gap="2">
              <TextField label="Package Weight" placeholder="0.0" />
              <TextField label="Total Weight" placeholder="0.0" />
            </Box>
          </VerticalStack>
        </Popover.Body>
        <Popover.Footer>
          <HorizontalStack align="end" gap="1" wrap={false}>
            <Button
              size="sm"
              variant="outlined"
              onPress={action("Save Packaging")}
            >
              Save Packaging
            </Button>
            <DismissButton>Packaging Complete</DismissButton>
          </HorizontalStack>
        </Popover.Footer>
      </Popover.Overlay>
    </Popover>
  ),
};

/**
 * `width="trigger"` locks the panel to the trigger's width, and the pinned footer
 * keeps "View 10 More" reachable while the rows scroll.
 *
 * The rows are composed rather than being `<Select.Option />`s on purpose: a
 * `listbox` can't hold the footer link, and its options would truncate and
 * restyle this content. If your rows really are selectable options and nothing
 * else, use `<Select />` or `<Menu />` instead.
 */
export const SelectRate: Story = {
  render: () => (
    <Popover>
      <Box maxWidth={TRIGGER_MAX_WIDTH}>
        <Popover.Trigger>
          <SelectButton>Select Rate</SelectButton>
        </Popover.Trigger>
      </Box>
      <Popover.Overlay width="trigger" maxHeight={320}>
        <Popover.Header>
          <Popover.Title>Select Rate</Popover.Title>
        </Popover.Header>
        <Popover.Body>
          {rates.map((rate, index) => (
            <RateRow
              key={rate.price}
              {...rate}
              hasDivider={index < rates.length - 1}
            />
          ))}
        </Popover.Body>
        <Popover.Footer>
          {/* Centered, because a link button's own horizontal padding would sit
          it a few pixels inside the rows above it. */}
          <HorizontalStack align="center">
            <Button size="sm" variant="link" onPress={action("View 10 More")}>
              View 10 More
            </Button>
          </HorizontalStack>
        </Popover.Footer>
      </Popover.Overlay>
    </Popover>
  ),
};

/**
 * A summary card trigger. `SummaryCard` below is deliberately story-local—copy
 * it into your app and adjust it. The one requirement `<Popover.Trigger />`
 * makes of a custom trigger is that it forward its ref and spread the props
 * it's handed onto a focusable element.
 */
export const Items: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger>
        <SummaryCard
          title="2 Items"
          description="King Zazi Sweater SKU 12345 + 1 More"
        />
      </Popover.Trigger>
      <Popover.Overlay width={400}>
        <Popover.Header>
          <HorizontalStack align="space-between" blockAlign="center" gap="2">
            <Popover.Title>Items</Popover.Title>
            <Badge variant="black" secondaryLabel="2">
              Total Items
            </Badge>
          </HorizontalStack>
        </Popover.Header>
        <Popover.Body>
          {items.map((item, index) => (
            <ItemRow
              key={item.sku}
              {...item}
              hasDivider={index < items.length - 1}
            />
          ))}
        </Popover.Body>
      </Popover.Overlay>
    </Popover>
  ),
};

/**
 * Any component that forwards its ref and spreads its rest props onto a
 * focusable element works as the trigger—`Button`, `DropdownButton`,
 * `IconButton`, `KebabButton`, `SelectButton`, `UnstyledButton`, or your own.
 */
export const CustomTrigger: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger>
        <UnstyledButton>
          <Text variant="body1" color="primary.600" weight="semibold">
            An UnstyledButton trigger
          </Text>
        </UnstyledButton>
      </Popover.Trigger>
      <Popover.Overlay aria-label="Details">
        <Text>Anything can go in here.</Text>
      </Popover.Overlay>
    </Popover>
  ),
};

export const WidthOptions: Story = {
  render: () => (
    <HorizontalStack gap="4" wrap>
      {widths.map(({ width, description }) => (
        <Popover key={String(width)}>
          <Popover.Trigger>
            <DropdownButton>width={String(width)}</DropdownButton>
          </Popover.Trigger>
          <Popover.Overlay width={width} aria-label={`Width ${width}`}>
            <Text>{description}</Text>
          </Popover.Overlay>
        </Popover>
      ))}
    </HorizontalStack>
  ),
};

export const CustomContainer: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger>
        <DropdownButton>Announcement</DropdownButton>
      </Popover.Trigger>
      <Popover.Overlay
        aria-label="Announcement"
        width={320}
        background="primary.100"
        borderColor="primary.500"
        borderRadius="lg"
        boxShadow="2"
      >
        <Text>
          The container takes any <code>{`<Box />`}</code> style prop, so a
          popover that needs to look different doesn&apos;t need a new
          component.
        </Text>
      </Popover.Overlay>
    </Popover>
  ),
};

export const CustomPlacement: StoryObj<PopoverOverlayProps> = {
  render: ({ placement }) => (
    <Popover>
      <Popover.Trigger>
        <DropdownButton>Click me</DropdownButton>
      </Popover.Trigger>
      <Popover.Overlay placement={placement} aria-label="Details">
        <Text>Placed {placement}.</Text>
      </Popover.Overlay>
    </Popover>
  ),
  args: {
    placement: DEFAULT_POPOVER_PLACEMENT,
  },
  argTypes: {
    placement: {
      options: placements,
      control: { type: "select" },
    },
  },
  decorators: [OverlayLayoutDecorator],
  parameters: {
    overlayLayout: {
      framePaddingY: 150,
    },
  },
};

export const Controlled: Story = {
  render: () => {
    const ControlledPopover = () => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <HorizontalStack gap="2" blockAlign="center">
          <Button variant="outlined" onPress={() => setIsOpen(!isOpen)}>
            Toggle from outside
          </Button>
          <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger>
              <DropdownButton>Click me</DropdownButton>
            </Popover.Trigger>
            <Popover.Overlay aria-label="Details">
              <Text>The popover is {isOpen ? "open" : "closed"}.</Text>
            </Popover.Overlay>
          </Popover>
        </HorizontalStack>
      );
    };
    return <ControlledPopover />;
  },
};

/**
 * With a header and a footer, only `<Popover.Body />` scrolls—the title and the
 * actions stay put.
 */
export const ScrollingContent: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <Popover.Overlay width={320} maxHeight={280}>
        <Popover.Header>
          <Popover.Title>Pinned Title</Popover.Title>
        </Popover.Header>
        <Popover.Body>
          <VerticalStack gap="2">
            {Array.from({ length: 20 }, (_, index) => (
              <Text key={index}>Row {index + 1}</Text>
            ))}
          </VerticalStack>
        </Popover.Body>
        <Popover.Footer>
          <DismissButton>Pinned Action</DismissButton>
        </Popover.Footer>
      </Popover.Overlay>
    ),
  },
};

/**
 * A popover nests inside a modal. Only the topmost overlay responds to escape
 * and to an outside press, so dismissing the popover leaves the modal open.
 */
export const InsideModal: Story = {
  render: () => (
    <Modal.Trigger>
      <Button>Open modal</Button>
      {/* `Modal.Trigger` hands a `close` to a function child, which is how the
      footer action dismisses the modal. `sm` suits one field, and `Modal`'s body
      carries only 4px of bottom padding, so a modal with no footer would sit
      oddly tight against its content. */}
      {(close) => (
        <Modal size="sm">
          <Modal.Header>Modal with a Popover</Modal.Header>
          <Modal.Body>
            <Popover>
              <Popover.Trigger>
                <SelectButton>Add Packaging</SelectButton>
              </Popover.Trigger>
              <Popover.Overlay width={320}>
                <Popover.Header>
                  <Popover.Title>Shipment Packaging</Popover.Title>
                </Popover.Header>
                <Popover.Body>
                  <TextField label="Total Weight" placeholder="0.0" />
                </Popover.Body>
                <Popover.Footer>
                  <DismissButton>Packaging Complete</DismissButton>
                </Popover.Footer>
              </Popover.Overlay>
            </Popover>
          </Modal.Body>
          <Modal.Footer primaryAction={{ content: "Done", onAction: close }} />
        </Modal>
      )}
    </Modal.Trigger>
  ),
};

/**
 * Closes the popover it's rendered inside of. `usePopoverTrigger()` returns the
 * popover's state, so a footer action doesn't need the state drilled into it.
 */
function DismissButton({ children }: { children: ReactNode }) {
  const { close } = usePopoverTrigger();
  // `sm`, because a popover's footer sits closer to its content than a modal's
  // does and a default-size button overwhelms the panel.
  return (
    <Button size="sm" onPress={close}>
      {children}
    </Button>
  );
}

function UnitToggles() {
  return (
    <HorizontalStack gap="1" wrap={false}>
      <RadioButtonGroup
        aria-label="Dimension unit"
        defaultSelectedKeys={["in"]}
        disallowEmptySelection
      >
        <RadioButtonGroup.Button id="in">in</RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="cm">cm</RadioButtonGroup.Button>
      </RadioButtonGroup>
      <RadioButtonGroup
        aria-label="Weight unit"
        defaultSelectedKeys={["lb"]}
        disallowEmptySelection
      >
        <RadioButtonGroup.Button id="lb">lb</RadioButtonGroup.Button>
        <RadioButtonGroup.Button id="oz">oz</RadioButtonGroup.Button>
      </RadioButtonGroup>
    </HorizontalStack>
  );
}

type SummaryCardProps = {
  /** The card's prominent first line. */
  title: ReactNode;
  /** The card's quieter second line. */
  description: ReactNode;
};

/**
 * A two-line card that opens a popover.
 *
 * This lives in the story file rather than in the design system—copy it and
 * make it yours. Note the two things `<Popover.Trigger />` needs from a custom
 * trigger, both of which are easy to leave out by accident:
 *
 * 1. `forwardRef`, with the ref landing on the focusable element. The popover
 *    positions itself against whatever the ref points at.
 * 2. Spreading the rest props onto that same focusable element. They carry the
 *    press handler and the `aria-expanded`/`aria-controls`/`aria-haspopup`
 *    wiring.
 *
 * A component that only renders its own props—`Badge`, `Card`—won't work here.
 * And if a field-shaped border with a chevron suits you, `<SelectButton
 * description="…" />` gives you a two-line trigger with no custom component at
 * all.
 */
const SummaryCard = forwardRef<null, SummaryCardProps>((props, ref) => {
  const { title, description, ...restProps } = props;
  return (
    <UnstyledButton ref={ref} {...restProps}>
      <Box
        borderWidth="1"
        borderColor="neutral.200"
        borderRadius="md"
        paddingX="3"
        paddingY="2"
        textAlign="start"
      >
        <VerticalStack gap="0.5">
          <Text variant="subtitle2" color="primary.600">
            {title}
          </Text>
          <Text variant="caption" color="neutral.600" truncate>
            {description}
          </Text>
        </VerticalStack>
      </Box>
    </UnstyledButton>
  );
});

SummaryCard.displayName = "SummaryCard";

// `auto` and `trigger` both read the trigger's measured width; the difference is
// whether it's a floor or a hard width, which only shows up on content this wide.
const widths = [
  { width: "fit-content", description: "Sized to its content." },
  {
    width: "auto",
    description: "At least the trigger's width, and wider here.",
  },
  {
    width: "trigger",
    description: "Exactly the trigger's width, so this wraps.",
  },
  { width: 320, description: "An explicit width." },
] as const;

const rates = [
  {
    carrier: UPSLogoImg,
    price: "$14.62",
    delivery: "3 days",
    from: "Default Address",
  },
  {
    carrier: FedExLogoImg,
    price: "$18.04",
    delivery: "2 days",
    from: "Default Address",
  },
  {
    carrier: UPSLogoImg,
    price: "$32.19",
    delivery: "1 day",
    from: "Default Address",
  },
  {
    carrier: FedExLogoImg,
    price: "$41.85",
    delivery: "Overnight",
    from: "Default Address",
  },
];

type RateRowProps = (typeof rates)[number] & { hasDivider: boolean };

function RateRow(props: RateRowProps) {
  const { carrier: Carrier, price, delivery, from, hasDivider } = props;
  return (
    <Box
      as="button"
      type="button"
      onClick={action("Rate selected")}
      background="neutral.000"
      borderBottomWidth={hasDivider ? "1" : undefined}
      borderColor={hasDivider ? "neutral.100" : undefined}
      cursor="pointer"
      paddingY="2"
      textAlign="start"
      width="100%"
    >
      {/* `blockAlign="start"` so the mark sits against the top of the row rather
      than floating at the vertical center of three lines of text. */}
      <HorizontalStack gap="2" blockAlign="start" wrap={false}>
        {/* Carrier marks don't share an aspect ratio—the UPS shield is tall, the
        FedEx wordmark is wide—so each one is scaled inside a fixed square.
        Without it, every row's text would start at a different x. Centered
        inside that square, which is what puts a wide mark and a tall one on the
        same optical line as the price. */}
        <Box
          alignItems="center"
          display="flex"
          flexShrink={0}
          height={CARRIER_MARK_SIZE}
          justifyContent="center"
          width={CARRIER_MARK_SIZE}
        >
          <Carrier
            alt=""
            width="100%"
            height="100%"
            style={{ objectFit: "contain" }}
          />
        </Box>
        <VerticalStack gap="0.5">
          <Text variant="subtitle1">{price}</Text>
          <Text variant="caption" color="neutral.600">
            Delivery: {delivery}
          </Text>
          <Text variant="caption" color="neutral.600">
            From: {from}
          </Text>
        </VerticalStack>
      </HorizontalStack>
    </Box>
  );
}

// A stand-in for a product photo. There's no image component in Easy UI yet, so
// `<Box as="img" />` is the way to render one with design system tokens.
const THUMBNAIL_SRC =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjYjBiN2MzIi8+PHBhdGggZD0iTTEyIDMwbDgtMTAgNiA3IDQtNSA2IDh6IiBmaWxsPSIjZThlYWVmIi8+PC9zdmc+";

const items = [
  {
    title: "King Zazi Sweater",
    variant: "Small / Heather Gray",
    sku: "3804342803",
  },
  {
    title: "Bantam Wool Beanie",
    variant: "One Size / Charcoal",
    sku: "3804342811",
  },
];

type ItemRowProps = (typeof items)[number] & { hasDivider: boolean };

function ItemRow(props: ItemRowProps) {
  const { title, variant, sku, hasDivider } = props;
  return (
    <Box
      borderBottomWidth={hasDivider ? "1" : undefined}
      borderColor={hasDivider ? "neutral.100" : undefined}
      paddingY="2"
    >
      {/* `blockAlign="start"` so the thumbnail sits against the top of the row
      rather than floating at the vertical center of three lines of text. */}
      <HorizontalStack gap="2" blockAlign="start" wrap={false}>
        <Box
          as="img"
          src={THUMBNAIL_SRC}
          alt=""
          borderRadius="md"
          flexShrink={0}
          height={48}
          width={48}
          objectFit="cover"
        />
        {/* `inlineAlign="start"` so the SKU button hugs its text. Stack children
        stretch by default, and a stretched `<button>` centers its label, which
        left the SKU floating a different distance in on every row. */}
        <VerticalStack gap="0.5" inlineAlign="start">
          <Text variant="subtitle1">{title}</Text>
          <Text variant="caption" color="neutral.600">
            {variant}
          </Text>
          {/* An `UnstyledButton` rather than `<Button variant="link" />`: a
          button carries horizontal padding, which would indent this line past
          the two above it. */}
          <UnstyledButton onPress={action("SKU pressed")}>
            <Text variant="caption" color="primary.600" weight="semibold">
              SKU #{sku}
            </Text>
          </UnstyledButton>
        </VerticalStack>
      </HorizontalStack>
    </Box>
  );
}
