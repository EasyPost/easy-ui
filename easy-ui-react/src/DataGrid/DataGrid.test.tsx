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
import { mockIntersectionObserver, render } from "../utilities/test";
import { DataGrid } from "./DataGrid";
import { DataGridProps } from "./types";

describe("<DataGrid />", () => {
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    restoreIntersectionObserver = mockIntersectionObserver();
  });

  afterEach(() => {
    restoreIntersectionObserver();
    vi.useRealTimers();
  });

  it("should render a DataGrid", () => {
    renderDataGrid();
    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByLabelText("Test DataGrid")).toBeInTheDocument();
  });

  it("should support multiple selection", async () => {
    const handleSelectionChange = vi.fn();
    const [{ user }] = renderDataGrid({
      selectionMode: "multiple",
      onSelectionChange: handleSelectionChange,
    });

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
    const [{ user }] = renderDataGrid({
      selectionMode: "single",
      onSelectionChange: handleSelectionChange,
    });

    await selectRow(user, 1);
    await selectRow(user, 2);

    expect(handleSelectionChange).toBeCalledTimes(2);
    expect(getCheckbox(1)).not.toBeChecked();
    expect(getCheckbox(2)).toBeChecked();
  });

  it("should support row expansion", async () => {
    const handleExpandedChange = vi.fn();
    const [{ user }] = renderDataGrid({
      renderExpandedRow: (rowKey: Key) => <div>Row {rowKey} content</div>,
      onExpandedChange: handleExpandedChange,
    });

    await expandRow(user, 1);
    expect(screen.getByText("Row 1 content")).toBeInTheDocument();

    await expandRow(user, 2);
    expect(screen.getByText("Row 2 content")).toBeInTheDocument();
    expect(screen.queryByText("Row 1 content")).not.toBeInTheDocument();

    expect(handleExpandedChange).toBeCalledTimes(2);
    expect(handleExpandedChange.mock.calls[0][0]).toEqual(1);
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

function renderDataGrid(props: Partial<DataGridProps> = {}) {
  const renderResult = render(
    <DataGrid
      aria-label="Test DataGrid"
      columns={columns}
      rows={rows}
      renderColumnCell={(column) => <span>{String(column.name)}</span>}
      renderRowCell={(item) => <span>{String(item)}</span>}
      {...props}
    />,
  );
  return [renderResult] as const;
}

function getHead() {
  const [head] = screen.getAllByRole("rowgroup");
  return head;
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
