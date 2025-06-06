import DoorOpenIcon from "@easypost/easy-ui-icons/DoorOpen";
import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import SettingsIcon from "@easypost/easy-ui-icons/Settings";
import AccountBalanceWallet from "@easypost/easy-ui-icons/AccountBalanceWallet";
import ApartmentIcon from "@easypost/easy-ui-icons/Apartment";
import TerminalIcon from "@easypost/easy-ui-icons/Terminal";
import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Text } from "../Text";
import { Button } from "../Button";
import { Menu } from "../Menu";
import { StripeLogo, UPSLogoImg, PlaceholderBox } from "../utilities/storybook";
import { HostedUILayout } from "../HostedUILayout";
import { MultipageSection } from "./MultipageSection";

type Story = StoryObj<typeof MultipageSection>;

const meta: Meta<typeof MultipageSection> = {
  title: "Components/ProductLayout/MultipageSection",
  component: MultipageSection,
  decorators: [
    (Story) => (
      <div className="full-screen-story product-layout-story">
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Standard: Story = {
  render: () => (
    <MultipageSection>
      <MultipageSection.Container>
        <MultipageSection.BrandHeader>
          <MultipageSection.BrandHeaderLogo>
            <UPSLogoImg alt="ups" />
          </MultipageSection.BrandHeaderLogo>
          <MultipageSection.BrandHeaderTitle>
            Brand Title
          </MultipageSection.BrandHeaderTitle>
        </MultipageSection.BrandHeader>
        <MultipageSection.SplitContainer>
          <MultipageSection.Sidebar>
            <MultipageSection.SidebarNav selectedHref="/1">
              <MultipageSection.SidebarNavLink
                href="/1"
                iconSymbol={AccountBalanceWallet}
              >
                Wallet
              </MultipageSection.SidebarNavLink>
              <MultipageSection.SidebarNavLink
                href="/2"
                iconSymbol={LocalShippingIcon}
              >
                Carriers
              </MultipageSection.SidebarNavLink>
              <MultipageSection.SidebarNavSection title="Sub Account Management">
                <MultipageSection.SidebarNavLink
                  href="/3"
                  iconSymbol={ApartmentIcon}
                >
                  Sub Account Details
                </MultipageSection.SidebarNavLink>
                <MultipageSection.SidebarNavLink
                  href="/4"
                  iconSymbol={TerminalIcon}
                >
                  API Keys and Webhooks
                </MultipageSection.SidebarNavLink>
              </MultipageSection.SidebarNavSection>
            </MultipageSection.SidebarNav>
          </MultipageSection.Sidebar>
          <MultipageSection.Content>
            <MultipageSection.ContentHeader>
              <MultipageSection.ContentTitle titleIcon={AccountBalanceWallet}>
                Wallet Settings
              </MultipageSection.ContentTitle>

              <Button size="sm" variant="outlined">
                Edit Account Settings
              </Button>
            </MultipageSection.ContentHeader>
            <div style={{ height: 400, position: "relative" }}>
              <Text variant="body2">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Expedita maiores dolor numquam harum cum repellat nisi
                doloremque porro rerum blanditiis necessitatibus, assumenda
                suscipit. Molestias itaque incidunt officiis voluptas, quidem
                quisquam.
              </Text>
              <PlaceholderBox />
            </div>
          </MultipageSection.Content>
        </MultipageSection.SplitContainer>
      </MultipageSection.Container>
    </MultipageSection>
  ),
};

export const Layout: Story = {
  render: () => (
    <HostedUILayout>
      <HostedUILayout.Header>
        <HostedUILayout.LogoContainer>
          <HostedUILayout.Logo>
            <StripeLogo />
          </HostedUILayout.Logo>
        </HostedUILayout.LogoContainer>
        <HostedUILayout.Actions>
          <HostedUILayout.MenuAction
            accessibilityLabel="Action 1"
            iconSymbol={SettingsIcon}
            renderBadge={() => <HostedUILayout.ActionBadge />}
          >
            <Menu.Overlay onAction={action("Menu item clicked!")}>
              <Menu.Item>Action 1:1</Menu.Item>
              <Menu.Item>Action 1:2</Menu.Item>
            </Menu.Overlay>
          </HostedUILayout.MenuAction>
          <HostedUILayout.ButtonAction
            accessibilityLabel="Action 2"
            iconSymbol={DoorOpenIcon}
            onPress={action("Button clicked!")}
          />
        </HostedUILayout.Actions>
      </HostedUILayout.Header>
      <HostedUILayout.Content>
        <MultipageSection>
          <MultipageSection.Container>
            <MultipageSection.BrandHeader>
              <MultipageSection.BrandHeaderLogo>
                <UPSLogoImg />
              </MultipageSection.BrandHeaderLogo>
              <MultipageSection.BrandHeaderTitle>
                Brand Title
              </MultipageSection.BrandHeaderTitle>
            </MultipageSection.BrandHeader>
            <MultipageSection.SplitContainer>
              <MultipageSection.Sidebar>
                <MultipageSection.SidebarNav selectedHref="/1">
                  <MultipageSection.SidebarNavLink
                    href="/1"
                    iconSymbol={AccountBalanceWallet}
                  >
                    Wallet
                  </MultipageSection.SidebarNavLink>
                  <MultipageSection.SidebarNavLink
                    href="/2"
                    iconSymbol={LocalShippingIcon}
                  >
                    Carriers
                  </MultipageSection.SidebarNavLink>
                </MultipageSection.SidebarNav>
              </MultipageSection.Sidebar>
              <MultipageSection.Content>
                <MultipageSection.ContentHeader>
                  <MultipageSection.ContentTitle
                    titleIcon={AccountBalanceWallet}
                  >
                    Wallet Settings
                  </MultipageSection.ContentTitle>

                  <Button size="sm" variant="outlined">
                    Edit Account Settings
                  </Button>
                </MultipageSection.ContentHeader>
                <div style={{ height: 400, position: "relative" }}>
                  <Text variant="body2">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Expedita maiores dolor numquam harum cum repellat nisi
                    doloremque porro rerum blanditiis necessitatibus, assumenda
                    suscipit. Molestias itaque incidunt officiis voluptas,
                    quidem quisquam.
                  </Text>
                  <PlaceholderBox />
                </div>
              </MultipageSection.Content>
            </MultipageSection.SplitContainer>
          </MultipageSection.Container>
        </MultipageSection>
      </HostedUILayout.Content>
    </HostedUILayout>
  ),
};
