import AlarmIcon from "@easypost/easy-ui-icons/Alarm";
import InfoIcon from "@easypost/easy-ui-icons/Info";
import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import SettingsIcon from "@easypost/easy-ui-icons/Settings";
import StorefrontIcon from "@easypost/easy-ui-icons/Storefront";
import SupportIcon from "@easypost/easy-ui-icons/Support";
import TimelineIcon from "@easypost/easy-ui-icons/Timeline";
import VerifiedUserIcon from "@easypost/easy-ui-icons/VerifiedUser";
import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
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

export const StandardContent: Story = {
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
            accessibilityLabel="Action 1"
            iconSymbol={AlarmIcon}
            renderBadge={() => <NexusLayout.ActionBadge />}
          >
            <Menu.Overlay onAction={action("Menu item clicked!")}>
              <Menu.Item>Action 1:1</Menu.Item>
              <Menu.Item>Action 1:2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.MenuAction
            accessibilityLabel="Action 2"
            iconSymbol={SupportIcon}
          >
            <Menu.Overlay onAction={action("Menu item clicked!")}>
              <Menu.Item>Action 1:1</Menu.Item>
              <Menu.Item>Action 1:2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.LinkAction
            href="/4"
            accessibilityLabel="Action 3"
            iconSymbol={SettingsIcon}
          />
        </NexusLayout.Actions>
      </NexusLayout.Header>
      <NexusLayout.Content>
        <div
          style={{
            height: 400,
            background: "white",
            borderRadius: 8,
          }}
        />
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
            accessibilityLabel="Action 1"
            iconSymbol={AlarmIcon}
            renderBadge={() => <NexusLayout.ActionBadge />}
          >
            <Menu.Overlay onAction={action("Menu item clicked!")}>
              <Menu.Item>Action 1:1</Menu.Item>
              <Menu.Item>Action 1:2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.MenuAction
            accessibilityLabel="Action 2"
            iconSymbol={SupportIcon}
          >
            <Menu.Overlay onAction={action("Menu item clicked!")}>
              <Menu.Item>Action 1:1</Menu.Item>
              <Menu.Item>Action 1:2</Menu.Item>
            </Menu.Overlay>
          </NexusLayout.MenuAction>
          <NexusLayout.LinkAction
            href="/4"
            accessibilityLabel="Action 3"
            iconSymbol={SettingsIcon}
          />
        </NexusLayout.Actions>
      </NexusLayout.Header>
      <NexusLayout.Content>
        <NexusLayout.MultipageContainer>
          <NexusLayout.MultipageSidebar>
            <NexusLayout.MultipageSidebarNav
              selectedHref="/1"
              title={<>Multipage Title</>}
            >
              <NexusLayout.MultipageSidebarNavSection
                title={<>Multipage Nav Section</>}
              >
                <NexusLayout.MultipageSidebarNavLink
                  href="/1"
                  iconSymbol={InfoIcon}
                >
                  Multipage Nav Link 1
                </NexusLayout.MultipageSidebarNavLink>
                <NexusLayout.MultipageSidebarNavLink
                  href="/2"
                  iconSymbol={VerifiedUserIcon}
                >
                  Multipage Nav Link 2
                </NexusLayout.MultipageSidebarNavLink>
              </NexusLayout.MultipageSidebarNavSection>
            </NexusLayout.MultipageSidebarNav>
          </NexusLayout.MultipageSidebar>
          <NexusLayout.MultipageContent>
            <NexusLayout.MultipageHeader>
              <NexusLayout.MultipageTitle>
                Multipage Nav Title
              </NexusLayout.MultipageTitle>
              <HorizontalStack gap="1">
                <Button size="sm" variant="outlined" color="secondary">
                  Action 1
                </Button>
                <Button size="sm" color="secondary">
                  Action 2
                </Button>
              </HorizontalStack>
            </NexusLayout.MultipageHeader>
            <div style={{ height: 400 }}></div>
          </NexusLayout.MultipageContent>
        </NexusLayout.MultipageContainer>
      </NexusLayout.Content>
    </NexusLayout>
  ),
};
