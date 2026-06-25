import { action } from "storybook/actions";
import { Meta, StoryObj } from "@storybook/react-vite";
import { CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { Key, useMemo, useState } from "react";
import { Button } from "../Button";
import {
  EasyPostLogo,
  PlaceholderBox,
  StripeLogo,
} from "../utilities/storybook";
import { Modal, ModalContainer, useModalTrigger } from "./Modal";
import { ModalTrigger } from "./ModalTrigger";
import { Menu } from "../Menu";
import { DropdownButton } from "../DropdownButton";
import { Select } from "../Select";
import { Text } from "../Text";
import { HorizontalStack } from "../HorizontalStack";

type ModalStory = StoryObj<typeof Modal>;
type ModalTriggerStory = StoryObj<typeof ModalTrigger>;

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    controls: {
      exclude: ["children"],
    },
  },
};

export default meta;

export const Simple: ModalStory = {
  render: () => (
    <Modal.Trigger onOpenChange={action("Modal open state changed!")}>
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>H4 Title</Modal.Header>
        <Modal.Body>
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
        </Modal.Body>
        <Modal.Footer
          primaryAction={{
            content: "Button 1",
            onAction: action("Button 1 clicked!"),
          }}
        />
      </Modal>
    </Modal.Trigger>
  ),
};

export const Complete: ModalStory = {
  render: () => (
    <Modal.Trigger onOpenChange={action("Modal open state changed!")}>
      <Button>Open modal</Button>
      {(close) => (
        <Modal>
          <Modal.Header
            iconAtStart={{
              accessibilityLabel: "EasyPost Logo",
              symbol: EasyPostLogo,
            }}
            iconAtEnd={{
              accessibilityLabel: "Stripe Logo",
              symbol: StripeLogo,
              size: "2xl",
            }}
            subtitle="Optional subtitle"
          >
            H4 Title
          </Modal.Header>
          <Modal.Body>
            <PlaceholderBox width="100%" height={800}>
              Space for content
            </PlaceholderBox>
          </Modal.Body>
          <Modal.Footer
            primaryAction={{
              content: "Button 1",
              onAction: () => {
                action("Button 1 clicked!")();
                close();
              },
            }}
            secondaryAction={{
              content: "Optional Button 2",
              onAction: () => {
                action("Button 2 clicked!")();
                close();
              },
            }}
          />
        </Modal>
      )}
    </Modal.Trigger>
  ),
};

export const Nondismissable: ModalTriggerStory = {
  render: (args) => (
    <Modal.Trigger isDismissable={args.isDismissable}>
      <Button>Open modal</Button>
      {(close) => (
        <Modal>
          <Modal.Header>H4 Title</Modal.Header>
          <Modal.Body>
            <PlaceholderBox width="100%">Space for content</PlaceholderBox>
          </Modal.Body>
          <Modal.Footer
            primaryAction={{
              content: "Button 1",
              onAction: () => {
                action("Button 1 clicked!");
                close();
              },
            }}
          />
        </Modal>
      )}
    </Modal.Trigger>
  ),
  args: {
    isDismissable: false,
  },
  parameters: {
    controls: { include: ["isDismissable"] },
  },
};

export const Size: ModalStory = {
  render: (args) => (
    <Modal.Trigger>
      <Button>Open modal</Button>
      <Modal size={args.size}>
        <Modal.Header>H4 Title</Modal.Header>
        <Modal.Body>
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
        </Modal.Body>
        <Modal.Footer
          primaryAction={{
            content: "Button 1",
            onAction: action("Button 1 clicked!"),
          }}
        />
      </Modal>
    </Modal.Trigger>
  ),
  args: {
    size: "sm",
  },
  parameters: {
    controls: { include: ["size"] },
  },
};

export const DefaultOpen: ModalTriggerStory = {
  render: (args) => (
    <Modal.Trigger {...args} onOpenChange={action("Open state changed!")}>
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>H4 Title</Modal.Header>
        <Modal.Body>
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
        </Modal.Body>
        <Modal.Footer
          primaryAction={{
            content: "Button 1",
            onAction: action("Button 1 clicked!"),
          }}
        />
      </Modal>
    </Modal.Trigger>
  ),
  args: {
    defaultOpen: false,
  },
  parameters: {
    controls: { include: ["defaultOpen"] },
  },
};

