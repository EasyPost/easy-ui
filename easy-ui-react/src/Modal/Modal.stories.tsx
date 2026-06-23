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

type AllowsOverlaysStory = StoryObj<{ allowsThirdPartyOverlays: boolean }>;

/**
 * Dependency-free reproduction of the Stripe Link/autofill bug. A synthetic
 * third-party overlay is portaled into `document.body` (outside the modal),
 * exactly like Stripe injects its Link overlay. While the modal traps focus
 * (the default), the modal's `ariaHideOutside` marks that overlay `inert`,
 * which blurs its input and makes it unclickable — the reported lock-up.
 *
 * To mirror the exact symptom: the overlay works at first (it opens tagged with
 * `data-react-aria-top-layer`, so `ariaHideOutside` leaves it alone), then when
 * you click anywhere in it outside the input it re-mounts as a fresh, UNTAGGED
 * node — simulating the third-party widget swapping in a new frame — and that
 * new node is what `ariaHideOutside` `inert`s, locking it up.
 *
 * Toggle the `allowsThirdPartyOverlays` control on to apply the Easy UI Modal
 * fix and confirm the overlay stays usable.
 */
export const WithThirdPartyAutofillOverlay: AllowsOverlaysStory = {
  render: (args) => (
    <ThirdPartyAutofillModal
      allowsThirdPartyOverlays={args.allowsThirdPartyOverlays}
    />
  ),
  args: {
    allowsThirdPartyOverlays: false,
  },
  argTypes: {
    allowsThirdPartyOverlays: {
      control: "boolean",
      description:
        "Easy UI Modal prop: when on, the modal stops focus-trapping and " +
        "background aria-hiding, so the third-party overlay stays usable.",
    },
  },
  parameters: {
    controls: { include: ["allowsThirdPartyOverlays"] },
    docs: {
      description: {
        story:
          "Dependency-free repro of the Stripe Link lock-up. A third-party " +
          "overlay portaled into `document.body` works until you click outside " +
          "its input, at which point the modal's `ariaHideOutside` `inert`s it. " +
          "Toggle `allowsThirdPartyOverlays` to apply the fix.",
      },
    },
  },
};

function ThirdPartyAutofillModal({
  allowsThirdPartyOverlays,
}: {
  allowsThirdPartyOverlays: boolean;
}) {
  return (
    <Modal.Trigger allowsThirdPartyOverlays={allowsThirdPartyOverlays}>
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>Payment details</Modal.Header>
        <Modal.Body>
          <FakeCardField />
        </Modal.Body>
        <Modal.Footer
          primaryAction={{
            content: "Save",
            onAction: action("Save clicked!"),
          }}
        />
      </Modal>
    </Modal.Trigger>
  );
}

function FakeCardField() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: "8px 12px",
        }}
      >
        <span style={{ color: "#888", letterSpacing: 2 }}>
          •••• •••• •••• ••••
        </span>
        <button
          type="button"
          onClick={() => setIsOverlayOpen(true)}
          style={{
            border: "none",
            background: "none",
            color: "#3b5bff",
            cursor: "pointer",
          }}
        >
          Autofill
        </button>
      </div>
      <PlaceholderBox width="100%">
        Click <strong>Autofill</strong> to open a third-party overlay (portaled
        into `document.body`, like Stripe Link). Its email input focuses fine —
        then click anywhere in the overlay outside the input and it locks up
        (the modal `inert`s it). Toggle `allowsThirdPartyOverlays` to fix it.
      </PlaceholderBox>
      {isOverlayOpen && (
        <AutofillOverlay onClose={() => setIsOverlayOpen(false)} />
      )}
    </div>
  );
}

function AutofillOverlay({ onClose }: { onClose: () => void }) {
  const [locked, setLocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");

  // Focus the email field when the overlay opens (and after it re-mounts).
  React.useEffect(() => {
    inputRef.current?.focus();
  }, [locked]);

  // Surface whether the modal's `ariaHideOutside` has `inert`'d this overlay,
  // so the lock-up is visible without devtools.
  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = rootRef.current;
      if (el) {
        const isInert =
          el.hasAttribute("inert") ||
          Boolean(el.closest("[inert]")) ||
          el.getAttribute("aria-hidden") === "true";
        setStatus(
          isInert
            ? "LOCKED — overlay is inert; the input can't be focused or clicked."
            : "OK — overlay is interactive.",
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return ReactDOM.createPortal(
    <div
      // The node React appends to <body>. Re-mounting it as a fresh, UNTAGGED
      // node (via the changing key) when the user clicks outside the input
      // simulates the third-party widget swapping in a new frame — the new node
      // is what the modal's `ariaHideOutside` marks `inert`, locking it up.
      key={locked ? "locked" : "initial"}
      ref={rootRef}
      data-react-aria-top-layer={locked ? undefined : "true"}
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        onMouseDown={(e) => {
          // Keep panel clicks from dismissing via the backdrop; clicking
          // anywhere other than the input "locks up" the overlay (the bug).
          e.stopPropagation();
          if (e.target !== inputRef.current && !locked) {
            setLocked(true);
          }
        }}
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          width: 320,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Autofill with Link</h2>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 13,
          }}
        >
          Email
          <input
            ref={inputRef}
            type="email"
            placeholder="you@example.com"
            style={{ padding: 8 }}
          />
        </label>
        <p style={{ marginTop: 12, fontSize: 12, color: "#666" }}>{status}</p>
      </div>
    </div>,
    document.body,
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
