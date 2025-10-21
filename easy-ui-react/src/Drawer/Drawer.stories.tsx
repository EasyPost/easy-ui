import { action } from "storybook/actions";
import { Meta, StoryObj } from "@storybook/react-vite";
import React, { Key, useState } from "react";
import { Button } from "../Button";
import { PlaceholderBox } from "../utilities/storybook";
import { Drawer, DrawerContainer, useDrawerTrigger } from "./Drawer";
import { DrawerTrigger } from "./DrawerTrigger";
import { Menu } from "../Menu";
import { DropdownButton } from "../DropdownButton";
import { VerticalStack } from "../VerticalStack";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { Badge } from "../Badge";
import { TabPanels } from "../TabPanels";

type DrawerStory = StoryObj<typeof Drawer>;
type DrawerTriggerStory = StoryObj<typeof DrawerTrigger>;

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  parameters: {
    controls: {
      exclude: ["children"],
    },
  },
};

export default meta;

export const Standalone: DrawerStory = {
  render: () => (
    <Drawer.Trigger onOpenChange={action("Drawer open state changed!")}>
      <Button>Open drawer</Button>
      <Drawer>
        <Drawer.Body>
          <Drawer.StandaloneContentArea>
            <VerticalStack gap="2">
              <HorizontalStack align="space-between" blockAlign="center">
                <Drawer.Title>Drawer Title</Drawer.Title>
                <Drawer.CloseButton />
              </HorizontalStack>
              <PlaceholderBox width="100%">Drawer Content</PlaceholderBox>
            </VerticalStack>
          </Drawer.StandaloneContentArea>
        </Drawer.Body>
      </Drawer>
    </Drawer.Trigger>
  ),
};

export const BannerAndTabs: DrawerStory = {
  render: () => (
    <Drawer.Trigger onOpenChange={action("Drawer open state changed!")}>
      <Button>Open drawer</Button>
      <TabPanels>
        <Drawer>
          <Drawer.Header>
            <Drawer.Banner>
              <VerticalStack gap="2">
                <HorizontalStack align="space-between" blockAlign="center">
                  <Text variant="subtitle1">Subtitle:</Text>
                  <Drawer.CloseButton />
                </HorizontalStack>
                <HorizontalStack align="space-between" blockAlign="center">
                  <Drawer.Title weight="normal">Drawer Title</Drawer.Title>
                  <Badge variant="danger">Status</Badge>
                </HorizontalStack>
              </VerticalStack>
            </Drawer.Banner>
            <TabPanels.Tabs>
              <TabPanels.Item key="for">Tab 1</TabPanels.Item>
              <TabPanels.Item key="mar">Tab 2</TabPanels.Item>
            </TabPanels.Tabs>
          </Drawer.Header>
          <Drawer.Body>
            <Drawer.BanneredContentArea>
              <TabPanels.Panels>
                <TabPanels.Item key="for">
                  <div>
                    <PlaceholderBox width="100%">Tab 1 Content</PlaceholderBox>
                  </div>
                </TabPanels.Item>
                <TabPanels.Item key="mar">
                  <div>
                    <PlaceholderBox width="100%">Tab 2 Content</PlaceholderBox>
                  </div>
                </TabPanels.Item>
              </TabPanels.Panels>
            </Drawer.BanneredContentArea>
          </Drawer.Body>
        </Drawer>
      </TabPanels>
    </Drawer.Trigger>
  ),
};