export const Controlled: ModalTriggerStory = {
  render: (args) => (
    <Modal.Trigger {...args} onOpenChange={action("Open state changed!")}>
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>H4 Title</Modal.Header>
        <Modal.Body>
          <PlaceholderBox width="100%">Space for content</PlaceholderBox>
        </Modal.Body>
        <Modal.Footer
          primaryAction={{
            content: "Button 1",
            onAction: action("Button 1 clicked!"),
          }}
        />
      </Modal>
    </Modal.Trigger>
  ),
  args: {
    isOpen: false,
  },
  parameters: {
    controls: { include: ["isOpen"] },
  },
};

export const MenuTrigger: ModalTriggerStory = {
  render: () => {
    const [modal, setModal] = useState<Key | null>(null);
    return (
      <>
        <Menu>
          <Menu.Trigger>
            <DropdownButton>Account actions</DropdownButton>
          </Menu.Trigger>
          <Menu.Overlay onAction={(key) => setModal(key)}>
            <Menu.Item key="manage">Manage Account</Menu.Item>
            <Menu.Item key="delete">Delete Account</Menu.Item>
          </Menu.Overlay>
        </Menu>
        <ModalContainer
          onDismiss={() => {
            setModal(null);
          }}
        >
          {modal === "manage" && <ManageAccountModel title="Manage" />}
          {modal === "delete" && <ManageAccountModel title="Delete" />}
        </ModalContainer>
      </>
    );
  },
};

type NestedModalStory = StoryObj<
  React.ComponentProps<typeof ModalTrigger> & { publishableKey: string }
>;

export const Nested: NestedModalStory = {
  render: (args) => {
    const [modal1, setModal1] = useState(true);
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);

    // Load real Stripe.js (one instance per key) so Modal 2 can mount the real
    // `CardElement` and inject Stripe's Link / autofill overlays — the
    // third-party overlays that `allowsThirdPartyOverlays` keeps usable.
    const { publishableKey } = args;
    const stripePromise = useMemo(
      () => (publishableKey ? loadStripe(publishableKey) : null),
      [publishableKey],
    );

    return (
      // `childNestingBehavior` is set only on the outermost modal; it cascades to
      // the nested modals below. Modal 2 overrides its own connection to the
      // outer modal with `selfNestingBehavior="replace"`.
      //
      // Modal 2 sets `allowsThirdPartyOverlays`; this focus-trapping outer modal
      // automatically relaxes while it's open so Modal 2's Stripe Link / autofill
      // overlay isn't inert'd or robbed of focus.
      <ModalContainer
        childNestingBehavior={args.childNestingBehavior}
        onDismiss={() => {
          setModal1(false);
        }}
      >
        {modal1 && (
          <Modal>
            <Modal.Header>Outer Modal</Modal.Header>
            <Modal.Body>
              <PlaceholderBox width="100%" height="300px">
                Space for content
              </PlaceholderBox>
              <Select label="Select an option" placeholder="Select an option">
                <Select.Option key="option1">Option 1</Select.Option>
                <Select.Option key="option2">Option 2</Select.Option>
              </Select>
              <ModalContainer
                selfNestingBehavior="replace"
                onDismiss={() => {
                  setModal2(false);
                }}
                allowsThirdPartyOverlays
              >
                {modal2 && (
                  <Modal>
                    <Modal.Header>Modal 2</Modal.Header>
                    <Modal.Body>
                      <PlaceholderBox width="100%" height="200px">
                        Content 2
                      </PlaceholderBox>
                      <Select
                        label="Select an option"
                        placeholder="Select an option"
                      >
                        <Select.Option key="option1">Option 1</Select.Option>
                        <Select.Option key="option2">Option 2</Select.Option>
                      </Select>
                      {stripePromise ? (
                        <Elements stripe={stripePromise}>
                          <div
                            style={{
                              border: "1px solid #ccc",
                              borderRadius: 8,
                              padding: 12,
                            }}
                          >
                            <CardElement options={{ hidePostalCode: true }} />
                          </div>
                        </Elements>
                      ) : (
                        <Text color="neutral.500" variant="body2">
                          Paste a Stripe test publishable key (pk_test_…) into
                          the &quot;publishableKey&quot; control, then reopen
                          this modal to mount the real Stripe CardElement and
                          trigger Link / autofill.
                        </Text>
                      )}
                      {modal3 && (
                        <ModalContainer
                          onDismiss={() => {
                            setModal3(false);
                          }}
                        >
                          <Modal>
                            <Modal.Header>Modal 3</Modal.Header>
                            <Modal.Body>
                              <Select
                                label="Select an option"
                                placeholder="Select an option"
                              >
                                <Select.Option key="option1">
                                  Option 1
                                </Select.Option>
                                <Select.Option key="option2">
                                  Option 2
                                </Select.Option>
                              </Select>
                              <PlaceholderBox width="100%" height="100px">
                                Content 3
                              </PlaceholderBox>
                            </Modal.Body>
                            <Modal.Footer
                              primaryAction={{
                                content: "Close",
                                onAction: () => {
                                  setModal3(false);
                                },
                              }}
                            />
                          </Modal>
                        </ModalContainer>
                      )}
                    </Modal.Body>
                    <Modal.Footer
                      primaryAction={{
                        content: "Open Modal 3",
                        onAction: () => {
                          setModal3(true);
                        },
                      }}
                      secondaryAction={{
                        content: "Close",
                        onAction: () => {
                          setModal2(false);
                        },
                      }}
                    />
                  </Modal>
                )}
              </ModalContainer>
            </Modal.Body>
            <Modal.Footer
              primaryAction={{
                content: "Open Modal 2",
                onAction: () => {
                  setModal2(true);
                },
              }}
              secondaryAction={{
                content: "Close",
                onAction: () => {
                  setModal1(false);
                },
              }}
            />
          </Modal>
        )}
      </ModalContainer>
    );
  },
  args: {
    childNestingBehavior: "stack-shared-backdrop",
    publishableKey: "",
  },
  argTypes: {
    childNestingBehavior: {
      control: "select",
      options: ["stack", "stack-shared-backdrop", "replace"],
    },
    publishableKey: {
      control: "text",
      description:
        "Stripe test publishable key (pk_test_…). Mounts the real Stripe " +
        "CardElement in Modal 2 so its Link / autofill third-party overlay " +
        "can be exercised against `allowsThirdPartyOverlays`.",
    },
  },
  parameters: {
    controls: { include: ["childNestingBehavior", "publishableKey"] },
  },
};

