import LocationOnIcon from "@easypost/easy-ui-icons/LocationOn";
import SearchIcon from "@easypost/easy-ui-icons/Search";
import { Meta, StoryObj } from "@storybook/react-vite";
import React, { useEffect, useRef, useState } from "react";
import { Key } from "react-aria-components";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { TextField } from "../TextField";
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

export const HiddenDropdownButton: Story = {
  render: Template.bind({}),
  args: {
    hideDropdownButton: true,
    helperText: "Type to see suggestions",
  },
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
      hideDropdownButton
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

// Real-world examples, with realistic labels, error text, and data.

const countries = [
  ["AF", "Afghanistan"],
  ["AX", "Aland Islands"],
  ["AL", "Albania"],
  ["AU", "Australia"],
  ["AT", "Austria"],
  ["BS", "Bahamas"],
  ["BQ", "Bonaire, Sint Eustatius and Saba"],
  ["BA", "Bosnia and Herzegovina"],
  ["CA", "Canada"],
  ["CN", "China"],
  ["FR", "France"],
  ["DE", "Germany"],
  ["IN", "India"],
  ["IE", "Ireland"],
  ["JP", "Japan"],
  ["MX", "Mexico"],
  ["NL", "Netherlands"],
  ["NZ", "New Zealand"],
  ["ES", "Spain"],
  ["GB", "United Kingdom"],
  ["US", "United States"],
].map(([code, name]) => ({ code, name }));

/**
 * An address form's Country/Region field: a long, fixed list, required, with
 * its error shown once the field is left empty.
 */
export const ShipToCountry: Story = {
  render: () => {
    const [selectedKey, setSelectedKey] = useState<Key | null>(null);
    const [isTouched, setIsTouched] = useState(false);
    return (
      <ComboBox
        label="Country/Region"
        isLabelEmphasized
        isRequired
        placeholder="Select country"
        defaultItems={countries}
        selectedKey={selectedKey}
        onSelectionChange={setSelectedKey}
        onBlur={() => setIsTouched(true)}
        validationState={isTouched && !selectedKey ? "invalid" : "valid"}
        errorText="Field is required"
      >
        {(item) => (
          <ComboBox.Option id={item.code}>{item.name}</ComboBox.Option>
        )}
      </ComboBox>
    );
  },
};

const usStates = [
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["DC", "District of Columbia"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["NY", "New York"],
  ["PA", "Pennsylvania"],
  ["TX", "Texas"],
  ["WA", "Washington"],
].map(([code, name]) => ({ code, name }));

/**
 * An address's state field: a list of US states, with `allowsCustomValue` so
 * other countries can type a province or region.
 */
export const StateOrProvince: Story = {
  render: () => {
    const [selectedKey, setSelectedKey] = useState<Key | null>(null);
    const [inputValue, setInputValue] = useState("");
    return (
      <VerticalStack gap="1">
        <ComboBox
          label="State / Province"
          placeholder="State / Province"
          helperText="Pick a US state, or type a province or region"
          allowsCustomValue
          defaultItems={usStates}
          // Selection is left uncontrolled, so React Aria fills the input
          // with a picked state's name. Controlling `selectedKey` too would
          // leave that to `onSelectionChange`.
          onSelectionChange={setSelectedKey}
          inputValue={inputValue}
          onInputChange={setInputValue}
        >
          {(item) => (
            <ComboBox.Option id={item.code}>{item.name}</ComboBox.Option>
          )}
        </ComboBox>
        <Text variant="caption" color="neutral.600">
          Saved as: {String(selectedKey ?? inputValue) || "—"}
        </Text>
      </VerticalStack>
    );
  },
};

type CarrierService = {
  carrier: string;
  carrier_account_id: string;
  service: string;
  human_readable: string;
  account_description: string;
};

const shippingServices: CarrierService[] = [
  [
    "FedEx",
    "ca_fedex_main",
    "FEDEX_GROUND",
    "FedEx Ground",
    "FedEx Main Account",
  ],
  [
    "FedEx",
    "ca_fedex_returns",
    "FEDEX_GROUND",
    "FedEx Ground",
    "FedEx Returns Account",
  ],
  [
    "FedEx",
    "ca_fedex_main",
    "FEDEX_2_DAY",
    "FedEx 2Day®",
    "FedEx Main Account",
  ],
  ["UPS", "ca_ups_main", "Ground", "UPS® Ground", "UPS Main Account"],
  ["UPS", "ca_ups_main", "2ndDayAir", "UPS 2nd Day Air", "UPS Main Account"],
  ["USPS", "ca_usps_main", "GroundAdvantage", "USPS Ground Advantage®", "USPS"],
  ["USPS", "ca_usps_main", "Priority", "Priority Mail®", "USPS"],
  ["USPS", "ca_usps_main", "First", "First-Class Mail®", "USPS"],
].map(
  ([
    carrier,
    carrier_account_id,
    service,
    human_readable,
    account_description,
  ]) => ({
    carrier,
    carrier_account_id,
    service,
    human_readable,
    account_description,
  }),
);

/** Stands in for a request that fetches the list once. */
function useShippingServices() {
  const [data, setData] = useState<CarrierService[] | null>(null);
  useEffect(() => {
    const timeout = setTimeout(() => setData(shippingServices), 1000);
    return () => clearTimeout(timeout);
  }, []);
  return { services: data ?? [], isLoading: data === null };
}

/**
 * Assigning a shipping service to orders. The services are fetched once and filtered as the user types, so they're passed
 * as `defaultItems`. Service waits on a carrier, and a carrier with two
 * accounts names the account under each service.
 */
export const CarrierAndService: Story = {
  render: () => {
    const { services, isLoading } = useShippingServices();
    const [carrier, setCarrier] = useState<Key | null>(null);
    const carriers = [...new Set(services.map((s) => s.carrier))].map(
      (name) => ({ name }),
    );
    const carrierServices = services.filter((s) => s.carrier === carrier);
    const hasManyAccounts =
      new Set(carrierServices.map((s) => s.carrier_account_id)).size > 1;
    return (
      <>
        <ComboBox
          label="Carrier"
          isRequired
          placeholder="Select Carrier"
          defaultItems={carriers}
          isLoading={isLoading}
          selectedKey={carrier}
          onSelectionChange={setCarrier}
        >
          {(item) => (
            <ComboBox.Option id={item.name}>{item.name}</ComboBox.Option>
          )}
        </ComboBox>
        <ComboBox
          // A new carrier starts its service over.
          key={String(carrier)}
          label="Service"
          isRequired
          placeholder="Select Service"
          isDisabled={!carrier}
          defaultItems={carrierServices}
        >
          {(item) => (
            <ComboBox.Option
              id={`${item.carrier_account_id}:${item.service}`}
              description={
                hasManyAccounts ? item.account_description : undefined
              }
            >
              {item.human_readable}
            </ComboBox.Option>
          )}
        </ComboBox>
      </>
    );
  },
};

/**
 * A shipping service picker in an orders table row: small, labeled by its
 * column, with rate rules set apart from carrier services.
 */
export const TableCell: Story = {
  render: () => (
    <HorizontalStack gap="2" blockAlign="center" wrap={false}>
      <Text variant="body2">#1042</Text>
      <div style={{ flex: 1 }}>
        <ComboBox
          aria-label="Shipment"
          size="sm"
          placeholder="Select shipping service"
        >
          <ComboBox.Section aria-label="Rate rules">
            <ComboBox.Option id="cheapest">Cheapest Available</ComboBox.Option>
            <ComboBox.Option id="fastest">Fastest Available</ComboBox.Option>
          </ComboBox.Section>
          <ComboBox.Section aria-label="Carrier services">
            <ComboBox.Option id="fedex-ground">FedEx Ground</ComboBox.Option>
            <ComboBox.Option id="ups-ground">UPS® Ground</ComboBox.Option>
            <ComboBox.Option id="ups-2day">UPS 2nd Day Air</ComboBox.Option>
            <ComboBox.Option id="usps-ga">
              USPS Ground Advantage®
            </ComboBox.Option>
            <ComboBox.Option id="usps-priority">Priority Mail®</ComboBox.Option>
          </ComboBox.Section>
        </ComboBox>
      </div>
    </HorizontalStack>
  ),
};

const savedPackages = [
  ["Small Box", "12 x 10 x 4 | 0.5 lb"],
  ["Light Box", "10 x 8 x 2 | 0.25 lb"],
  ["Medium Box", "16 x 12 x 8 | 1 lb"],
  ["Poly Mailer", "14 x 10 x 1 | 0.1 lb"],
  ["Large Box", "24 x 18 x 12 | 2 lb"],
];

/**
 * Picking a package for an order: the account's saved packages, each with its dimensions and weight, under a pinned Custom Package.
 */
export const PackagePreset: Story = {
  render: () => (
    <ComboBox label="Package" isRequired placeholder="Select">
      <ComboBox.Section aria-label="Custom">
        <ComboBox.Option id="custom" description="Enter dimensions and weight">
          Custom Package
        </ComboBox.Option>
      </ComboBox.Section>
      <ComboBox.Section aria-label="Saved packages">
        {savedPackages.map(([name, dimensions]) => (
          <ComboBox.Option key={name} id={name} description={dimensions}>
            {name}
          </ComboBox.Option>
        ))}
      </ComboBox.Section>
    </ComboBox>
  ),
};
