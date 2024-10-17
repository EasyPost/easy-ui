import AlarmIcon from "@easypost/easy-ui-icons/Alarm";
import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import SettingsIcon from "@easypost/easy-ui-icons/Settings";
import StorefrontIcon from "@easypost/easy-ui-icons/Storefront";
import SupportIcon from "@easypost/easy-ui-icons/Support";
import TimelineIcon from "@easypost/easy-ui-icons/Timeline";
import VerifiedUserIcon from "@easypost/easy-ui-icons/VerifiedUser";
import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import tokens from "../../../easy-ui-tokens/dist/js/tokens";
import { Button } from "../Button";
import { HorizontalStack } from "../HorizontalStack";
import { Menu } from "../Menu";
import { NexusLayout } from "./NexusLayout";

type Story = StoryObj<typeof NexusLayout>;

const meta: Meta<typeof NexusLayout> = {
  title: "Components/ProductLayout/NexusLayout",
  component: NexusLayout,
  decorators: [
    (Story) => (
      <div className="full-screen-story product-layout-story">
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const EmptyContent: Story = {
  render: () => (
    <NexusLayout>
      <NexusLayout.Header>
        <NexusLayout.Nav selectedHref="/1">
          <NexusLayout.NavLink href="/1" iconSymbol={StorefrontIcon}>
            Order Fulfillment
          </NexusLayout.NavLink>
          <NexusLayout.NavLink href="/2" iconSymbol={VerifiedUserIcon}>
            Post Delivery
          </NexusLayout.NavLink>
          <NexusLayout.NavLink href="/3" iconSymbol={LocalShippingIcon}>
            Shipping
          </NexusLayout.NavLink>
          <NexusLayout.NavLink href="/4" iconSymbol={TimelineIcon}>
            Analytics
          </NexusLayout.NavLink>
        </NexusLayout.Nav>
        <NexusLayout.Actions>
          <NexusLayout.MenuAction
            accessibilityLabel="Test"
            iconSymbol={AlarmIcon}
            renderBadge={() => (
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: tokens["theme.light.color.positive.500"],
                  borderRadius: "100%",
                }}
              ></div>
            )}
          >
            <Menu.Overlay onAction={action("Menu item clicked!")}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.MenuAction
            accessibilityLabel="Test"
            iconSymbol={SupportIcon}
          >
            <Menu.Overlay onAction={action("Menu item clicked!")}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.MenuAction
            accessibilityLabel="Test"
            iconSymbol={SettingsIcon}
          >
            <Menu.Overlay onAction={action("Menu item clicked!")}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
        </NexusLayout.Actions>
      </NexusLayout.Header>
      <NexusLayout.Content>
        <div
          style={{ height: 400, background: "white", borderRadius: 8 }}
        ></div>
      </NexusLayout.Content>
    </NexusLayout>
  ),
};

export const MultipageContent: Story = {
  render: () => (
    <NexusLayout>
      <NexusLayout.Header>
        <NexusLayout.Nav selectedHref="/1">
          <NexusLayout.NavLink href="/1" iconSymbol={StorefrontIcon}>
            Order Fulfillment
          </NexusLayout.NavLink>
          <NexusLayout.NavLink href="/2" iconSymbol={VerifiedUserIcon}>
            Post Delivery
          </NexusLayout.NavLink>
          <NexusLayout.NavLink href="/3" iconSymbol={LocalShippingIcon}>
            Shipping
          </NexusLayout.NavLink>
          <NexusLayout.NavLink href="/4" iconSymbol={TimelineIcon}>
            Analytics
          </NexusLayout.NavLink>
        </NexusLayout.Nav>
        <NexusLayout.Actions>
          <NexusLayout.MenuAction
            accessibilityLabel="Test"
            iconSymbol={AlarmIcon}
            renderBadge={() => (
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: tokens["theme.light.color.positive.500"],
                  borderRadius: "100%",
                }}
              ></div>
            )}
          >
            <Menu.Overlay onAction={action("Menu item clicked!")}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.MenuAction
            accessibilityLabel="Test"
            iconSymbol={SupportIcon}
          >
            <Menu.Overlay onAction={action("Menu item clicked!")}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.MenuAction
            accessibilityLabel="Test"
            iconSymbol={SettingsIcon}
          >
            <Menu.Overlay onAction={action("Menu item clicked!")}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
        </NexusLayout.Actions>
      </NexusLayout.Header>
      <NexusLayout.Content>
        <NexusLayout.MultipageContainer>
          <NexusLayout.MultipageSidebar>
            <NexusLayout.MultipageSidebarNav
              selectedHref="/1"
              title={<>Settings</>}
            >
              <NexusLayout.MultipageSidebarNavSection
                title={<>General Account Settings</>}
              >
                <NexusLayout.MultipageSidebarNavLink
                  href="/1"
                  iconSymbol={VerifiedUserIcon}
                >
                  Username and Password
                </NexusLayout.MultipageSidebarNavLink>
                <NexusLayout.MultipageSidebarNavLink
                  href="/2"
                  iconSymbol={VerifiedUserIcon}
                >
                  Username and Password
                </NexusLayout.MultipageSidebarNavLink>
              </NexusLayout.MultipageSidebarNavSection>
            </NexusLayout.MultipageSidebarNav>
          </NexusLayout.MultipageSidebar>
          <NexusLayout.MultipageContent>
            <NexusLayout.MultipageHeader>
              <NexusLayout.MultipageTitle>
                Username and Password
              </NexusLayout.MultipageTitle>
              <HorizontalStack gap="1">
                <Button size="sm" variant="outlined">
                  Contact Sales
                </Button>
                <Button size="sm">Manage Subscription</Button>
              </HorizontalStack>
            </NexusLayout.MultipageHeader>
            <div style={{ height: 400, background: "#f3f3f3" }}></div>
          </NexusLayout.MultipageContent>
        </NexusLayout.MultipageContainer>
      </NexusLayout.Content>
    </NexusLayout>
  ),
};
