import AccountBalanceIcon from "@easypost/easy-ui-icons/AccountBalance";
import AccountCircleIcon from "@easypost/easy-ui-icons/AccountCircle";
import AccountTreeIcon from "@easypost/easy-ui-icons/AccountTree";
import DoorOpenIcon from "@easypost/easy-ui-icons/DoorOpen";
import GroupsIcon from "@easypost/easy-ui-icons/Groups";
import HandshakeIcon from "@easypost/easy-ui-icons/Handshake";
import HomeIcon from "@easypost/easy-ui-icons/Home";
import KeyIcon from "@easypost/easy-ui-icons/Key";
import LocalPoliceIcon from "@easypost/easy-ui-icons/LocalPolice";
import LocalShippingIcon from "@easypost/easy-ui-icons/LocalShipping";
import RadarIcon from "@easypost/easy-ui-icons/Radar";
import SettingsIcon from "@easypost/easy-ui-icons/Settings";
import ShieldIcon from "@easypost/easy-ui-icons/Shield";
import SupportIcon from "@easypost/easy-ui-icons/Support";
import ViewListIcon from "@easypost/easy-ui-icons/ViewList";
import WebhookIcon from "@easypost/easy-ui-icons/Webhook";
import WidgetsIcon from "@easypost/easy-ui-icons/Widgets";
import { action } from "storybook/actions";
import { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { AlertBadge } from "../AlertBadge";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { HorizontalGrid } from "../HorizontalGrid";
import { HorizontalStack } from "../HorizontalStack";
import { Menu } from "../Menu";
import { Text } from "../Text";
import { VerticalStack } from "../VerticalStack";
import { ForgeLayout, ForgeLayoutProps, NavState } from "./ForgeLayout";
import { Card } from "../Card";

type Story = StoryObj<typeof ForgeLayout>;

const Template = (args: Partial<ForgeLayoutProps>) => {
  return (
    <ForgeLayout {...args}>
      <ForgeLayout.Nav selectedHref="/1">
        <ForgeLayout.NavLink href="/1" iconSymbol={HomeIcon}>
          Dashboard
        </ForgeLayout.NavLink>
        <ForgeLayout.NavSection title={<>Management</>}>
          <ForgeLayout.NavLink
            href="/2"
            iconSymbol={ShieldIcon}
            // A counted badge reads fine next to a label, but has nowhere to go
            // once the label does, so the rail trades it for a dot on the icon.
            renderBadge={({ navState }) =>
              navState === "rail" ? (
                <AlertBadge show>{null}</AlertBadge>
              ) : (
                <Badge variant="danger">3</Badge>
              )
            }
          >
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
            <ForgeLayout.BreadcrumbsNavigation>
              <ForgeLayout.BackButton onPress={action("Going back!")}>
                Back
              </ForgeLayout.BackButton>
              <ForgeLayout.Breadcrumbs>
                <ForgeLayout.Breadcrumb>Sub Account</ForgeLayout.Breadcrumb>
                <ForgeLayout.Breadcrumb>
                  Sub Account Name
                </ForgeLayout.Breadcrumb>
              </ForgeLayout.Breadcrumbs>
            </ForgeLayout.BreadcrumbsNavigation>
          </ForgeLayout.Controls>
          <ForgeLayout.Controls visibleWhenNavStateIs="expanded">
            <ForgeLayout.NavToggle onPress={action("Nav toggled!")} />
            <ForgeLayout.ModeSwitcher onModeChange={action("Mode changed!")} />
            <ForgeLayout.Search />
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
            <ForgeLayout.ButtonAction
              accessibilityLabel="Action 4"
              iconSymbol={DoorOpenIcon}
              onPress={action("Button clicked!")}
            />
          </ForgeLayout.Actions>
        </ForgeLayout.Header>
        <ForgeLayout.Content>
          <Card background="primary" boxShadow="1" variant="solid">
            <div style={{ height: 1000 }}>Page Content</div>
          </Card>
        </ForgeLayout.Content>
      </ForgeLayout.Body>
    </ForgeLayout>
  );
};

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

export const Default: Story = {
  render: Template.bind({}),
};

export const TestMode: Story = {
  render: Template.bind({}),
  args: {
    mode: "test",
  },
  parameters: {
    controls: {
      include: ["mode"],
    },
  },
};

export const Collapsed: Story = {
  render: Template.bind({}),
  args: {
    navState: "collapsed",
  },
  parameters: {
    controls: {
      include: ["navState"],
    },
  },
};

export const Rail: Story = {
  render: Template.bind({}),
  args: {
    defaultNavState: "rail",
  },
  parameters: {
    controls: {
      include: ["defaultNavState"],
    },
  },
};

type ForgeAppPageKey =
  | "dashboard"
  | "insurance"
  | "accountSettings"
  | "subAccountDetails";

type ForgeAppPage = {
  /** Label for the page switcher in this story. */
  name: string;

  /**
   * Nav state the page pins through the app's static page config. Only
   * drill-in pages set this.
   */
  navState?: NavState;

  /** Whether the page groups its header controls. */
  areControlsGrouped: boolean;

  /** Whether the page shows a product logo beside the mode switcher. */
  hasProductLogo: boolean;
};

const FORGE_APP_PAGES: Record<ForgeAppPageKey, ForgeAppPage> = {
  dashboard: {
    name: "Dashboard",
    areControlsGrouped: true,
    hasProductLogo: false,
  },
  insurance: {
    name: "Guard Insurance",
    areControlsGrouped: true,
    hasProductLogo: true,
  },
  accountSettings: {
    name: "Account Settings",
    areControlsGrouped: false,
    hasProductLogo: false,
  },
  subAccountDetails: {
    name: "Sub Account Detail",
    navState: "collapsed",
    areControlsGrouped: true,
    hasProductLogo: false,
  },
};

const FORGE_APP_PAGE_KEYS = Object.keys(FORGE_APP_PAGES) as ForgeAppPageKey[];

/**
 * Replicates the Forge app's `AuthenticatedForgeAppLayout`, including the four
 * places a rail needs care. Switch pages to see each one.
 */
const ForgeAppTemplate = (args: Partial<ForgeLayoutProps>) => {
  const [pageKey, setPageKey] = useState<ForgeAppPageKey>("dashboard");
  const [prefersRail, setPrefersRail] = useState(false);
  const page = FORGE_APP_PAGES[pageKey];

  // Gotcha 1: pages pin `navState: "collapsed"` through a static page config,
  // and that has to outrank the rail preference. Otherwise a drill-in page
  // renders as a rail and loses its breadcrumbs.
  //
  // Overcoming: resolve the two in one place, page config first.
  const navState = page.navState ?? (prefersRail ? "rail" : "expanded");

  const handleNavStateChange = (nextNavState: NavState) => {
    // The library never persists this. A real app would write to local storage
    // here, the same way it already does for mode.
    setPrefersRail(nextNavState === "rail");
    action("Nav state changed!")(nextNavState);
  };

  return (
    <ForgeLayout
      {...args}
      navState={navState}
      onNavStateChange={handleNavStateChange}
    >
      <ForgeLayout.Nav selectedHref={`/forge/${pageKey}`}>
        <ForgeLayout.NavLink href="/forge/dashboard" iconSymbol={HomeIcon}>
          Dashboard
        </ForgeLayout.NavLink>
        <ForgeLayout.NavLink
          href="/forge/referral-dashboard"
          iconSymbol={HandshakeIcon}
        >
          Referral Dashboard
        </ForgeLayout.NavLink>
        <ForgeLayout.NavSection title={<>Management</>}>
          {/*
            Gotcha 2: the app renders its alert badge inside `children`, wrapped
            in a `HorizontalStack`. A railed link hides its children, so the
            badge would disappear, and the rail tooltip would have no plain text
            to name the link with.

            Overcoming: hand the badge to `renderBadge`, which keeps it over the
            icon when railed. That leaves `children` as plain text, so the
            tooltip needs no `label`. Links whose children still render more
            than text should pass one.
          */}
          <ForgeLayout.NavLink
            href="/forge/insurance"
            iconSymbol={LocalPoliceIcon}
            renderBadge={() => <AlertBadge show>{null}</AlertBadge>}
          >
            Guard Insurance
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink
            href="/forge/sub-accounts"
            iconSymbol={AccountTreeIcon}
          >
            Sub Accounts
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/forge/reports" iconSymbol={ViewListIcon}>
            Reports
          </ForgeLayout.NavLink>
        </ForgeLayout.NavSection>
        <ForgeLayout.NavSection title={<>Development</>}>
          <ForgeLayout.NavLink href="/forge/api-keys" iconSymbol={KeyIcon}>
            API Keys
          </ForgeLayout.NavLink>
          <ForgeLayout.NavLink href="/forge/webhooks" iconSymbol={WebhookIcon}>
            Webhooks
          </ForgeLayout.NavLink>
        </ForgeLayout.NavSection>
      </ForgeLayout.Nav>
      <ForgeLayout.Body>
        {/*
          Gotcha 3: `areControlsGrouped` is false on a couple of pages, which
          drops the wrapper the controls otherwise share. The toggle has to hold
          its size either way.

          Overcoming: nothing to do in the app. `ForgeLayout.NavToggle` sets
          `flex: none`, so it keeps its footprint grouped or not. Switch to
          Account Settings to confirm.
        */}
        <ForgeLayout.Header areControlsGrouped={page.areControlsGrouped}>
          <ForgeLayout.Controls visibleWhenNavStateIs="collapsed">
            <ForgeLayout.BreadcrumbsNavigation>
              <ForgeLayout.BackButton
                onPress={() => setPageKey("subAccountDetails")}
              >
                Back
              </ForgeLayout.BackButton>
              <ForgeLayout.Breadcrumbs>
                <ForgeLayout.Breadcrumb>Sub Accounts</ForgeLayout.Breadcrumb>
                <ForgeLayout.Breadcrumb>Acme Shipping</ForgeLayout.Breadcrumb>
              </ForgeLayout.Breadcrumbs>
            </ForgeLayout.BreadcrumbsNavigation>
          </ForgeLayout.Controls>
          <ForgeLayout.Controls visibleWhenNavStateIs="expanded">
            {/*
              Gotcha 4: the app wraps these controls in a `HorizontalGrid` with
              a hardcoded `columns={2}`. Adding the toggle as a third child
              pushes the mode switcher onto a second grid row.

              Overcoming: leave the toggle outside the grid, so the grid keeps
              sizing only the controls it was written for. Widening to
              `columns={3}` works too, but then the count has to track the
              conditional logo.
            */}
            <ForgeLayout.NavToggle />
            <HorizontalGrid gap="2" columns={2} alignItems="center">
              {page.hasProductLogo && (
                <Text variant="subtitle1" color="primary.500">
                  Guard
                </Text>
              )}
              <ForgeLayout.ModeSwitcher
                onModeChange={action("Mode changed!")}
              />
            </HorizontalGrid>
          </ForgeLayout.Controls>
          <ForgeLayout.Actions>
            <ForgeLayout.LinkAction
              href="https://www.easypoststatus.com"
              target="_blank"
              accessibilityLabel="API status"
              iconSymbol={RadarIcon}
            />
            <ForgeLayout.MenuAction
              accessibilityLabel="Help"
              iconSymbol={SupportIcon}
            >
              <Menu.Overlay onAction={action("Menu item clicked!")}>
                <Menu.Item>Forge overview</Menu.Item>
                <Menu.Item>Support</Menu.Item>
              </Menu.Overlay>
            </ForgeLayout.MenuAction>
            <ForgeLayout.LinkAction
              href="/account"
              accessibilityLabel="Account"
              iconSymbol={AccountCircleIcon}
            />
          </ForgeLayout.Actions>
        </ForgeLayout.Header>
        <ForgeLayout.Content>
          <Card background="primary" boxShadow="1" variant="solid">
            <VerticalStack gap="2">
              <Text variant="heading5">{page.name}</Text>
              <Text variant="body2">
                Nav state resolves to <strong>{navState}</strong>. Page config
                pins it to{" "}
                <strong>
                  {page.navState ?? "nothing, so the preference wins"}
                </strong>
                . Controls are{" "}
                <strong>
                  {page.areControlsGrouped ? "grouped" : "ungrouped"}
                </strong>
                .
              </Text>
              <HorizontalStack gap="1" wrap>
                {FORGE_APP_PAGE_KEYS.map((key) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={key === pageKey ? "filled" : "outlined"}
                    onPress={() => setPageKey(key)}
                  >
                    {FORGE_APP_PAGES[key].name}
                  </Button>
                ))}
              </HorizontalStack>
              <div style={{ height: 600 }} />
            </VerticalStack>
          </Card>
        </ForgeLayout.Content>
      </ForgeLayout.Body>
    </ForgeLayout>
  );
};

export const ForgeApp: Story = {
  render: ForgeAppTemplate.bind({}),
  parameters: {
    controls: {
      include: ["mode"],
    },
  },
};