export const WithSelect: ModalStory = {
  render: () => (
    <Modal.Trigger onOpenChange={action("Modal open state changed!")}>
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>H4 Title</Modal.Header>
        <Modal.Body>
          <Select label="Select an option" placeholder="Select an option">
            <Select.Option key="option1">Option 1</Select.Option>
            <Select.Option key="option2">Option 2</Select.Option>
          </Select>
        </Modal.Body>
        <Modal.Footer
          primaryAction={{
            content: "Button 1",
            onAction: action("Button 1 clicked!"),
          }}
        />
      </Modal>
    </Modal.Trigger>
  ),
};

export const WithFooterSlot: ModalStory = {
  render: () => (
    <Modal.Trigger onOpenChange={action("Modal open state changed!")}>
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>H4 Title</Modal.Header>
        <Modal.Body>
          <Select label="Select an option" placeholder="Select an option">
            <Select.Option key="option1">Option 1</Select.Option>
            <Select.Option key="option2">Option 2</Select.Option>
          </Select>
        </Modal.Body>
        <Modal.Footer>
          <HorizontalStack gap="2" align="space-between">
            <Button variant="outlined" color="support">
              Back
            </Button>
            <HorizontalStack gap="2">
              <Button variant="outlined">Skip for now</Button>
              <Button>Continue</Button>
            </HorizontalStack>
          </HorizontalStack>
        </Modal.Footer>
      </Modal>
    </Modal.Trigger>
  ),
};

function ManageAccountModel({ title }: { title: string }) {
  const modalTriggerState = useModalTrigger();
  return (
    <Modal>
      <Modal.Header>{`${title} Account`}</Modal.Header>
      <Modal.Body>
        <PlaceholderBox width="100%">Space for content</PlaceholderBox>
      </Modal.Body>
      <Modal.Footer
        primaryAction={{
          content: "Action",
          onAction: () => {
            action("Action clicked!");
            modalTriggerState.close();
          },
        }}
      />
    </Modal>
  );
}
