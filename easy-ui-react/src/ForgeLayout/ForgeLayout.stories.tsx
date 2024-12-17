import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { action } from "@storybook/addon-actions";
import AlarmIcon from "@easypost/easy-ui-icons/Alarm";
import SupportIcon from "@easypost/easy-ui-icons/Support";
import SettingsIcon from "@easypost/easy-ui-icons/Settings";
import { ForgeLayout } from "./ForgeLayout";
import { Menu } from "../Menu";

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

function Icon() {
  return <div />;
}

export const StandardContent: Story = {
  render: () => (
    <ForgeLayout mode="test" menuState="expanded">
      <ForgeLayout.Menu>
        <ForgeLayout.MenuLink href="/1" iconSymbol={Icon}>
          Item 1
        </ForgeLayout.MenuLink>
        <ForgeLayout.MenuSection title={<>Title</>}>
          <ForgeLayout.MenuLink href="/2" iconSymbol={Icon}>
            Item 2
          </ForgeLayout.MenuLink>
          <ForgeLayout.MenuLink href="/3" iconSymbol={Icon}>
            Item 3
          </ForgeLayout.MenuLink>
        </ForgeLayout.MenuSection>
        <ForgeLayout.MenuSection title={<>Title</>}>
          <ForgeLayout.MenuLink href="/4" iconSymbol={Icon}>
            Item 4
          </ForgeLayout.MenuLink>
          <ForgeLayout.MenuLink href="/5" iconSymbol={Icon}>
            Item 5
          </ForgeLayout.MenuLink>
        </ForgeLayout.MenuSection>
      </ForgeLayout.Menu>
      <ForgeLayout.Header>
        <ForgeLayout.Controls visibleWhenMenuStateIs="collapsed">
          <ForgeLayout.BreadrumbsNavigation>
            <ForgeLayout.BackButton onClick={() => {}}>
              Back
            </ForgeLayout.BackButton>
            <ForgeLayout.Breadrumbs>
              <ForgeLayout.Breadrumb>Breadcrumb</ForgeLayout.Breadrumb>
              <ForgeLayout.Breadrumb>Breadcrumb</ForgeLayout.Breadrumb>
            </ForgeLayout.Breadrumbs>
          </ForgeLayout.BreadrumbsNavigation>
        </ForgeLayout.Controls>
        <ForgeLayout.Controls visibleWhenMenuStateIs="expanded">
          <ForgeLayout.ModeSwitcher onModeChange={action("Mode changed!")} />
          <ForgeLayout.Search value={"search"} onChange={() => {}} />
        </ForgeLayout.Controls>
        <ForgeLayout.Actions>
          <ForgeLayout.MenuAction
            accessibilityLabel="Action 1"
            iconSymbol={AlarmIcon}
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
            iconSymbol={SettingsIcon}
          />
        </ForgeLayout.Actions>
      </ForgeLayout.Header>
      <ForgeLayout.Content>Page Content</ForgeLayout.Content>
    </ForgeLayout>
  ),
};
