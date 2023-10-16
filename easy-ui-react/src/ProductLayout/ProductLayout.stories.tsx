import { Meta, StoryObj } from "@storybook/react";
import React, { ComponentProps, useState } from "react";
import startCase from "lodash/startCase";
import { TabNav } from "../TabNav";
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
          <FakeNav />
        </ProductLayout.Sidebar>
      }
      header={
        <ProductLayout.Header
          title={<>Page title</>}
          helpMenuItems={[]}
          primaryAction={{
            content: "CTA 2",
            onAction: () => {},
          }}
          secondaryAction={{
            content: "CTA 1",
            onAction: () => {},
          }}
        />
      }
      content={
        <ProductLayout.Content>
          <div></div>
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
            <FakeNav />
          </ProductLayout.Sidebar>
        }
        header={
          <ProductLayout.Header
            title={<>Page title</>}
            helpMenuItems={[]}
            primaryAction={{
              content: "CTA 2",
              onAction: () => {},
            }}
            secondaryAction={{
              content: "CTA 1",
              onAction: () => {},
            }}
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

function FakeNav() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: 24,
      }}
    >
      <div
        style={{ flex: "1", display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div style={{ height: 38, width: 165, background: "#ddd" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ height: 24, width: 120, background: "#eee" }} />
          <div style={{ height: 24, width: 140, background: "#eee" }} />
          <div style={{ height: 24, width: 130, background: "#eee" }} />
          <div style={{ height: 24, width: 150, background: "#eee" }} />
          <div style={{ height: 24, width: 110, background: "#eee" }} />
          <div style={{ height: 24, width: 150, background: "#eee" }} />
          <div style={{ height: 24, width: 120, background: "#eee" }} />
          <div style={{ height: 24, width: 130, background: "#eee" }} />
        </div>
      </div>
      <div style={{ height: 18, width: 128, background: "#eee" }} />
    </div>
  );
}

// This story uses a `button` as a link, only as an example for showing that
// the link element can be customized for custom routers like next/link.
// TabNav shouldn't use `button`s in production.
function FakeClientSideRouterLink(props: ComponentProps<"button">) {
  return <button {...props} />;
}
