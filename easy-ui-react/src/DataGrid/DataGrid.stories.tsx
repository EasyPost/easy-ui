import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
import ErrorIcon from "@easypost/easy-ui-icons/Error";
import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Key } from "react-aria";
import { useAsyncList } from "react-stately";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import {
  PlaceholderBox,
  createNaiveSortingFunction,
} from "../utilities/storybook";
import { DataGrid } from "./DataGrid";
import { DataGridProps } from "./types";

type Story = StoryObj<typeof DataGrid>;

const columns = [
  { key: "name", name: "Name" },
  { key: "email", name: "Email" },
  { key: "permissions", name: "Permissions" },
  { key: "status", name: "Status" },
  { key: "lastActive", name: "Last Active" },
];

const rows = [
  {
    key: 1,
    name: "Julie Smith",
    email: "julie.smith@example.com",
    permissions: "User",
    status: "Active",
    lastActive: "2022-12-08",
  },
  {
    key: 2,
    name: "Sam Frost",
    email: "sam.frost@example.com",
    permissions: "User",
    status: "Active",
    lastActive: "2022-12-12",
  },
  {
    key: 3,
    name: "Ashley Benson",
    email: "ashley.benson@example.com",
    permissions: "Admin",
    status: "Active",
    lastActive: "2023-03-24",
  },
  {
    key: 4,
    name: "Robert Gomez",
    email: "robert.gomez@example.com",
    permissions: "User",
    status: "Inactive",
    lastActive: "2022-10-03",
  },
  {
    key: 5,
    name: "William Macintosh",
    email: "william.macintosh@example.com",
    permissions: "User",
    status: "Active",
    lastActive: "2023-01-12",
  },
  {
    key: 6,
    name: "Sarah Skylar",
    email: "sarah.skylar@example.com",
    permissions: "User",
    status: "Active",
    lastActive: "2023-06-06",
  },
];

const Template = (args: Partial<DataGridProps>) => {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      renderColumnCell={(column) => (
        <span style={{ whiteSpace: "nowrap" }}>{String(column.name)}</span>
      )}
      renderRowCell={(item) => (
        <span style={{ whiteSpace: "nowrap" }}>{String(item)}</span>
      )}
      {...args}
    />
  );
};

const meta: Meta<typeof DataGrid> = {
  title: "Components/DataGrid",
  component: DataGrid,
  args: {
    headerVariant: "primary",
    selectionMode: "none",
  },
  parameters: {
    controls: {
      include: [],
    },
  },
};

export default meta;

export const Default: Story = {
  render: Template.bind({}),
  args: {
    "aria-label": "Example data grid",
  },
  parameters: {
    controls: {
      include: [
        "aria-label",
        "headerVariant",
        "maxRows",
        "selectionMode",
        "templateColumns",
      ],
    },
  },
};

export const WithSelection: Story = {
  render: Template.bind({}),
  args: {
    "aria-label": "Example data grid with selection",
    selectionMode: "multiple",
  },
  parameters: {
    controls: {
      include: ["selectionMode"],
    },
  },
};

export const WithRowExpansion: Story = {
  render: Template.bind({}),
  args: {
    "aria-label": "Example data grid with row expansion",
    renderExpandedRow: (rowKey: Key) => (
      <PlaceholderBox width="100%" height="140px">
        Space for row {rowKey} content
      </PlaceholderBox>
    ),
  },
};

export const WithKebabMenu: Story = {
  render: Template.bind({}),
  args: {
    "aria-label": "Example data grid with kebab menu",
    rowActions: () => [
      {
        type: "menu",
        renderMenuOverlay: () => (
          <Menu.Overlay onAction={action("Menu item clicked!")}>
            <Menu.Item>Action 1</Menu.Item>
            <Menu.Item>Action 2</Menu.Item>
          </Menu.Overlay>
        ),
      },
    ],
  },
};

