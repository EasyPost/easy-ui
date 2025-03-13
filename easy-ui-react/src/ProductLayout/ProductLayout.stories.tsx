import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import startCase from "lodash/startCase";
import React, { useState } from "react";
import { TabNav } from "../TabNav";
import {
  EasyPostLogo,
  FakeClientSideRouterLink,
  FakeSidebarNav,
  helpMenuItems,
} from "../utilities/storybook";
import { ProductLayout } from "./ProductLayout";

type Story = StoryObj<typeof ProductLayout>;

const meta: Meta<typeof ProductLayout> = {
  title: "Components/ProductLayout/ProductLayout",
  component: ProductLayout,
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
          renderSmallScreenLogo={() => <EasyPostLogo />}
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
            renderSmallScreenLogo={() => <EasyPostLogo />}
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
