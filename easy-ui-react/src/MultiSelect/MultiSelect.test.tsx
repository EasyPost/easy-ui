import { getByRole, screen } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event";
import React, { useCallback, useState } from "react";
import { vi } from "vitest";
import { mockGetComputedStyle, render, userClick } from "../utilities/test";
import { Item, MultiSelect, useFilter, useListData } from "./MultiSelect";

describe("<MultiSelect />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    restoreGetComputedStyle = mockGetComputedStyle();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    restoreGetComputedStyle();
  });

  it("should render a ComboBox", async () => {
    render(getMultiSelect());
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should open dropdown with arrow button", async () => {
    const { user } = render(getMultiSelect());
    await userClick(user, screen.getByText("Open dropdown"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("should filter dropdown with input interaction", async () => {
    const { user } = render(getMultiSelect());
    await user.type(screen.getByRole("combobox"), "ban");
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();
  });

  it("should select item", async () => {
    const { user } = render(getMultiSelect());
    await userClick(user, screen.getByText("Open dropdown"));
    const options = screen.getAllByRole("option");
    await userClick(user, options[1]);
    expect(getSelectedItem("Banana")).toBeInTheDocument();
  });

  it("should remove selected item", async () => {
    const { user } = render(
      getMultiSelect({
        initialSelectedItems: [fruits[0]],
      }),
    );
    await userClick(user, screen.getByText("Open dropdown"));
    expect(getSelectedItem("Apple")).toBeInTheDocument();
    await clearSelectedItem(user, "Apple");
    expect(screen.queryByText("No selected items")).toBeInTheDocument();
  });
});

const fruits = [
  { key: 1, label: "Apple" },
  { key: 2, label: "Banana" },
  { key: 3, label: "Cherry" },
  { key: 4, label: "Date" },
  { key: 5, label: "Elderberry" },
  { key: 6, label: "Fig" },
  { key: 7, label: "Grape" },
  { key: 8, label: "Honeydew" },
  { key: 9, label: "Kiwi" },
  { key: 10, label: "Lemon" },
  { key: 11, label: "Mango" },
  { key: 12, label: "Nectarine" },
  { key: 13, label: "Orange" },
  { key: 14, label: "Papaya" },
  { key: 15, label: "Quince" },
  { key: 16, label: "Raspberry" },
  { key: 17, label: "Strawberry" },
  { key: 18, label: "Tangerine" },
  { key: 19, label: "Ugli Fruit" },
  { key: 20, label: "Watermelon" },
] as const satisfies Item[];

const getMultiSelect = ({
  initialSelectedItems = [],
}: {
  initialSelectedItems?: Item[];
} = {}) => {
  function MultiSelectTest() {
    const [selectedItems, setSelectedItems] =
      useState<Item[]>(initialSelectedItems);
    const { contains } = useFilter({ sensitivity: "base" });
    const filter = useCallback(
      (item: Item, filterText: string) => contains(item.label, filterText),
      [contains],
    );
    const list = useListData<Item>({
      initialSelectedKeys: selectedItems.map((i) => i.key),
      initialItems: fruits,
      filter,
    });
    return (
      <MultiSelect
        dropdownItems={list.items}
        inputValue={list.filterText}
        onInputChange={list.setFilterText}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        placeholder="Select a fruit"
        maxItemsUntilScroll={10}
        renderPill={(item) => (
          <MultiSelect.Pill icon={item.icon} label={item.label} />
        )}
      >
        {(item) => (
          <MultiSelect.Option textValue={item.label}>
            <MultiSelect.OptionText>{item.label}</MultiSelect.OptionText>
          </MultiSelect.Option>
        )}
      </MultiSelect>
    );
  }
  return <MultiSelectTest />;
};

function getSelectedItem(name: string) {
  const selectedItems = screen.getByLabelText("Selected items");
  return getByRole(selectedItems, "row", { name, hidden: true });
}

async function clearSelectedItem(user: UserEvent, name: string) {
  await userClick(
    user,
    getByRole(getSelectedItem(name), "button", {
      name: /remove/i,
      hidden: true,
    }),
  );
}