export const WithHeaderVariant: Story = {
  render: WithSortTemplate.bind({}),
  args: {
    "aria-label": "Example data grid with header variant",
    headerVariant: "secondary",
  },
  parameters: {
    controls: {
      include: ["headerVariant"],
    },
  },
};

export const WithSort: Story = {
  render: WithSortTemplate.bind({}),
  args: {
    "aria-label": "Example data grid with sort",
  },
};

export const WithCustomSize: Story = {
  render: WithSortTemplate.bind({}),
  args: {
    "aria-label": "Example data grid with custom size",
    selectionMode: "multiple",
    size: "lg",
  },
  parameters: {
    controls: {
      include: ["size"],
    },
  },
};

export const WithCustomRendering: Story = {
  render: Template.bind({}),
  args: {
    "aria-label": "Example data grid with custom rendering",
    renderRowCell(cell, columnKey) {
      if (columnKey === "status") {
        return (
          <span
            style={{
              whiteSpace: "nowrap",
              color: cell === "Inactive" ? "red" : "green",
            }}
          >
            {String(cell)}
          </span>
        );
      }
      return <span style={{ whiteSpace: "nowrap" }}>{String(cell)}</span>;
    },
  },
};

export const WithIcons: Story = {
  render: Template.bind({}),
  args: {
    "aria-label": "Example data grid with icons",
    renderRowCell(cell, columnKey) {
      if (columnKey === "status") {
        return (
          <span style={{ color: cell === "Inactive" ? "red" : "green" }}>
            <Icon symbol={cell === "Inactive" ? ErrorIcon : CheckCircleIcon} />
          </span>
        );
      }
      return <span style={{ whiteSpace: "nowrap" }}>{String(cell)}</span>;
    },
  },
};

export const WithRowExpansionAndKebabMenu: Story = {
  render: Template.bind({}),
  args: {
    "aria-label": "Example data grid with row expansion and kebab menu",
    rows,
    renderExpandedRow: (rowKey: Key) => (
      <PlaceholderBox width="100%" height="140px">
        Space for row {rowKey} content
      </PlaceholderBox>
    ),
    rowActions: () => [
      {
        type: "menu",
        renderMenuOverlay: () => (
          <Menu.Overlay onAction={action("Menu item clicked!")}>
            <Menu.Item>Action 1</Menu.Item>
            <Menu.Item>Action 2</Menu.Item>
          </Menu.Overlay>
        ),
      },
    ],
  },
  parameters: {
    controls: {
      include: ["size", "maxRows"],
    },
  },
};

export const WithSelectionAndSortAndKebabMenu: Story = {
  render: WithSortTemplate.bind({}),
  args: {
    "aria-label": "Example data grid with selection and sort and kebab menu",
    selectionMode: "multiple",
    rowActions: () => [
      {
        type: "menu",
        renderMenuOverlay: () => (
          <Menu.Overlay onAction={action("Menu item clicked!")}>
            <Menu.Item>Action 1</Menu.Item>
            <Menu.Item>Action 2</Menu.Item>
          </Menu.Overlay>
        ),
      },
    ],
  },
  parameters: {
    controls: {
      include: ["size", "maxRows"],
    },
  },
};

function WithSortTemplate(args: Partial<DataGridProps>) {
  // https://react-spectrum.adobe.com/react-stately/useAsyncList.html
  const list = useAsyncList({
    async load() {
      return await Promise.resolve({ items: rows });
    },
    async sort({ items, sortDescriptor }) {
      return { items: items.sort(createNaiveSortingFunction(sortDescriptor)) };
    },
  });
  return (
    <DataGrid
      columns={columns}
      rows={list.items}
      renderColumnCell={(column) => (
        <span style={{ whiteSpace: "nowrap" }}>{String(column.name)}</span>
      )}
      renderRowCell={(item) => (
        <span style={{ whiteSpace: "nowrap" }}>{String(item)}</span>
      )}
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      columnKeysAllowingSort={columns.map((c) => c.key)}
      {...args}
    />
  );
}
