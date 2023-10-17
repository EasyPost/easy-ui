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
          renderLogo={() => <Logo />}
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
            renderLogo={() => <Logo />}
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

function Logo() {
  return (
    <svg
      width="22"
      height="24"
      viewBox="0 0 22 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9158 14.2855C10.7292 14.2855 10.5882 14.2624 10.4254 14.1717L5.4579 11.3744V13.8305L10.4254 16.6298C10.5882 16.7204 10.7292 16.7435 10.9158 16.7435C11.0806 16.7435 11.2672 16.6972 11.4082 16.6298L21.8336 10.7594V13.2175L11.4082 19.0627C11.2672 19.1533 11.1044 19.1996 10.9158 19.1996C10.753 19.1996 10.5882 19.1533 10.4254 19.0627L5.4579 16.2885V18.7215L10.4254 21.5208C10.5882 21.6114 10.753 21.6345 10.9158 21.6345C11.1044 21.6345 11.291 21.5882 11.4082 21.5208L21.8336 15.6735V17.2197C21.8336 17.7672 21.5298 18.2897 21.0374 18.5634L11.712 23.7956C11.4797 23.9306 11.1977 24 10.9158 24C10.6359 24 10.3778 23.9306 10.1197 23.7956L0.796153 18.5634C0.30377 18.2897 0 17.7672 0 17.2197V6.77837C0 6.20965 0.30377 5.6872 0.796153 5.41345L10.1197 0.204353C10.3778 0.0694027 10.6359 0 10.9158 0C11.1977 0 11.4797 0.0694027 11.712 0.204353L21.0374 5.41345C21.5298 5.6872 21.8336 6.20965 21.8336 6.77837V8.32645L11.4082 14.1717C11.2672 14.2411 11.0806 14.2855 10.9158 14.2855Z"
        fill="#164DFF"
      />
    </svg>
  );
}
