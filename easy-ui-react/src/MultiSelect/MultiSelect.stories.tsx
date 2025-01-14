import { Meta, StoryObj } from "@storybook/react";
import React, { useCallback } from "react";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
import {
  FedExLogoImg,
  InlineStoryDecorator,
  UPSLogoImg,
} from "../utilities/storybook";
import {
  Item,
  MultiSelect,
  useAsyncList,
  useFilter,
  useListData,
} from "./MultiSelect";
import { fruits } from "./MultiSelect.test";

type Story = StoryObj<typeof MultiSelect>;

const meta: Meta<typeof MultiSelect> = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  args: {},
  decorators: [
    (Story) => (
      <div style={{ display: "inline-flex", width: "100%", maxWidth: 600 }}>
        <Story />
      </div>
    ),
    InlineStoryDecorator,
  ],
};

export default meta;

export const StandardDropdown: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = React.useState<Item[]>([
      fruits[0],
    ]);
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
  },
};

export const AsyncDropdown: Story = {
  render: () => {
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
      <MultiSelect
        isLoading={list.isLoading}
        dropdownItems={list.items}
        inputValue={list.filterText}
        onInputChange={list.setFilterText}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        placeholder="Select a fruit"
        maxItemsUntilScroll={10}
        renderPill={(item) => <MultiSelect.Pill label={item.label} />}
      >
        {(item) => (
          <MultiSelect.Option textValue={item.label}>
            <MultiSelect.OptionText>{item.label}</MultiSelect.OptionText>
          </MultiSelect.Option>
        )}
      </MultiSelect>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const carriers = [
      { key: 1, label: "UPS", icon: UPSLogoImg },
      { key: 2, label: "FedEx", icon: FedExLogoImg },
    ] as const satisfies Item[];
    const [selectedItems, setSelectedItems] = React.useState<Item[]>([
      carriers[0],
    ]);
    const { contains } = useFilter({ sensitivity: "base" });
    const filter = useCallback(
      (item: Item, filterText: string) => contains(item.label, filterText),
      [contains],
    );
    const list = useListData<Item>({
      initialSelectedKeys: selectedItems.map((i) => i.key),
      initialItems: carriers,
      filter,
    });
    return (
      <MultiSelect
        dropdownItems={list.items}
        inputValue={list.filterText}
        onInputChange={list.setFilterText}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        placeholder="Select a carrier"
        maxItemsUntilScroll={10}
        renderPill={(item) => (
          <MultiSelect.Pill icon={item.icon} label={item.label} />
        )}
      >
        {(item) => (
          <MultiSelect.Option textValue={item.label}>
            <HorizontalStack gap="1" blockAlign="center">
              {item.icon && <Icon symbol={item.icon} />}
              <MultiSelect.OptionText>{item.label}</MultiSelect.OptionText>
            </HorizontalStack>
          </MultiSelect.Option>
        )}
      </MultiSelect>
    );
  },
};

export const DisabledKeys: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = React.useState<Item[]>([
      fruits[0],
    ]);
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
            <HorizontalStack gap="1" blockAlign="center">
              {item.icon && <Icon symbol={item.icon} />}
              <MultiSelect.OptionText>{item.label}</MultiSelect.OptionText>
            </HorizontalStack>
          </MultiSelect.Option>
        )}
      </MultiSelect>
    );
  },
};

export const MaxItemsUntilScroll: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = React.useState<Item[]>([
      fruits[0],
    ]);
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
        disabledKeys={selectedItems.map((item) => item.key)}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        placeholder="Select a fruit"
        maxItemsUntilScroll={4}
        renderPill={(item) => (
          <MultiSelect.Pill icon={item.icon} label={item.label} />
        )}
      >
        {(item) => (
          <MultiSelect.Option textValue={item.label}>
            <HorizontalStack gap="1" blockAlign="center">
              {item.icon && <Icon symbol={item.icon} />}
              <MultiSelect.OptionText>{item.label}</MultiSelect.OptionText>
            </HorizontalStack>
          </MultiSelect.Option>
        )}
      </MultiSelect>
    );
  },
};
