import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useListData } from "react-stately";
import { FedExLogoImg, InlineStoryDecorator } from "../utilities/storybook";
import { MultipleSelect, SelectedKey } from "./MultiSelect";
import { Icon } from "../Icon";

type Story = StoryObj<typeof MultipleSelect>;

const meta: Meta<typeof MultipleSelect> = {
  title: "Components/MultiSelect",
  component: MultipleSelect,
  args: {},
  decorators: [InlineStoryDecorator],
};

export default meta;

export const Default: Story = {
  render: () => <Component />,
};

function Component() {
  const selectedItems = useListData<SelectedKey>({
    initialItems: [fruits[0], fruits[1]],
  });
  return (
    <div style={{ display: "inline-flex", width: "100%", maxWidth: 600 }}>
      <MultipleSelect
        label="Fruits"
        selectedItems={selectedItems}
        items={fruits}
        placeholder="Select a fruit"
        maxItemsUntilScroll={10}
        pill={(item) => (
          <MultipleSelect.Pill icon={item.icon} label={item.label} />
        )}
      >
        {(item) => (
          <MultipleSelect.Option textValue={item.label}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {item.icon && <Icon symbol={item.icon} />}
              <MultipleSelect.OptionText>
                {item.label}
              </MultipleSelect.OptionText>
            </div>
          </MultipleSelect.Option>
        )}
      </MultipleSelect>
    </div>
  );
}

const fruits = [
  { id: 1, label: "Apple", icon: FedExLogoImg },
  { id: 2, label: "Banana" },
  { id: 3, label: "Cherry", icon: FedExLogoImg },
  { id: 4, label: "Date", icon: FedExLogoImg },
  { id: 5, label: "Elderberry", icon: FedExLogoImg },
  { id: 6, label: "Fig", icon: FedExLogoImg },
  { id: 7, label: "Grape", icon: FedExLogoImg },
  { id: 8, label: "Honeydew", icon: FedExLogoImg },
  { id: 9, label: "Kiwi", icon: FedExLogoImg },
  { id: 10, label: "Lemon", icon: FedExLogoImg },
  { id: 11, label: "Mango", icon: FedExLogoImg },
  { id: 12, label: "Nectarine", icon: FedExLogoImg },
  { id: 13, label: "Orange", icon: FedExLogoImg },
  { id: 14, label: "Papaya", icon: FedExLogoImg },
  { id: 15, label: "Quince", icon: FedExLogoImg },
  { id: 16, label: "Raspberry", icon: FedExLogoImg },
  { id: 17, label: "Strawberry", icon: FedExLogoImg },
  { id: 18, label: "Tangerine", icon: FedExLogoImg },
  { id: 19, label: "Ugli Fruit", icon: FedExLogoImg },
  { id: 20, label: "Watermelon", icon: FedExLogoImg },
] as const as SelectedKey[];
