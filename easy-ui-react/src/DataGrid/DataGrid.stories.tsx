import { Meta, StoryObj } from "@storybook/react";
import React, { useMemo } from "react";
import { Selection } from "react-stately";
import { DataGrid } from "./DataGrid";
import { Menu } from "../Menu";
import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";

type Story = StoryObj<typeof DataGrid>;

const meta: Meta<typeof DataGrid> = {
  title: "Components/DataGrid",
  component: DataGrid,
};

export default meta;

export const WithSelection: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const columns = useMemo(
      () => [
        { key: "name", name: "Name" },
        { key: "type", name: "Type" },
        { key: "date", name: "Date Modified" },
      ],
      [],
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rows = useMemo(
      () => [
        { key: 1, name: "Games", date: "6/7/2020", type: "File folder" },
        {
          key: 2,
          name: "Program Files",
          date: "4/7/2021",
          type: "File folder",
        },
        { key: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
        { key: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
      ],
      [],
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
      new Set([2]),
    );

    return (
      <DataGrid
        aria-label="Example dynamic collection table"
        columns={columns}
        rows={rows}
        onSelectionChange={setSelectedKeys}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        renderColumnCell={(column) => (
          <span style={{ whiteSpace: "nowrap" }}>{column.name}</span>
        )}
        renderRowCell={(item) => (
          <span style={{ whiteSpace: "nowrap" }}>{item as string}</span>
        )}
        templateColumns="1fr 2fr min-content"
      />
    );
  },
};

export const WithExpansion: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const columns = useMemo(
      () => [
        { key: "name", name: "Name" },
        { key: "type", name: "Type" },
        { key: "date", name: "Date Modified" },
      ],
      [],
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rows = useMemo(
      () => [
        {
          key: 1,
          name: "Games",
          date: "6/7/2020",
          type: "File folder with really long text let's see what happens",
        },
        {
          key: 2,
          name: "Program Files",
          date: "4/7/2021",
          type: "File folder",
        },
        { key: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
        { key: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
      ],
      [],
    );

    return (
      <DataGrid
        aria-label="Example expandable data grid"
        columns={columns}
        maxRows={4}
        rows={rows}
        renderExpandedRow={(rowKey) => <>Custom Content {rowKey}</>}
        renderColumnCell={(column) => (
          <span style={{ whiteSpace: "nowrap" }}>{column.name}</span>
        )}
        renderRowCell={(item) => (
          <span style={{ whiteSpace: "nowrap" }}>{item as string}</span>
        )}
        templateColumns="1fr 2fr min-content"
      />
    );
  },
};

export const WithRowActions: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const columns = useMemo(
      () => [
        { key: "name", name: "Name" },
        { key: "type", name: "Type" },
        { key: "date", name: "Date Modified" },
      ],
      [],
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rows = useMemo(
      () => [
        { key: 1, name: "Games", date: "6/7/2020", type: "File folder" },
        {
          key: 2,
          name: "Program Files",
          date: "4/7/2021",
          type: "File folder",
        },
        { key: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
        { key: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
      ],
      [],
    );

    return (
      <DataGrid
        aria-label="Example table with row actions"
        columns={columns}
        rows={rows}
        renderColumnCell={(column) => (
          <span style={{ whiteSpace: "nowrap" }}>{column.name}</span>
        )}
        renderRowCell={(item) => (
          <span style={{ whiteSpace: "nowrap" }}>{item as string}</span>
        )}
        rowActions={[
          {
            type: "menu",
            renderMenuOverlay: () => (
              <Menu.Overlay
                onAction={() => {
                  console.log("menu");
                }}
              >
                <Menu.Item>Test 1</Menu.Item>
                <Menu.Item>Test 2</Menu.Item>
              </Menu.Overlay>
            ),
          },
          {
            type: "action",
            iconSymbol: CheckCircleIcon,
            accessibilityLabel: "test",
            onAction: () => {},
          },
        ]}
        templateColumns="1fr 2fr min-content"
      />
    );
  },
};
