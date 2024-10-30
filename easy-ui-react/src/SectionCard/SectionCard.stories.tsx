import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { InlineStoryDecorator } from "../utilities/storybook";
import { SectionCard } from "./SectionCard";
import { TabPanels } from "../TabPanels";
import { Button } from "../Button";
import { TextField } from "../TextField";
import { DataGrid } from "../DataGrid";
import SearchIcon from "@easypost/easy-ui-icons/Search";
import { TabNav } from "../TabNav";

type Story = StoryObj<typeof SectionCard>;

const meta: Meta<typeof SectionCard> = {
  title: "Components/Cards/SectionCard",
  component: SectionCard,
  decorators: [InlineStoryDecorator],
  parameters: {
    controls: {
      include: ["background"],
    },
  },
};

export default meta;

const columns = [
  { key: "name", name: "Name" },
  { key: "email", name: "Email" },
  { key: "permissions", name: "Permissions" },
  { key: "status", name: "Status" },
  { key: "lastActive", name: "Last Active" },
];

const rows = [
  {
    key: 1,
    name: "Julie Smith",
    email: "julie.smith@example.com",
    permissions: "User",
    status: "Active",
    lastActive: "2022-12-08",
  },
  {
    key: 2,
    name: "Sam Frost",
    email: "sam.frost@example.com",
    permissions: "User",
    status: "Active",
    lastActive: "2022-12-12",
  },
  {
    key: 3,
    name: "Ashley Benson",
    email: "ashley.benson@example.com",
    permissions: "Admin",
    status: "Active",
    lastActive: "2023-03-24",
  },
  {
    key: 4,
    name: "Robert Gomez",
    email: "robert.gomez@example.com",
    permissions: "User",
    status: "Inactive",
    lastActive: "2022-10-03",
  },
];

export const Default: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header>
        <SectionCard.Title>Insurance Claims</SectionCard.Title>
        <div style={{ flex: "1", maxWidth: 400 }}>
          <TextField
            size="sm"
            placeholder="Search claims"
            iconAtStart={SearchIcon}
          />
        </div>
        <Button size="sm">File Claim</Button>
      </SectionCard.Header>
      <DataGrid
        columns={columns}
        rows={rows}
        renderColumnCell={(column) => (
          <span style={{ whiteSpace: "nowrap" }}>{String(column.name)}</span>
        )}
        renderRowCell={(item) => (
          <span style={{ whiteSpace: "nowrap" }}>{String(item)}</span>
        )}
        aria-label="Example data grid"
      />
    </SectionCard>
  ),
};

export const WithTabNav: Story = {
  render: () => (
    <SectionCard.TabsContainer>
      <TabNav aria-label="Account">
        <TabNav.Item href="/settings/billing" isCurrentPage>
          Billing
        </TabNav.Item>
        <TabNav.Item href="/settings/members">Members</TabNav.Item>
        <TabNav.Item href="/settings/api-keys">API Keys</TabNav.Item>
        <TabNav.Item href="/settings/branded-tracker">
          Branded Tracker
        </TabNav.Item>
        <TabNav.Item href="/settings/shipping-settings">
          Shipping Settings
        </TabNav.Item>
      </TabNav>
      <SectionCard.Area>
        <SectionCard.Header>
          <SectionCard.Title>Insurance Claims</SectionCard.Title>
          <div style={{ flex: "1", maxWidth: 400 }}>
            <TextField
              size="sm"
              placeholder="Search claims"
              iconAtStart={SearchIcon}
            />
          </div>
          <Button size="sm">File Claim</Button>
        </SectionCard.Header>
        <DataGrid
          columns={columns}
          rows={rows}
          renderColumnCell={(column) => (
            <span style={{ whiteSpace: "nowrap" }}>{String(column.name)}</span>
          )}
          renderRowCell={(item) => (
            <span style={{ whiteSpace: "nowrap" }}>{String(item)}</span>
          )}
          aria-label="Example data grid"
        />
      </SectionCard.Area>
    </SectionCard.TabsContainer>
  ),
};

export const WithTabPanels: Story = {
  render: () => (
    <SectionCard.TabsContainer>
      <TabPanels aria-label="Insurance Options">
        <TabPanels.Tabs>
          <TabPanels.Item key="claims">Claims</TabPanels.Item>
          <TabPanels.Item key="coverage">Insurance Coverage</TabPanels.Item>
        </TabPanels.Tabs>
        <TabPanels.Panels>
          <TabPanels.Item key="claims">
            <SectionCard.Area>
              <SectionCard.Header>
                <SectionCard.Title>Insurance Claims</SectionCard.Title>
                <div style={{ flex: "1", maxWidth: 400 }}>
                  <TextField
                    size="sm"
                    placeholder="Search claims"
                    iconAtStart={SearchIcon}
                  />
                </div>
                <Button size="sm">File Claim</Button>
              </SectionCard.Header>
              <DataGrid
                columns={columns}
                rows={rows}
                renderColumnCell={(column) => (
                  <span style={{ whiteSpace: "nowrap" }}>
                    {String(column.name)}
                  </span>
                )}
                renderRowCell={(item) => (
                  <span style={{ whiteSpace: "nowrap" }}>{String(item)}</span>
                )}
                aria-label="Example data grid"
              />
            </SectionCard.Area>
          </TabPanels.Item>
          <TabPanels.Item key="coverage">
            <SectionCard.Area>
              <SectionCard.Header>
                <SectionCard.Title>Insurance Coverage</SectionCard.Title>
                <div style={{ flex: "1", maxWidth: 400 }}>
                  <TextField
                    size="sm"
                    placeholder="Search coverage"
                    iconAtStart={SearchIcon}
                  />
                </div>
                <Button size="sm">File Claim</Button>
              </SectionCard.Header>
              <DataGrid
                columns={columns}
                rows={rows}
                renderColumnCell={(column) => (
                  <span style={{ whiteSpace: "nowrap" }}>
                    {String(column.name)}
                  </span>
                )}
                renderRowCell={(item) => (
                  <span style={{ whiteSpace: "nowrap" }}>{String(item)}</span>
                )}
                aria-label="Example data grid"
              />
            </SectionCard.Area>
          </TabPanels.Item>
        </TabPanels.Panels>
      </TabPanels>
    </SectionCard.TabsContainer>
  ),
};
