import SearchIcon from "@easypost/easy-ui-icons/Search";
import { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Button } from "../Button";
import { DataGrid } from "../DataGrid";
import { TabNav } from "../TabNav";
import { TabPanels } from "../TabPanels";
import { TextField } from "../TextField";
import { SectionCard } from "./SectionCard";

type Story = StoryObj<typeof SectionCard>;

const meta: Meta<typeof SectionCard> = {
  title: "Components/Cards/SectionCard",
  component: SectionCard,
  parameters: {
    controls: {
      include: ["background"],
    },
  },
};

export default meta;

export const Basic: Story = {
  render: () => (
    <SectionCard>
      <div>Content</div>
    </SectionCard>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <SectionCard>
      <SectionCard.Header>
        <SectionCard.Title>Section Title</SectionCard.Title>
        <SectionCard.Controls>
          <div style={{ textAlign: "center" }}>Controls</div>
        </SectionCard.Controls>
        <SectionCard.Actions>
          <Button size="sm">Action</Button>
        </SectionCard.Actions>
      </SectionCard.Header>
      <div>Content</div>
    </SectionCard>
  ),
};

export const WithTabNav: Story = {
  render: () => (
    <SectionCard.Container>
      <SectionCard.Tabs>
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
      </SectionCard.Tabs>
      <SectionCard.Area>
        <SectionCard.Header>
          <SectionCard.Title>Insurance Claims</SectionCard.Title>
          <SectionCard.Controls>
            <TextField
              aria-label="Search"
              size="sm"
              placeholder="Search claims"
              iconAtStart={SearchIcon}
            />
          </SectionCard.Controls>
          <SectionCard.Actions>
            <Button size="sm">File Claim</Button>
          </SectionCard.Actions>
        </SectionCard.Header>
        <DataGrid
          columns={getColumns()}
          rows={getRows()}
          renderColumnCell={(column) => (
            <span style={{ whiteSpace: "nowrap" }}>{String(column.name)}</span>
          )}
          renderRowCell={(item) => (
            <span style={{ whiteSpace: "nowrap" }}>{String(item)}</span>
          )}
          aria-label="Example data grid"
        />
      </SectionCard.Area>
    </SectionCard.Container>
  ),
};

export const WithTabPanels: Story = {
  render: () => (
    <SectionCard.Container>
      <TabPanels aria-label="Insurance Options">
        <SectionCard.Tabs>
          <TabPanels.Tabs>
            <TabPanels.Item key="claims">Claims</TabPanels.Item>
            <TabPanels.Item key="coverage">Insurance Coverage</TabPanels.Item>
          </TabPanels.Tabs>
        </SectionCard.Tabs>
        <TabPanels.Panels>
          <TabPanels.Item key="claims">
            <div>
              <SectionCard.Area>
                <SectionCard.Header>
                  <SectionCard.Title>Insurance Claims</SectionCard.Title>
                  <SectionCard.Controls>
                    <TextField
                      aria-label="Search"
                      size="sm"
                      placeholder="Search claims"
                      iconAtStart={SearchIcon}
                    />
                  </SectionCard.Controls>
                  <SectionCard.Actions>
                    <Button size="sm">File Claim</Button>
                  </SectionCard.Actions>
                </SectionCard.Header>
                <DataGrid
                  columns={getColumns()}
                  rows={getRows()}
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
            </div>
          </TabPanels.Item>
          <TabPanels.Item key="coverage">
            <div>
              <SectionCard.Area>
                <SectionCard.Header>
                  <SectionCard.Title>Insurance Coverage</SectionCard.Title>
                  <SectionCard.Controls>
                    <TextField
                      aria-label="Search"
                      size="sm"
                      placeholder="Search coverage"
                      iconAtStart={SearchIcon}
                    />
                  </SectionCard.Controls>
                  <SectionCard.Actions>
                    <Button size="sm">File Claim</Button>
                  </SectionCard.Actions>
                </SectionCard.Header>
                <DataGrid
                  columns={getColumns()}
                  rows={getRows()}
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
            </div>
          </TabPanels.Item>
        </TabPanels.Panels>
      </TabPanels>
    </SectionCard.Container>
  ),
};

export const WithAdjustableCardProps: Story = {
  render: () => (
    <SectionCard
      padding="4"
      borderRadius="xl"
      variant="outlined"
      boxShadow={undefined}
    >
      <SectionCard.Header>
        <SectionCard.Title>Section Title</SectionCard.Title>
        <SectionCard.Controls>
          <div style={{ textAlign: "center" }}>Controls</div>
        </SectionCard.Controls>
        <SectionCard.Actions>
          <Button size="sm">Action</Button>
        </SectionCard.Actions>
      </SectionCard.Header>
      <div>Content</div>
    </SectionCard>
  ),
};

function getColumns() {
  return [
    { key: "name", name: "Name" },
    { key: "email", name: "Email" },
    { key: "permissions", name: "Permissions" },
    { key: "status", name: "Status" },
    { key: "lastActive", name: "Last Active" },
  ];
}

function getRows() {
  return [
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
}
