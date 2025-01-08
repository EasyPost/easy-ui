import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Icon } from "../Icon";
import { FedExLogoImg, InlineStoryDecorator } from "../utilities/storybook";
import { Item, MultipleSelect, Key } from "./MultiSelect";

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
  const [selectedKeys, setSelectedKeys] = React.useState<Iterable<Key>>([1, 2]);
  return (
    <div style={{ display: "inline-flex", width: "100%", maxWidth: 600 }}>
      <MultipleSelect
        items={fruits}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        placeholder="Select a fruit"
        maxItemsUntilScroll={10}
        renderPill={(item) => (
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
