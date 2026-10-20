import LocationOnIcon from "@easypost/easy-ui-icons/LocationOn";
import { Meta, StoryObj } from "@storybook/react-vite";
import React, { useEffect, useRef, useState } from "react";
import { InputDecorator } from "../utilities/storybook";
import { VerticalStack } from "../VerticalStack";
import { ComboBox, ComboBoxProps } from "./ComboBox";

type Fruit = { id: number; name: string };

const fruits: Fruit[] = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Kiwi",
  "Lemon",
  "Mango",
].map((name, i) => ({ id: i + 1, name }));

type Prediction = { place_id: string; description: string };

const addresses: Prediction[] = [
  "417 Montgomery St, San Francisco, CA, USA",
  "417 Market St, San Francisco, CA, USA",
  "417 Mission St, San Francisco, CA, USA",
  "4170 Lindell Blvd, St. Louis, MO, USA",
  "417 N 8th St, Lehighton, PA, USA",
  "4175 Veterans Memorial Hwy, Ronkonkoma, NY, USA",
].map((description, i) => ({ place_id: `place-${i}`, description }));

type Story = StoryObj<typeof ComboBox<Fruit>>;

const Template = (args: Partial<ComboBoxProps<Fruit>>) => (
  <ComboBox label="Fruit" defaultItems={fruits} {...args}>
    {(item) => <ComboBox.Option id={item.id}>{item.name}</ComboBox.Option>}
  </ComboBox>
);

const meta: Meta<typeof ComboBox<Fruit>> = {
  title: "Components/ComboBox",
  component: ComboBox,
  decorators: [InputDecorator],
};

export default meta;

export const Standard: Story = {
  render: Template.bind({}),
  args: {
    placeholder: "Search fruit",
    helperText: "Type to filter",
  },
};

export const CustomValue: Story = {
  render: Template.bind({}),
  args: {
    allowsCustomValue: true,
    placeholder: "Pick or type a fruit",
    helperText: "Fruits not in the list are kept as typed",
  },
};

export const Sizes: Story = {
  render: () => (
    <VerticalStack gap="2">
      <Template size="sm" label="Small" placeholder="Search fruit" />
      <Template size="md" label="Medium" placeholder="Search fruit" />
      <Template size="lg" label="Large" placeholder="Search fruit" />
    </VerticalStack>
  ),
};

export const Invalid: Story = {
  render: Template.bind({}),
  args: {
    isRequired: true,
    validationState: "invalid",
    errorText: "Choose a fruit",
  },
};

export const Disabled: Story = {
  render: Template.bind({}),
  args: {
    isDisabled: true,
    defaultInputValue: "Apple",
  },
};

/**
 * Suggestions fetched as the user types, with free text kept as the value and
 * an attribution footer—the shape of a Google Places address field.
 */
export const AsyncWithFooter: Story = {
  render: () => <AddressField />,
};

function AddressField() {
  const [street, setStreet] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<Prediction | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const onInputChange = (value: string) => {
    setStreet(value);
    clearTimeout(timeoutRef.current);
    if (value.length < 4) {
      setPredictions([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    timeoutRef.current = setTimeout(() => {
      setPredictions(
        addresses.filter((a) =>
          a.description.toLowerCase().startsWith(value.toLowerCase()),
        ),
      );
      setIsLoading(false);
    }, 600);
  };

  return (
    <VerticalStack gap="2">
      <ComboBox
        label="Street address"
        placeholder="Start typing an address, e.g. 417"
        iconAtStart={LocationOnIcon}
        allowsCustomValue
        inputValue={street}
        onInputChange={onInputChange}
        items={predictions}
        isLoading={isLoading}
        onSelectionChange={(key) =>
          setSelected(predictions.find((p) => p.place_id === key) ?? null)
        }
        footer={<ComboBox.FooterText>Powered by Google</ComboBox.FooterText>}
      >
        {(item) => (
          <ComboBox.Option id={item.place_id}>
            {item.description}
          </ComboBox.Option>
        )}
      </ComboBox>
      <span>
        Selected place: <code>{selected?.place_id ?? "none"}</code>
      </span>
    </VerticalStack>
  );
}
