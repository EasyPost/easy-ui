import LocationOnIcon from "@easypost/easy-ui-icons/LocationOn";
import SearchIcon from "@easypost/easy-ui-icons/Search";
import { Meta, StoryObj } from "@storybook/react-vite";
import React, { useEffect, useRef, useState } from "react";
import { TextField } from "../TextField";
import { InputDecorator } from "../utilities/storybook";
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

type Story = StoryObj<typeof ComboBox<Fruit>>;

const Template = (args: Partial<ComboBoxProps<Fruit>>) => (
  <ComboBox defaultItems={fruits} {...args}>
    {(item) => <ComboBox.Option id={item.id}>{item.name}</ComboBox.Option>}
  </ComboBox>
);

const meta: Meta<typeof ComboBox<Fruit>> = {
  title: "Components/ComboBox",
  component: ComboBox,
  decorators: [InputDecorator],
  args: {
    label: "Label",
    placeholder: "Placeholder text",
    helperText: "Helper text",
  },
};

export default meta;

export const Standard: Story = {
  render: Template.bind({}),
};

export const Icon: Story = {
  render: Template.bind({}),
  args: {
    iconAtStart: SearchIcon,
  },
};

export const SmallComboBox: Story = {
  render: (args) => (
    <>
      <Template {...args} size="sm" />
      <Template {...args} size="sm" iconAtStart={SearchIcon} />
      <Template {...args} size="sm" isLoading />
    </>
  ),
};

export const LargeComboBox: Story = {
  render: (args) => (
    <>
      <Template {...args} size="lg" />
      <Template {...args} size="lg" iconAtStart={SearchIcon} />
      <Template {...args} size="lg" isLoading />
    </>
  ),
};

export const LabelWithEmphasis: Story = {
  render: Template.bind({}),
  args: {
    isLabelEmphasized: true,
  },
};

export const Error: Story = {
  render: Template.bind({}),
  args: {
    errorText: "Something went wrong",
    validationState: "invalid",
  },
};

export const VisuallyHiddenLabel: Story = {
  render: Template.bind({}),
  args: {
    label: null,
    "aria-label": "Label",
  },
};

/**
 * Lined up with `<TextField />`s to show the two read as one form.
 */
export const AlongsideTextField: Story = {
  render: (args) => (
    <>
      <TextField label="Text field" placeholder="Placeholder text" />
      <Template {...args} label="Combo box" helperText={undefined} />
      <TextField
        size="sm"
        label="Small text field"
        placeholder="Placeholder text"
      />
      <Template
        {...args}
        size="sm"
        label="Small combo box"
        helperText={undefined}
      />
    </>
  ),
};

export const CustomValue: Story = {
  render: Template.bind({}),
  args: {
    allowsCustomValue: true,
    helperText: "Fruits not in the list are kept as typed",
  },
};

export const WithSeparator: Story = {
  render: (args) => (
    <ComboBox {...args}>
      <ComboBox.Section aria-label="Citrus">
        <ComboBox.Option id="lemon">Lemon</ComboBox.Option>
        <ComboBox.Option id="lime">Lime</ComboBox.Option>
        <ComboBox.Option id="orange">Orange</ComboBox.Option>
      </ComboBox.Section>
      <ComboBox.Section aria-label="Berries">
        <ComboBox.Option id="blueberry">Blueberry</ComboBox.Option>
        <ComboBox.Option id="raspberry">Raspberry</ComboBox.Option>
        <ComboBox.Option id="strawberry">Strawberry</ComboBox.Option>
      </ComboBox.Section>
    </ComboBox>
  ),
};

export const DisabledOptions: Story = {
  render: Template.bind({}),
  args: {
    disabledKeys: [2, 4],
  },
};

export const DisabledComboBox: Story = {
  render: Template.bind({}),
  args: {
    isDisabled: true,
    defaultInputValue: "Apple",
  },
};

export const WithSecondaryText: Story = {
  render: (args) => (
    <ComboBox {...args} label="Rate adjustment">
      <ComboBox.Option
        id="standard"
        textValue="Standard Adjustment"
        description="One Rate Adjustment criteria is followed and added to all qualifying shipments"
      >
        Standard Adjustment
      </ComboBox.Option>
      <ComboBox.Option
        id="cumulative"
        textValue="Cumulative Adjustment"
        description="Multiple Rate Adjustments are added together to create one total rate markup amount"
      >
        Cumulative Adjustment
      </ComboBox.Option>
      <ComboBox.Option
        id="hierarchical"
        textValue="Hierarchical Adjustment"
        description="One Rate Adjustment will be added based on a priority order of possible Rate Adjustments"
      >
        Hierarchical Adjustment
      </ComboBox.Option>
    </ComboBox>
  ),
};

type Prediction = {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
};

const addresses: Prediction[] = [
  ["417 Montgomery St", "San Francisco, CA, USA"],
  ["417 Market St", "San Francisco, CA, USA"],
  ["417 Mission St", "San Francisco, CA, USA"],
  ["4170 Lindell Blvd", "St. Louis, MO, USA"],
  ["417 N 8th St", "Lehighton, PA, USA"],
  ["4175 Veterans Memorial Hwy", "Ronkonkoma, NY, USA"],
].map(([main_text, secondary_text], i) => ({
  place_id: `place-${i}`,
  description: `${main_text}, ${secondary_text}`,
  main_text,
  secondary_text,
}));

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
    <ComboBox
      label="Street address"
      placeholder="Start typing an address, e.g. 417"
      helperText="Choose a suggestion to fill in the rest of the address"
      iconAtStart={LocationOnIcon}
      allowsCustomValue
      inputValue={street}
      onInputChange={onInputChange}
      items={predictions}
      isLoading={isLoading}
      footer="Powered by Google"
    >
      {(item) => (
        <ComboBox.Option
          id={item.place_id}
          textValue={item.main_text}
          description={item.secondary_text}
        >
          {item.main_text}
        </ComboBox.Option>
      )}
    </ComboBox>
  );
}
