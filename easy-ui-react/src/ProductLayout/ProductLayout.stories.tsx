import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import startCase from "lodash/startCase";
import React, { useState } from "react";
import { Menu } from "../Menu";
import { TabNav } from "../TabNav";
import {
  EasyPostLogoMark,
  FakeClientSideRouterLink,
  FakeSidebarNav,
} from "../utilities/storybook";
import { ProductLayout } from "./ProductLayout";

type Story = StoryObj<typeof ProductLayout>;

const meta: Meta<typeof ProductLayout> = {
  title: "Components/ProductLayout",
  component: ProductLayout,
  decorators: [
    (Story) => (
      <div className="story-with-product-layout">
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const EmptyContent: Story = {
  render: () => (
    <ProductLayout
      sidebar={
        <ProductLayout.Sidebar>
          <FakeSidebarNav />
        </ProductLayout.Sidebar>
      }
      header={
        <ProductLayout.Header
          title={<>Account Settings</>}
          helpMenuItems={helpMenuItems()}
          primaryAction={{
            content: "Buy a Label",
            onAction: action("buy a label"),
          }}
          secondaryAction={{
            content: "Buy a Label with CSV",
            onAction: action("buy a label with csv"),
          }}
          renderSmallScreenLogo={() => <EasyPostLogoMark />}
        />
      }
      content={
        <ProductLayout.Content>
          <div style={{ height: 400 }}></div>
        </ProductLayout.Content>
      }
    />
  ),
};

export const TabbedContent: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [page, setPage] = useState("1");
    return (
      <ProductLayout
        sidebar={
          <ProductLayout.Sidebar>
            <FakeSidebarNav />
          </ProductLayout.Sidebar>
        }
        header={
          <ProductLayout.Header
            title={<>Account Settings</>}
            helpMenuItems={helpMenuItems()}
            primaryAction={{
              content: "Buy a Label",
              onAction: action("buy a label"),
            }}
            secondaryAction={{
              content: "Buy a Label with CSV",
              onAction: action("buy a label with csv"),
            }}
            renderSmallScreenLogo={() => <EasyPostLogoMark />}
          />
        }
        content={
          <ProductLayout.TabbedContent
            tabs={[
              <TabNav.Item
                key="1"
                as={FakeClientSideRouterLink}
                isCurrentPage={page === "1"}
                onClick={() => setPage("1")}
              >
                Tab 1
              </TabNav.Item>,
              <TabNav.Item
                key="2"
                as={FakeClientSideRouterLink}
                isCurrentPage={page === "2"}
                onClick={() => setPage("2")}
              >
                Tab 2
              </TabNav.Item>,
              <TabNav.Item
                key="3"
                as={FakeClientSideRouterLink}
                isCurrentPage={page === "3"}
                onClick={() => setPage("3")}
              >
                Tab 3
              </TabNav.Item>,
              <TabNav.Item
                key="4"
                as={FakeClientSideRouterLink}
                isCurrentPage={page === "4"}
                onClick={() => setPage("4")}
              >
                Tab 4
              </TabNav.Item>,
            ]}
          >
            <div style={{ marginTop: 24, padding: "0 16px" }}>
              {startCase(page)}
            </div>
          </ProductLayout.TabbedContent>
        }
      />
    );
  },
};

function helpMenuItems() {
  return [
    <Menu.Item
      key="1"
      href="https://www.easypost.com/docs/api"
      target="_blank"
      rel="noopener"
    >
      Documentation
    </Menu.Item>,
    <Menu.Item
      key="2"
      href="https://support.easypost.com/hc/en-us"
      target="_blank"
      rel="noopener"
    >
      Support
    </Menu.Item>,
    <Menu.Item
      key="3"
      href="https://www.easypost.com/getting-started"
      target="_blank"
      rel="noopener"
    >
      Guides
    </Menu.Item>,
  ];
}
