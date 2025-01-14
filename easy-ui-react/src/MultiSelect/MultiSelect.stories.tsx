import { Meta, StoryObj } from "@storybook/react";
import React, { useCallback } from "react";
import { Icon } from "../Icon";
import { FedExLogoImg, InlineStoryDecorator } from "../utilities/storybook";
import {
  Item,
  MultiSelect,
  useAsyncList,
  useFilter,
  useListData,
} from "./MultiSelect";

type Story = StoryObj<typeof MultiSelect>;

const meta: Meta<typeof MultiSelect> = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  args: {},
  decorators: [InlineStoryDecorator],
};

export default meta;

export const Default: Story = {
  render: () => <Component />,
};

export const Async: Story = {
  render: () => <AsyncComponent />,
};

function Component() {
  const [selectedItems, setSelectedItems] = React.useState<Item[]>([
    { key: 1, label: "Apple", icon: FedExLogoImg },
  ]);
  const { contains } = useFilter({ sensitivity: "base" });
  const filter = useCallback(
    (item: Item, filterText: string) => contains(item.label, filterText),
    [contains],
  );
  const list = useListData<Item>({
    initialSelectedKeys: [1],
    initialItems: fruits,
    filter,
  });
  return (
    <div style={{ display: "inline-flex", width: "100%", maxWidth: 600 }}>
      <MultiSelect
        // isLoading={list.isLoading}
        dropdownItems={list.items}
        inputValue={list.filterText}
        onInputChange={list.setFilterText}
        disabledKeys={selectedItems.map((item) => item.key)}
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {item.icon && <Icon symbol={item.icon} />}
              <MultiSelect.OptionText>{item.label}</MultiSelect.OptionText>
            </div>
          </MultiSelect.Option>
        )}
      </MultiSelect>
    </div>
  );
}

function AsyncComponent() {
  const [selectedItems, setSelectedItems] = React.useState<Item[]>([
    { key: 1, label: "Apple", icon: FedExLogoImg },
  ]);
  const { contains } = useFilter({ sensitivity: "base" });
  const list = useAsyncList<Item>({
    initialSelectedKeys: [1],
    async load({ filterText }) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        items: fruits.filter((fruit) => {
          return filterText ? contains(fruit.label, filterText) : true;
        }),
      };
    },
  });
  return (
    <div style={{ display: "inline-flex", width: "100%", maxWidth: 600 }}>
      <MultiSelect
        isLoading={list.isLoading}
        dropdownItems={list.items}
        inputValue={list.filterText}
        onInputChange={list.setFilterText}
        disabledKeys={selectedItems.map((item) => item.key)}
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {item.icon && <Icon symbol={item.icon} />}
              <MultiSelect.OptionText>{item.label}</MultiSelect.OptionText>
            </div>
          </MultiSelect.Option>
        )}
      </MultiSelect>
    </div>
  );
}

const fruits = [
  { key: 1, label: "Apple", icon: FedExLogoImg },
  { key: 2, label: "Banana" },
  { key: 3, label: "Cherry", icon: FedExLogoImg },
  { key: 4, label: "Date", icon: FedExLogoImg },
  { key: 5, label: "Elderberry", icon: FedExLogoImg },
  { key: 6, label: "Fig", icon: FedExLogoImg },
  { key: 7, label: "Grape", icon: FedExLogoImg },
  { key: 8, label: "Honeydew", icon: FedExLogoImg },
  { key: 9, label: "Kiwi", icon: FedExLogoImg },
  { key: 10, label: "Lemon", icon: FedExLogoImg },
  { key: 11, label: "Mango", icon: FedExLogoImg },
  { key: 12, label: "Nectarine", icon: FedExLogoImg },
  { key: 13, label: "Orange", icon: FedExLogoImg },
  { key: 14, label: "Papaya", icon: FedExLogoImg },
  { key: 15, label: "Quince", icon: FedExLogoImg },
  { key: 16, label: "Raspberry", icon: FedExLogoImg },
  { key: 17, label: "Strawberry", icon: FedExLogoImg },
  { key: 18, label: "Tangerine", icon: FedExLogoImg },
  { key: 19, label: "Ugli Fruit", icon: FedExLogoImg },
  { key: 20, label: "Watermelon", icon: FedExLogoImg },
] as const as Item[];
