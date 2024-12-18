import InfoIcon from "@easypost/easy-ui-icons/Info";
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
        <ForgeLayout.NavLink href="/1" iconSymbol={InfoIcon}>
          Dashboard
        </ForgeLayout.NavLink>
        <ForgeLayout.NavSection title={<>Management</>}>
          <ForgeLayout.NavLink href="/2" iconSymbol={InfoIcon}>
            Sub Accounts
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/3" iconSymbol={InfoIcon}>
            Carriers
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/4" iconSymbol={InfoIcon}>
            Wallet
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/5" iconSymbol={InfoIcon}>
            Branding
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/6" iconSymbol={InfoIcon}>
            Members
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/7" iconSymbol={InfoIcon}>
            Account Settings
          </ForgeLayout.NavLink>
        </ForgeLayout.NavSection>
        <ForgeLayout.NavSection title={<>Development</>}>
          <ForgeLayout.NavLink href="/4" iconSymbol={InfoIcon}>
            Logs
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/5" iconSymbol={InfoIcon}>
            API Keys
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/5" iconSymbol={InfoIcon}>
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
              iconSymbol={InfoIcon}
              renderBadge={() => <ForgeLayout.ActionBadge />}
            >
              <Menu.Overlay onAction={action("Menu item clicked!")}>
                <Menu.Item>Action 1:1</Menu.Item>
                <Menu.Item>Action 1:2</Menu.Item>
              </Menu.Overlay>
            </ForgeLayout.MenuAction>
            <ForgeLayout.MenuAction
              accessibilityLabel="Action 2"
              iconSymbol={InfoIcon}
            >
              <Menu.Overlay onAction={action("Menu item clicked!")}>
                <Menu.Item>Action 2:1</Menu.Item>
                <Menu.Item>Action 2:2</Menu.Item>
              </Menu.Overlay>
            </ForgeLayout.MenuAction>
            <ForgeLayout.LinkAction
              href="/4"
              accessibilityLabel="Action 3"
              iconSymbol={InfoIcon}
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
