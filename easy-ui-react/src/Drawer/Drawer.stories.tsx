import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
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

export const Simple: DrawerStory = {
  render: () => (
    <Drawer.Trigger onOpenChange={action("Modal open state changed!")}>
      <Button>Open drawer</Button>
      <Drawer>
        <Drawer.StandaloneBody>
          <PlaceholderBox width="100%" height={1200}>
            Space for content
          </PlaceholderBox>
        </Drawer.StandaloneBody>
      </Drawer>
    </Drawer.Trigger>
  ),
};

export const Complete: DrawerStory = {
  render: () => (
    <Drawer.Trigger onOpenChange={action("Modal open state changed!")}>
      <Button>Open drawer</Button>
      {() => (
        <TabPanels>
          <Drawer>
            <Drawer.Header>
              <Drawer.Banner>
                <VerticalStack gap="2">
                  <HorizontalStack align="space-between" blockAlign="center">
                    <Text variant="subtitle1">Viewing Order for:</Text>
                    <Drawer.CloseButton />
                  </HorizontalStack>
                  <HorizontalStack align="space-between" blockAlign="center">
                    <Drawer.Title variant="heading3" weight="normal">
                      Eric Fink
                    </Drawer.Title>
                    <Badge variant="danger">Needs Fulfillment</Badge>
                  </HorizontalStack>
                </VerticalStack>
              </Drawer.Banner>
              <TabPanels.Tabs>
                <TabPanels.Item key="for">Order Details</TabPanels.Item>
                <TabPanels.Item key="mar">Shipping</TabPanels.Item>
              </TabPanels.Tabs>
            </Drawer.Header>
            <Drawer.BannerBody>
              <TabPanels.Panels>
                <TabPanels.Item key="for">
                  <div>
                    <PlaceholderBox width="100%" height={800}>
                      Order Details
                    </PlaceholderBox>
                  </div>
                </TabPanels.Item>
                <TabPanels.Item key="mar">
                  <div>
                    <PlaceholderBox width="100%" height={200}>
                      Shipping
                    </PlaceholderBox>
                  </div>
                </TabPanels.Item>
              </TabPanels.Panels>
            </Drawer.BannerBody>
          </Drawer>
        </TabPanels>
      )}
    </Drawer.Trigger>
  ),
};

export const Nondismissable: DrawerTriggerStory = {
  render: (args) => (
    <Drawer.Trigger isDismissable={args.isDismissable}>
      <Button>Open drawer</Button>
      {(close) => (
        <Drawer>
          <Drawer.StandaloneBody>
            <VerticalStack gap="2">
              <PlaceholderBox width="100%">Space for content</PlaceholderBox>
              <Button onPress={() => close()}>Close drawer</Button>
            </VerticalStack>
          </Drawer.StandaloneBody>
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

export const Controlled: DrawerTriggerStory = {
  render: (args) => (
    <Drawer.Trigger {...args} onOpenChange={action("Open state changed!")}>
      <Button>Open drawer</Button>
      <Drawer>
        <Drawer.Header>H4 Title</Drawer.Header>
        <Drawer.StandaloneBody>
          <PlaceholderBox width="100%" height={2000}>
            Space for content
          </PlaceholderBox>
        </Drawer.StandaloneBody>
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
      <Drawer.Header>{`${title} Account`}</Drawer.Header>
      <Drawer.StandaloneBody>
        <VerticalStack gap="2">
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
          <Button onPress={() => drawerTriggerState.close()}>
            Close drawer
          </Button>
        </VerticalStack>
      </Drawer.StandaloneBody>
    </Drawer>
  );
}
