import { action } from "storybook/actions";
import { Meta, StoryObj } from "@storybook/react-vite";
import React, { Key, useRef, useState } from "react";
import ReactDOM from "react-dom";
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

export const Nested: ModalTriggerStory = {
  render: () => {
    const [modal1, setModal1] = useState(true);
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    return (
      <ModalContainer
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
              <ModalContainer
                onDismiss={() => {
                  setModal2(false);
                }}
              >
                {modal2 && (
                  <Modal>
                    <Modal.Header>Modal 2</Modal.Header>
                    <Modal.Body>
                      <PlaceholderBox width="100%" height="200px">
                        Content 2
                      </PlaceholderBox>
                      {modal3 && (
                        <ModalContainer
                          onDismiss={() => {
                            setModal3(false);
                          }}
                        >
                          <Modal>
                            <Modal.Header>Modal 3</Modal.Header>
                            <Modal.Body>
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

export const WithThirdPartyModal: ModalStory = {
  render: () => (
    <Modal.Trigger
      onOpenChange={action("Modal open state changed!")}
      isDismissable={false}
    >
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>Easy UI Modal</Modal.Header>
        <Modal.Body>
          <PlaceholderBox width="100%">
            Use the button below to open a third-party modal on top of this one.
            Then try tabbing through its form fields to observe how focus
            trapping behaves when a non–Easy UI modal is layered on top.
          </PlaceholderBox>
          <ThirdPartyModal />
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
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates a third-party modal (a native `<dialog>` opened via " +
          "`showModal()`, which manages its own top-layer and focus) rendered " +
          "on top of an Easy UI Modal. Useful for testing how Easy UI's focus " +
          "trapping interacts with a third-party modal layered above it.",
      },
    },
  },
};

/**
 * A stand-in for a third-party modal that is not built with Easy UI. It uses
 * the native `<dialog>` element's `showModal()`, which renders into the
 * browser's top-layer and applies its own focus trapping — mirroring how many
 * third-party libraries behave when they open on top of our Modal.
 */
function ThirdPartyModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Button variant="outlined" onPress={() => dialogRef.current?.showModal()}>
        Open third-party modal
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby="third-party-modal-title"
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 24,
          minWidth: 320,
        }}
      >
        <form
          method="dialog"
          onSubmit={action("Third-party form submitted!")}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <h2 id="third-party-modal-title" style={{ margin: 0 }}>
            Third-party modal
          </h2>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            Name
            <input name="name" type="text" placeholder="Enter your name" />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            Email
            <input name="email" type="email" placeholder="Enter your email" />
          </label>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={() => dialogRef.current?.close()}>
              Cancel
            </button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export const WithCustomThirdPartyModal: ModalStory = {
  render: () => (
    <Modal.Trigger
      onOpenChange={action("Modal open state changed!")}
      isDismissable={true}
    >
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>Easy UI Modal</Modal.Header>
        <Modal.Body>
          <PlaceholderBox width="100%">
            Use the button below to open a custom (non-native) third-party modal
            on top of this one. Then try tabbing through its form fields, or
            clicking into an input, to observe whether the underlying Easy UI
            modal steals focus back.
          </PlaceholderBox>
          <CustomThirdPartyModal />
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
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates a custom third-party modal — a conventional " +
          "`position: fixed` overlay portaled to `document.body` with its own " +
          "JS focus management, rather than the native `<dialog>` top-layer. " +
          "Because its focusable elements live outside Easy UI's `FocusScope`, " +
          "this reproduces the reported bug where the underlying Easy UI modal " +
          "steals focus back from the third-party modal's inputs.",
      },
    },
  },
};

/**
 * A stand-in for a third-party modal that does NOT use the native `<dialog>`
 * element. Instead it follows the conventional pattern many libraries use: a
 * `position: fixed` overlay rendered through a React portal into
 * `document.body`, with focus moved to the dialog on open via a ref.
 *
 * Because the overlay is portaled outside the Easy UI Modal's DOM subtree, its
 * focusable elements fall outside react-aria's `FocusScope`. This is the case
 * that can surface the focus-stealing bug, where the underlying Easy UI modal's
 * focus containment pulls focus back out of this modal.
 */
function CustomThirdPartyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      headingRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <Button variant="outlined" onPress={() => setIsOpen(true)}>
        Open custom third-party modal
      </Button>
      {isOpen &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
            onClick={() => setIsOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="custom-third-party-modal-title"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 24,
                minWidth: 320,
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  action("Custom third-party form submitted!")();
                  setIsOpen(false);
                }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <h2
                  id="custom-third-party-modal-title"
                  ref={headingRef}
                  tabIndex={-1}
                  style={{ margin: 0 }}
                >
                  Custom third-party modal
                </h2>
                <label
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  Name
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                  />
                </label>
                <label
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  Email
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "flex-end",
                  }}
                >
                  <button type="button" onClick={() => setIsOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

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
