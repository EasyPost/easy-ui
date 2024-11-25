import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import type { Selection } from "react-stately";
import React from "react";
import { DropdownButton } from "../DropdownButton";
import {
  OverlayLayoutDecorator,
  overlayPlacements,
} from "../utilities/storybook";
import { Menu, MenuProps } from "./Menu";
import { MenuOverlayProps } from "./MenuOverlay";

type Story = StoryObj<typeof Menu>;

const Template = (args: MenuProps) => {
  const { children, ...restArgs } = args;
  return (
    <Menu {...restArgs}>
      <Menu.Trigger>
        <DropdownButton>Click me</DropdownButton>
      </Menu.Trigger>
      {children}
    </Menu>
  );
};

const meta: Meta<typeof Menu> = {
  title: "Components/Menu",
  component: Menu,
  parameters: {
    controls: {
      exclude: ["children", "onOpenChange"],
    },
  },
};

export default meta;

export const SimpleMenu: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <Menu.Overlay onAction={action("Selected")}>
        <Menu.Item key="copy">Copy</Menu.Item>
        <Menu.Item key="cut">Cut</Menu.Item>
        <Menu.Item key="paste">Paste</Menu.Item>
      </Menu.Overlay>
    ),
  },
};

export const WithSeparator: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <Menu.Overlay onAction={action("Selected")}>
        <Menu.Section aria-label="Edit commands">
          <Menu.Item key="edit">Edit</Menu.Item>
          <Menu.Item key="duplicate">Duplicate</Menu.Item>
        </Menu.Section>
        <Menu.Section aria-label="Copy commands">
          <Menu.Item key="copy">Copy</Menu.Item>
          <Menu.Item key="paste">Paste</Menu.Item>
        </Menu.Section>
      </Menu.Overlay>
    ),
  },
};

export const WithTitle: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <Menu.Overlay onAction={action("Selected")}>
        <Menu.Section aria-label="Edit commands" title="Title option">
          <Menu.Item key="edit">Edit</Menu.Item>
          <Menu.Item key="duplicate">Duplicate</Menu.Item>
        </Menu.Section>
        <Menu.Section aria-label="Copy commands" title="Title option">
          <Menu.Item key="copy">Copy</Menu.Item>
          <Menu.Item key="paste">Paste</Menu.Item>
        </Menu.Section>
      </Menu.Overlay>
    ),
  },
};

export const ScrollsOnMaxItems: StoryObj<MenuOverlayProps<unknown>> = {
  render: ({ maxItemsUntilScroll, ...menuProps }) => (
    <Menu {...menuProps}>
      <Menu.Trigger>
        <DropdownButton>Click me</DropdownButton>
      </Menu.Trigger>
      <Menu.Overlay
        onAction={action("Selected")}
        maxItemsUntilScroll={maxItemsUntilScroll}
      >
        <Menu.Item key="edit">Edit</Menu.Item>
        <Menu.Item key="duplicate">Duplicate</Menu.Item>
        <Menu.Item key="archive">Archive</Menu.Item>
        <Menu.Item key="delete">Delete</Menu.Item>
        <Menu.Item key="copy">Copy</Menu.Item>
        <Menu.Item key="cut">Cut</Menu.Item>
        <Menu.Item key="paste">Paste</Menu.Item>
      </Menu.Overlay>
    </Menu>
  ),
  args: {
    maxItemsUntilScroll: 5,
  },
  argTypes: {
    maxItemsUntilScroll: {
      control: { type: "number" },
    },
  },
};

export const WithLongItems: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <Menu.Overlay onAction={action("Selected")}>
        <Menu.Item key="download-carriers">Download carriers report</Menu.Item>
        <Menu.Item key="download-shipping">Download shipping report</Menu.Item>
      </Menu.Overlay>
    ),
  },
};

export const MatchContentWidth: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <Menu.Overlay onAction={action("Selected")} width="fit-content">
        <Menu.Item key="copy">Copy</Menu.Item>
        <Menu.Item key="cut">Cut</Menu.Item>
        <Menu.Item key="paste">Paste</Menu.Item>
      </Menu.Overlay>
    ),
  },
};

