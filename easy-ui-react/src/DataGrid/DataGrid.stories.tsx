import DeleteIcon from "@easypost/easy-ui-icons/Delete";
import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React, { useMemo } from "react";
import { Selection } from "react-stately";
import { Menu } from "../Menu";
import { PlaceholderBox } from "../utilities/storybook";
import { DataGrid } from "./DataGrid";

type Story = StoryObj<typeof DataGrid>;

const meta: Meta<typeof DataGrid> = {
  title: "Components/DataGrid",
  component: DataGrid,
};

export default meta;

export const Basic: Story = {
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
        aria-label="Example dynamic collection table"
        columns={columns}
        rows={rows}
        renderColumnCell={(column) => (
          <span style={{ whiteSpace: "nowrap" }}>{column.name}</span>
        )}
        renderRowCell={(item) => (
          <span style={{ whiteSpace: "nowrap" }}>{item as string}</span>
        )}
      />
    );
  },
};

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
        renderExpandedRow={() => (
          <PlaceholderBox width="100%" height="140px">
            Space for content
          </PlaceholderBox>
        )}
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

export const WithKebab: Story = {
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
              <Menu.Overlay onAction={action("Menu item clicked!")}>
                <Menu.Item>Action 1</Menu.Item>
                <Menu.Item>Action 2</Menu.Item>
              </Menu.Overlay>
            ),
          },
        ]}
        templateColumns="1fr 2fr min-content"
      />
    );
  },
};

export const WithCustomAction: Story = {
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
            type: "action",
            accessibilityLabel: "Delete",
            iconSymbol: DeleteIcon,
            onAction: action("Action item clicked!"),
          },
        ]}
        templateColumns="1fr 2fr min-content"
      />
    );
  },
};

export const HeaderVariant: Story = {
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
        aria-label="Example dynamic collection table"
        columns={columns}
        rows={rows}
        headerVariant="secondary"
        renderColumnCell={(column) => (
          <span style={{ whiteSpace: "nowrap" }}>{column.name}</span>
        )}
        renderRowCell={(item) => (
          <span style={{ whiteSpace: "nowrap" }}>{item as string}</span>
        )}
      />
    );
  },
};

export const SingleSelectionModeWithDisabledKeys: Story = {
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
        aria-label="Example dynamic collection table"
        columns={columns}
        rows={rows}
        disabledKeys={[3]}
        selectionMode="single"
        renderColumnCell={(column) => (
          <span style={{ whiteSpace: "nowrap" }}>{column.name}</span>
        )}
        renderRowCell={(item) => (
          <span style={{ whiteSpace: "nowrap" }}>{item as string}</span>
        )}
      />
    );
  },
};
