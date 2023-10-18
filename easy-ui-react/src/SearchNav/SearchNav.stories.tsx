import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import React from "react";
import Campaign from "@easypost/easy-ui-icons/Campaign";
import Help from "@easypost/easy-ui-icons/Help";
import Brightness5 from "@easypost/easy-ui-icons/Brightness5";
import { SearchNav, SearchNavProps } from "./SearchNav";
import { EasyPostFullLogo, PlaceholderBox } from "../utilities/storybook";

type Story = StoryObj<typeof SearchNav>;

const Template = (args: SearchNavProps<object>) => {
  const { children } = args;
  return (
    <SearchNav
      menuOverlayProps={{
        onAction: action("Menu item"),
        disabledKeys: ["V99.99"],
      }}
    >
      {children}
    </SearchNav>
  );
};

const meta: Meta<typeof SearchNav> = {
  title: "Components/SearchNav",
  component: SearchNav,
};

export default meta;

export const Simple: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <SearchNav.LogoGroup>
          <SearchNav.Logo>
            <EasyPostFullLogo />
          </SearchNav.Logo>
        </SearchNav.LogoGroup>
      </>
    ),
  },
};

export const Selector: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <SearchNav.LogoGroup>
          <SearchNav.Logo>
            <EasyPostFullLogo />
          </SearchNav.Logo>
          <SearchNav.Selector
            label="docs version"
            defaultSelectedKey="V1.0"
            selectedKey="V1.0"
            disabledKeys={["V99.99"]}
            onSelectionChange={action("Selected")}
          >
            <SearchNav.Option key="V1.0">V1.0</SearchNav.Option>
            <SearchNav.Option key="V1.1">V1.1</SearchNav.Option>
            <SearchNav.Option key="V99.99">V99.99</SearchNav.Option>
          </SearchNav.Selector>
        </SearchNav.LogoGroup>
      </>
    ),
  },
};

export const CTA: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <SearchNav.LogoGroup>
          <SearchNav.Logo>
            <EasyPostFullLogo />
          </SearchNav.Logo>
          <SearchNav.Selector
            label="docs version"
            defaultSelectedKey="V1.0"
            selectedKey="V1.0"
            disabledKeys={["V99.99"]}
            onSelectionChange={action("Selected")}
          >
            <SearchNav.Option key="V1.0">V1.0</SearchNav.Option>
            <SearchNav.Option key="V1.1">V1.1</SearchNav.Option>
            <SearchNav.Option key="V99.99">V99.99</SearchNav.Option>
          </SearchNav.Selector>
        </SearchNav.LogoGroup>
        <SearchNav.CTAGroup>
          <SearchNav.CTAItem
            symbol={Campaign}
            key="Campaign"
            label="Optional"
            onPress={action("pressed")}
          />
          <SearchNav.CTAItem
            symbol={Help}
            key="Help"
            label="Optional"
            onPress={action("pressed")}
          />
          <SearchNav.CTAItem
            symbol={Brightness5}
            key="Brightness"
            label="Toggle theme"
            onPress={action("pressed")}
            hideLabelOnDesktop
          />
        </SearchNav.CTAGroup>
      </>
    ),
  },
};

export const Search: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <SearchNav.LogoGroup>
          <SearchNav.Logo>
            <EasyPostFullLogo />
          </SearchNav.Logo>
          <SearchNav.Selector
            label="docs version"
            defaultSelectedKey="V1.0"
            selectedKey="V1.0"
            disabledKeys={["V99.99"]}
            onSelectionChange={action("Selected")}
          >
            <SearchNav.Option key="V1.0">V1.0</SearchNav.Option>
            <SearchNav.Option key="V1.1">V1.1</SearchNav.Option>
            <SearchNav.Option key="V99.99">V99.99</SearchNav.Option>
          </SearchNav.Selector>
        </SearchNav.LogoGroup>
        <SearchNav.Search>
          <PlaceholderBox width="100%" height={36}>
            Search Bar
          </PlaceholderBox>
        </SearchNav.Search>
      </>
    ),
  },
};

export const FullBar: Story = {
  render: Template.bind({}),
  args: {
    children: (
      <>
        <SearchNav.LogoGroup>
          <SearchNav.Logo>
            <EasyPostFullLogo />
          </SearchNav.Logo>
          <SearchNav.Selector
            label="docs version"
            defaultSelectedKey="V1.0"
            selectedKey="V1.0"
            disabledKeys={["V99.99"]}
            onSelectionChange={action("Selected")}
          >
            <SearchNav.Option key="V1.0">V1.0</SearchNav.Option>
            <SearchNav.Option key="V1.1">V1.1</SearchNav.Option>
            <SearchNav.Option key="V99.99">V99.99</SearchNav.Option>
          </SearchNav.Selector>
        </SearchNav.LogoGroup>
        <SearchNav.Search>
          <PlaceholderBox width="100%" height={36}>
            Search Bar
          </PlaceholderBox>
        </SearchNav.Search>
        <SearchNav.CTAGroup>
          <SearchNav.CTAItem
            symbol={Campaign}
            key="Campaign"
            label="Optional"
            onPress={action("pressed")}
          />
          <SearchNav.CTAItem
            symbol={Help}
            key="Help"
            label="Optional"
            onPress={action("pressed")}
          />
          <SearchNav.CTAItem
            symbol={Brightness5}
            key="Brightness"
            label="Toggle theme"
            onPress={action("pressed")}
            hideLabelOnDesktop
          />
        </SearchNav.CTAGroup>
      </>
    ),
  },
};
0;