export const Nondismissable: DrawerTriggerStory = {
  render: (args) => (
    <Drawer.Trigger isDismissable={args.isDismissable}>
      <Button>Open drawer</Button>
      {(close) => (
        <Drawer>
          <Drawer.Body>
            <Drawer.StandaloneContentArea>
              <VerticalStack gap="2">
                <HorizontalStack align="space-between" blockAlign="center">
                  <Drawer.Title>Drawer Title</Drawer.Title>
                  <Drawer.CloseButton />
                </HorizontalStack>
                <PlaceholderBox width="100%">Drawer Content</PlaceholderBox>
                <Button onPress={() => close()}>Close Drawer</Button>
              </VerticalStack>
            </Drawer.StandaloneContentArea>
          </Drawer.Body>
        </Drawer>
      )}
    </Drawer.Trigger>
  ),
  args: {
    isDismissable: false,
  },
  parameters: {
    controls: { include: ["isDismissable"] },
  },
};

export const DefaultOpen: DrawerTriggerStory = {
  render: (args) => (
    <Drawer.Trigger {...args} onOpenChange={action("Open state changed!")}>
      <Button>Open drawer</Button>
      <Drawer>
        <Drawer.Body>
          <Drawer.StandaloneContentArea>
            <VerticalStack gap="2">
              <HorizontalStack align="space-between" blockAlign="center">
                <Drawer.Title>Drawer Title</Drawer.Title>
                <Drawer.CloseButton />
              </HorizontalStack>
              <PlaceholderBox width="100%">Drawer Content</PlaceholderBox>
            </VerticalStack>
          </Drawer.StandaloneContentArea>
        </Drawer.Body>
      </Drawer>
    </Drawer.Trigger>
  ),
  args: {
    defaultOpen: false,
  },
  parameters: {
    controls: { include: ["defaultOpen"] },
  },
};

export const Controlled: DrawerTriggerStory = {
  render: (args) => (
    <Drawer.Trigger {...args} onOpenChange={action("Open state changed!")}>
      <Button>Open drawer</Button>
      <Drawer>
        <Drawer.Body>
          <Drawer.StandaloneContentArea>
            <VerticalStack gap="2">
              <HorizontalStack align="space-between" blockAlign="center">
                <Drawer.Title>Drawer Title</Drawer.Title>
                <Drawer.CloseButton />
              </HorizontalStack>
              <PlaceholderBox width="100%">Drawer Content</PlaceholderBox>
            </VerticalStack>
          </Drawer.StandaloneContentArea>
        </Drawer.Body>
      </Drawer>
    </Drawer.Trigger>
  ),
  args: {
    isOpen: false,
  },
  parameters: {
    controls: { include: ["isOpen"] },
  },
};

export const MenuTrigger: DrawerTriggerStory = {
  render: () => {
    const [drawer, setDrawer] = useState<Key | null>(null);
    return (
      <>
        <Menu>
          <Menu.Trigger>
            <DropdownButton>Account actions</DropdownButton>
          </Menu.Trigger>
          <Menu.Overlay onAction={(key) => setDrawer(key)}>
            <Menu.Item key="manage">Manage Account</Menu.Item>
            <Menu.Item key="delete">Delete Account</Menu.Item>
          </Menu.Overlay>
        </Menu>
        <DrawerContainer
          onDismiss={() => {
            setDrawer(null);
          }}
        >
          {drawer === "manage" && <ManageAccountDrawer title="Manage" />}
          {drawer === "delete" && <ManageAccountDrawer title="Delete" />}
        </DrawerContainer>
      </>
    );
  },
};

function ManageAccountDrawer({ title }: { title: string }) {
  const drawerTriggerState = useDrawerTrigger();
  return (
    <Drawer>
      <Drawer.Body>
        <Drawer.StandaloneContentArea>
          <VerticalStack gap="2">
            <HorizontalStack align="space-between" blockAlign="center">
              <Drawer.Title>{`${title} Account`}</Drawer.Title>
              <Drawer.CloseButton />
            </HorizontalStack>
            <PlaceholderBox width="100%">Drawer Content</PlaceholderBox>
            <Button onPress={() => drawerTriggerState.close()}>
              Close Drawer
            </Button>
          </VerticalStack>
        </Drawer.StandaloneContentArea>
      </Drawer.Body>
    </Drawer>
  );
}
