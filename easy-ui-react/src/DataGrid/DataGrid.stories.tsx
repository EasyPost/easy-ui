import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React, { Key } from "react";
import { useAsyncList } from "react-stately";
import { Menu } from "../Menu";
import { PlaceholderBox } from "../utilities/storybook";
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
    email: "julie.smith@easypost.com",
    permissions: "User",
    status: "Active",
    lastActive: "2022-12-08",
  },
  {
    key: 2,
    name: "Sam Frost",
    email: "sam.frost@easypost.com",
    permissions: "User",
    status: "Active",
    lastActive: "2022-12-12",
  },
  {
    key: 3,
    name: "Ashley Benson",
    email: "ashley.benson@easypost.com",
    permissions: "Admin",
    status: "Active",
    lastActive: "2023-03-24",
  },
  {
    key: 4,
    name: "Robert Gomez",
    email: "robert.gomez@easypost.com",
    permissions: "User",
    status: "Inactive",
    lastActive: "2022-10-03",
  },
  {
    key: 5,
    name: "William Macintosh",
    email: "william.macintosh@easypost.com",
    permissions: "User",
    status: "Active",
    lastActive: "2023-01-12",
  },
  {
    key: 6,
    name: "Sarah Skylar",
    email: "sarah.skylar@easypost.com",
    permissions: "User",
    status: "Active",
    lastActive: "2023-06-06",
  },
  {
    key: 7,
    name: "Chris Rowan",
    email: "chris.rowan@easypost.com",
    permissions: "Admin",
    status: "Active",
    lastActive: "2023-08-15",
  },
  {
    key: 8,
    name: "Russell Schavers",
    email: "russell.schavers@easypost.com",
    permissions: "User",
    status: "Inactive",
    lastActive: "2022-12-01",
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
      templateColumns="min-content 1fr min-content min-content min-content"
      {...args}
    />
  );
};

const meta: Meta<typeof DataGrid> = {
  title: "Components/DataGrid",
  component: DataGrid,
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

export default meta;

export const Default: Story = {
  render: Template.bind({}),
  args: {
    "aria-label": "Example data grid",
  },
};

export const WithSelection: Story = {
  render: Template.bind({}),
  args: {
    "aria-label": "Example data grid with selection",
    selectionMode: "multiple",
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
    rowActions: [
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
  render: Template.bind({}),
  args: {
    "aria-label": "Example data grid with header variant",
    headerVariant: "secondary",
  },
};

export const WithSort: Story = {
  render: WithSortTemplate.bind({}),
  args: {
    "aria-label": "Example data grid with sort",
  },
};

function WithSortTemplate(args: DataGridProps) {
  // https://react-spectrum.adobe.com/react-stately/useAsyncList.html
  const list = useAsyncList({
    async load() {
      return await Promise.resolve({ items: rows });
    },
    async sort({ items, sortDescriptor }) {
      type ColumnType = keyof typeof sortDescriptor.column;
      return {
        items: items.sort((a, b) => {
          const first = a[sortDescriptor.column as ColumnType];
          const second = b[sortDescriptor.column as ColumnType];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;
          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }
          console.log("sorting", first, second, cmp);
          return cmp;
        }),
      };
    },
  });
  return (
    <Template
      {...args}
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      columnKeysAllowingSort={columns.map((c) => c.key)}
      rows={list.items}
    />
  );
}
