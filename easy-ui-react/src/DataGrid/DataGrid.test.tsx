import {
  getAllByRole,
  getByLabelText,
  getByRole,
  screen,
} from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import React, { Key } from "react";
import { vi } from "vitest";
import { selectCheckbox } from "../Checkbox/Checkbox.test";
import { Menu } from "../Menu";
import { getComponentToken } from "../utilities/css";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
} from "../utilities/test";
import { DataGrid } from "./DataGrid";
import { DataGridProps } from "./types";

describe("<DataGrid />", () => {
  let restoreGetComputedStyle: () => void;
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    restoreIntersectionObserver = mockIntersectionObserver();
    restoreGetComputedStyle = mockGetComputedStyle();
  });

  afterEach(() => {
    restoreGetComputedStyle();
    restoreIntersectionObserver();
    vi.useRealTimers();
  });

  it("should render a data grid", () => {
    render(createDataGrid());
    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByLabelText("Test DataGrid")).toBeInTheDocument();
  });

  it("should support max rows", () => {
    render(createDataGrid({ maxRows: 8 }));
    expect(getContainer()).toHaveStyle(
      getComponentToken("data-grid", "max-rows", "8"),
    );
  });

  it("should support custom template columns", () => {
    render(createDataGrid({ templateColumns: "1fr 2fr" }));
    expect(getContainer()).toHaveStyle(
      getComponentToken("data-grid", "template-columns", "1fr 2fr"),
    );
  });

  it("should support a header variant", () => {
    render(createDataGrid({ headerVariant: "secondary" }));
    expect(screen.getByRole("grid")).toHaveAttribute(
      "class",
      expect.stringContaining("headerSecondary"),
    );
  });

  it("should support multiple selection", async () => {
    const handleSelectionChange = vi.fn();
    const { user } = render(
      createDataGrid({
        selectionMode: "multiple",
        onSelectionChange: handleSelectionChange,
      }),
    );

    await selectRow(user, 1);
    await selectRow(user, 2);

    expect(handleSelectionChange).toBeCalledTimes(2);
    expect([...handleSelectionChange.mock.calls[0][0].values()]).toEqual([1]);
    expect(getCheckbox(1)).toBeChecked();
    expect(getCheckbox(2)).toBeChecked();

    await selectRow(user, 2);
    expect(getCheckbox(2)).not.toBeChecked();

    await selectAll(user);
    expect(getCheckbox(2)).toBeChecked();
  });

  it("should support single selection", async () => {
    const handleSelectionChange = vi.fn();
    const { user } = render(
      createDataGrid({
        selectionMode: "single",
        onSelectionChange: handleSelectionChange,
      }),
    );

    await selectRow(user, 1);
    await selectRow(user, 2);

    expect(handleSelectionChange).toBeCalledTimes(2);
    expect(getCheckbox(1)).not.toBeChecked();
    expect(getCheckbox(2)).toBeChecked();
  });

  it("should support row expansion", async () => {
    const handleExpandedChange = vi.fn();
    const { user } = render(
      createDataGrid({
        renderExpandedRow: (rowKey: Key) => <div>Row {rowKey} content</div>,
        onExpandedChange: handleExpandedChange,
      }),
    );

    await expandRow(user, 1);
    expect(screen.getByText("Row 1 content")).toBeInTheDocument();

    await expandRow(user, 2);
    expect(screen.getByText("Row 2 content")).toBeInTheDocument();
    expect(screen.queryByText("Row 1 content")).not.toBeInTheDocument();

    expect(handleExpandedChange).toBeCalledTimes(2);
    expect(handleExpandedChange.mock.calls[0][0]).toEqual(1);
  });

  it("should support a kebab menu", async () => {
    const handleMenuAction = vi.fn();
    const { user } = render(
      createDataGrid({
        rowActions: () => [
          {
            type: "menu",
            renderMenuOverlay: () => (
              <Menu.Overlay onAction={handleMenuAction}>
                <Menu.Item>Action 1</Menu.Item>
                <Menu.Item>Action 2</Menu.Item>
              </Menu.Overlay>
            ),
          },
        ],
      }),
    );

    await user.click(getByRole(getRow(1), "button", { name: "Actions" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: "Action 1" }));
    expect(handleMenuAction).toBeCalled();
  });

  it("should support sorting", async () => {
    const handleSortChange = vi.fn();
    const { user, rerender } = render(
      createDataGrid({
        onSortChange: handleSortChange,
        columnKeysAllowingSort: ["name"],
      }),
    );
    expect(getColumn("Name")).toHaveAccessibleDescription("sortable column");

    await user.click(getColumn("Name"));
    expect(handleSortChange).toBeCalledWith({
      column: "name",
      direction: "ascending",
    });

    rerender(
      createDataGrid({
        sortDescriptor: { column: "name", direction: "ascending" },
        onSortChange: handleSortChange,
        columnKeysAllowingSort: ["name"],
      }),
    );
    expect(getColumn("Name")).toHaveAttribute("aria-sort", "ascending");

    await user.click(getColumn("Name"));
    expect(handleSortChange).toBeCalledWith({
      column: "name",
      direction: "ascending",
    });
  });
});

const columns = [
  { key: "name", name: "Name" },
  { key: "email", name: "Email" },
];

const rows = [
  {
    key: 1,
    name: "Julie Smith",
    email: "julie.smith@easypost.com",
  },
  {
    key: 2,
    name: "Sam Frost",
    email: "sam.frost@easypost.com",
  },
];

function createDataGrid(props: Partial<DataGridProps> = {}) {
  return (
    <DataGrid
      aria-label="Test DataGrid"
      columns={columns}
      rows={rows}
      renderColumnCell={(column) => <span>{String(column.name)}</span>}
      renderRowCell={(item) => <span>{String(item)}</span>}
      {...props}
    />
  );
}

function getContainer() {
  return screen.getByRole("grid").parentElement as HTMLElement;
}

function getHead() {
  const [head] = screen.getAllByRole("rowgroup");
  return head;
}

function getColumn(name: string) {
  return getByRole(getHead(), "columnheader", { name });
}

function getBody() {
  const [, body] = screen.getAllByRole("rowgroup");
  return body;
}

function getRow(key: Key) {
  const rows = getAllByRole(getBody(), "row");
  const row = [...rows].find((r) => r.getAttribute("data-key") === String(key));
  if (!row) {
    throw new Error(`Unable to find row with key ${key}`);
  }
  return row;
}

function getCheckbox(key: Key) {
  return getByLabelText(getRow(key), "Select");
}

async function selectRow(user: UserEvent, key: Key) {
  const row = getRow(key);
  const select = getByLabelText(row, "Select");
  await selectCheckbox(user, select);
}

async function selectAll(user: UserEvent) {
  await selectCheckbox(
    user,
    getByLabelText(getByRole(getHead(), "row"), "Select All"),
  );
}

async function expandRow(user: UserEvent, key: Key) {
  await user.click(getByRole(getRow(key), "button", { name: "Expand" }));
}