export const DefinedWidth: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <Menu.Overlay onAction={action("Selected")} width={300}>
        <Menu.Item key="copy">Copy</Menu.Item>
        <Menu.Item key="cut">Cut</Menu.Item>
        <Menu.Item key="paste">Paste</Menu.Item>
      </Menu.Overlay>
    ),
  },
};

export const DefinedResponsiveWidth: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <Menu.Overlay onAction={action("Selected")} width={{ xs: 150, lg: 250 }}>
        <Menu.Item key="copy">Copy</Menu.Item>
        <Menu.Item key="cut">Cut</Menu.Item>
        <Menu.Item key="paste">Paste</Menu.Item>
      </Menu.Overlay>
    ),
  },
};

// Simulating a custom link from next/link, etc
type LinkProps = React.ComponentProps<"a"> & {
  replace?: boolean;
};
const Link = React.forwardRef<null, LinkProps>(({ replace, ...props }, ref) => (
  <a ref={ref} data-replace={replace} {...props} />
));
Link.displayName = "Link";
export const MixedItemTypes: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <Menu.Overlay onAction={action("Selected")} disabledKeys={["no-results"]}>
        <Menu.Item key="no-results">Nothing to click here</Menu.Item>
        <Menu.Item key="link" href="https://easypost.com" target="_blank">
          I am a link
        </Menu.Item>
        <Menu.Item<LinkProps>
          key="custom-link"
          href="https://easypost.com"
          hrefComponent={Link}
          target="_blank"
          replace
        >
          I am a custom link
        </Menu.Item>
        <Menu.Item key="normal">I am a standard menu item</Menu.Item>
      </Menu.Overlay>
    ),
  },
};

export const CustomPlacement: StoryObj<MenuOverlayProps<unknown>> = {
  render: ({ placement, ...menuProps }) => (
    <Menu {...menuProps}>
      <Menu.Trigger>
        <DropdownButton>Click me</DropdownButton>
      </Menu.Trigger>
      <Menu.Overlay
        onAction={action("Selected")}
        placement={placement}
        width="fit-content"
      >
        <Menu.Item key="copy">Copy</Menu.Item>
        <Menu.Item key="cut">Cut</Menu.Item>
        <Menu.Item key="paste">Paste</Menu.Item>
      </Menu.Overlay>
    </Menu>
  ),
  args: {
    placement: "bottom left",
  },
  argTypes: {
    placement: {
      options: overlayPlacements,
      control: { type: "select" },
    },
  },
  parameters: {
    overlayLayout: {
      framePaddingY: 150,
    },
  },
  decorators: [OverlayLayoutDecorator],
};

export const MultipleSelection: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
      new Set([]),
    );

    return (
      <Menu>
        <Menu.Trigger>
          <DropdownButton>Click me</DropdownButton>
        </Menu.Trigger>
        <Menu.Overlay
          onSelectionChange={setSelectedKeys}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onAction={action("Selected")}
        >
          <Menu.Item key="transit">In Transit</Menu.Item>
          <Menu.Item key="delivery">Out for Delivery</Menu.Item>
          <Menu.Item key="delivered">Delivered</Menu.Item>
        </Menu.Overlay>
      </Menu>
    );
  },
};

export const MultipleSelectionWithSelectAll: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
      new Set([]),
    );

    return (
      <Menu>
        <Menu.Trigger>
          <DropdownButton>Click me</DropdownButton>
        </Menu.Trigger>
        <Menu.Overlay
          selectionMode="multiple"
          onSelectionChange={setSelectedKeys}
          selectedKeys={selectedKeys}
          onAction={action("Selected")}
        >
          <Menu.Section aria-label="All Status">
            <Menu.Item key="all">All Statues</Menu.Item>
          </Menu.Section>
          <Menu.Section aria-label="Status">
            <Menu.Item key="transit">In Transit</Menu.Item>
            <Menu.Item key="delivery">Out for Delivery</Menu.Item>
            <Menu.Item key="delivered">Delivered</Menu.Item>
          </Menu.Section>
        </Menu.Overlay>
      </Menu>
    );
  },
};
