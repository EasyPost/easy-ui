import AccountBalanceIcon from "@easypost/easy-ui-icons/AccountBalance";
import AccountCircleIcon from "@easypost/easy-ui-icons/AccountCircle";
import AccountTreeIcon from "@easypost/easy-ui-icons/AccountTree";
import DoorOpenIcon from "@easypost/easy-ui-icons/DoorOpen";
import GroupsIcon from "@easypost/easy-ui-icons/Groups";
import HomeIcon from "@easypost/easy-ui-icons/Home";
import KeyIcon from "@easypost/easy-ui-icons/Key";
import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import RadarIcon from "@easypost/easy-ui-icons/Radar";
import SettingsIcon from "@easypost/easy-ui-icons/Settings";
import ShieldIcon from "@easypost/easy-ui-icons/Shield";
import SupportIcon from "@easypost/easy-ui-icons/Support";
import ViewListIcon from "@easypost/easy-ui-icons/ViewList";
import WebhookIcon from "@easypost/easy-ui-icons/Webhook";
import WidgetsIcon from "@easypost/easy-ui-icons/Widgets";
import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Menu } from "../Menu";
import { ForgeLayout } from "./ForgeLayout";

type Story = StoryObj<typeof ForgeLayout>;

const meta: Meta<typeof ForgeLayout> = {
  title: "Components/ProductLayout/ForgeLayout",
  component: ForgeLayout,
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
    <ForgeLayout mode="test" navState="expanded">
      <ForgeLayout.Nav selectedHref="/1">
        <ForgeLayout.NavLink href="/1" iconSymbol={HomeIcon}>
          Dashboard
        </ForgeLayout.NavLink>
        <ForgeLayout.NavSection title={<>Management</>}>
          <ForgeLayout.NavLink href="/2" iconSymbol={ShieldIcon}>
            Insurance
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/2" iconSymbol={AccountTreeIcon}>
            Sub Accounts
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/3" iconSymbol={LocalShippingIcon}>
            Carriers
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/4" iconSymbol={AccountBalanceIcon}>
            Wallet
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/5" iconSymbol={WidgetsIcon}>
            Branding
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/6" iconSymbol={GroupsIcon}>
            Members
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/7" iconSymbol={SettingsIcon}>
            Account Settings
          </ForgeLayout.NavLink>
        </ForgeLayout.NavSection>
        <ForgeLayout.NavSection title={<>Development</>}>
          <ForgeLayout.NavLink href="/4" iconSymbol={ViewListIcon}>
            Logs
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/5" iconSymbol={KeyIcon}>
            API Keys
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/5" iconSymbol={WebhookIcon}>
            Webhooks
          </ForgeLayout.NavLink>
        </ForgeLayout.NavSection>
      </ForgeLayout.Nav>
      <ForgeLayout.Body>
        <ForgeLayout.Header>
          <ForgeLayout.Controls visibleWhenNavStateIs="collapsed">
            <div>Controls when collapsed</div>
          </ForgeLayout.Controls>
          <ForgeLayout.Controls visibleWhenNavStateIs="expanded">
            <div>Controls when expanded</div>
          </ForgeLayout.Controls>
          <ForgeLayout.Actions>
            <ForgeLayout.MenuAction
              accessibilityLabel="Action 1"
              iconSymbol={RadarIcon}
              renderBadge={() => <ForgeLayout.ActionBadge />}
            >
              <Menu.Overlay onAction={action("Menu item clicked!")}>
                <Menu.Item>Action 1:1</Menu.Item>
                <Menu.Item>Action 1:2</Menu.Item>
              </Menu.Overlay>
            </ForgeLayout.MenuAction>
            <ForgeLayout.MenuAction
              accessibilityLabel="Action 2"
              iconSymbol={SupportIcon}
            >
              <Menu.Overlay onAction={action("Menu item clicked!")}>
                <Menu.Item>Action 2:1</Menu.Item>
                <Menu.Item>Action 2:2</Menu.Item>
              </Menu.Overlay>
            </ForgeLayout.MenuAction>
            <ForgeLayout.LinkAction
              href="/4"
              accessibilityLabel="Action 3"
              iconSymbol={AccountCircleIcon}
            />
            <ForgeLayout.LinkAction
              href="/5"
              accessibilityLabel="Action 4"
              iconSymbol={DoorOpenIcon}
            />
          </ForgeLayout.Actions>
        </ForgeLayout.Header>
        <ForgeLayout.Content>
          <div style={{ height: 1000 }}>Page Content</div>
        </ForgeLayout.Content>
      </ForgeLayout.Body>
    </ForgeLayout>
  ),
};
