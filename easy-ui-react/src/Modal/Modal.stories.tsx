import { Meta, StoryObj } from "@storybook/react-vite";
import React, { Key, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { action } from "storybook/actions";
import { Button } from "../Button";
import { DropdownButton } from "../DropdownButton";
import { HorizontalStack } from "../HorizontalStack";
import { Menu } from "../Menu";
import { Select } from "../Select";
import {
  EasyPostLogo,
  PlaceholderBox,
  StripeLogo,
} from "../utilities/storybook";
import { Modal, ModalContainer, useModalTrigger } from "./Modal";
import { ModalTrigger } from "./ModalTrigger";

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
  render: (args) => {
    const [modal1, setModal1] = useState(true);
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    const [modalThirdParty, setModalThirdParty] = useState(false);

    return (
      // `childNestingBehavior` is set only on the outermost modal; it cascades to
      // the nested modals below. Modal 2 overrides its own connection to the
      // outer modal with `selfNestingBehavior="replace"`.
      //
      // Modal 2 sets `allowsThirdPartyOverlays`; this focus-trapping outer modal
      // automatically relaxes while it's open so the third-party overlay that
      // Modal 2 injects into the body isn't inert'd or robbed of focus. Toggle
      // the `allowsThirdPartyOverlays` control off to watch that overlay lock up.
      <ModalContainer
        childNestingBehavior={args.childNestingBehavior}
        isDismissable={false}
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
                isDismissable={false}
                onDismiss={() => {
                  setModal2(false);
                }}
                allowsThirdPartyOverlays={args.allowsThirdPartyOverlays}
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
                      <Button onClick={() => setModalThirdParty(true)}>
                        Open Third-party Overlay
                      </Button>
                      {modalThirdParty && (
                        <ThirdPartyOverlaySimulator
                          onDismiss={() => {
                            setModalThirdParty(false);
                          }}
                        />
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
    childNestingBehavior: "stack",
    allowsThirdPartyOverlays: true,
  },
  argTypes: {
    childNestingBehavior: {
      control: "select",
      options: ["stack", "replace"],
    },
    allowsThirdPartyOverlays: {
      control: "boolean",
      description:
        "Set on Modal 2. When on, the outer modal relaxes its focus trap and " +
        "background hiding while Modal 2 is open, so the simulated third-party " +
        "overlay stays usable. Turn it off to watch the overlay lock up (can't " +
        "type or click).",
    },
  },
  parameters: {
    controls: { include: ["childNestingBehavior", "allowsThirdPartyOverlays"] },
  },
};

/**
 * Simulates a third-party widget (e.g. Stripe Link / autofill) that injects an
 * interactive overlay into `document.body` — outside the modal's DOM — after the
 * modal opens. A surrounding focus-trapping modal would `inert` it and steal its
 * focus; Easy UI relaxes automatically while an `allowsThirdPartyOverlays`
 * descendant is open, keeping it usable. Try typing in the field and clicking
 * the button.
 */
function ThirdPartyOverlaySimulator({ onDismiss }: { onDismiss?: () => void }) {
  // Mimics a third-party widget (e.g. Stripe Link / autofill) that injects an
  // interactive overlay into `document.body` — outside the modal — after the
  // modal opens. The modals in this story are non-dismissable so clicking here
  // doesn't close them (real third-party overlays render in iframes, whose
  // events don't reach the page; non-dismissable sidesteps that without the
  // iframe's quirks). It is NOT `data-react-aria-top-layer`, so a non-relaxed
  // modal still `inert`s it — that's the lock-up.
  const ref = useRef<HTMLDivElement>(null);

  return createPortal(
    <div
      ref={ref}
      data-testid="third-party-overlay"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        // Above the modal (`z-index.modal` is 1300) so it's visible on top, the
        // way Stripe Link renders in the browser's top layer.
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 260,
          padding: 16,
          background: "white",
          border: "2px solid #635bff",
          gap: 8,
          borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong>Simulated third-party overlay</strong>
          <button
            type="button"
            aria-label="Close overlay"
            onClick={onDismiss}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
        <small>Injected into document.body, like Stripe Link</small>
        <input aria-label="Third-party field" placeholder="Type here…" />
      </div>
    </div>,
    document.body,
  );
}

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

/**
 * When the body scrolls, the header and footer grow a shadow to separate them
 * from the scrolling content. Those shadows must paint *above* the body, which
 * is easy to get wrong—the body's content is positioned, so it can cover them.
 *
 * This story fills the body with opaque, full-bleed content and opens
 * mid-scroll, so both shadows are stuck at once and land directly over that
 * content. The shadows should read as two unbroken lines; if the body paints
 * over them, they disappear behind the gray blocks and the white `Select`.
 */
export const ScrollShadows: ModalStory = {
  render: () => (
    <Modal.Trigger defaultOpen>
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>H4 Title</Modal.Header>
        <Modal.Body>
          <PlaceholderBox width="100%" height={300}>
            Scroll up to bring the header shadow over this block
          </PlaceholderBox>
          <Select label="Select an option" placeholder="Select an option">
            <Select.Option key="option1">Option 1</Select.Option>
            <Select.Option key="option2">Option 2</Select.Option>
          </Select>
          <PlaceholderBox width="100%" height={300}>
            <ScrollIntoView />
            Both shadows should be visible over this block
          </PlaceholderBox>
          <Select label="Select an option" placeholder="Select an option">
            <Select.Option key="option1">Option 1</Select.Option>
            <Select.Option key="option2">Option 2</Select.Option>
          </Select>
          <PlaceholderBox width="100%" height={300}>
            Scroll down to bring the footer shadow over this block
          </PlaceholderBox>
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

/**
 * Scrolls its scroll container so this point sits in the middle of it, putting
 * the surrounding content under both the header and the footer.
 */
function ScrollIntoView() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "center" });
  }, []);
  return <div ref={ref} />;
}

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
