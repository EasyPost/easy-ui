import { action } from "storybook/actions";
import { Meta, StoryObj } from "@storybook/react-vite";
import React, { Key, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
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

export const WithCustomThirdPartyModalFixed: ModalStory = {
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
            Same custom (non-native) third-party modal as the previous story,
            but its overlay is marked with `data-react-aria-top-layer`. Tabbing
            and clicking into its inputs now works — Easy UI no longer steals
            focus back.
          </PlaceholderBox>
          <CustomThirdPartyModal topLayer />
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
          "The fix for the previous story. The custom overlay is marked with " +
          "`data-react-aria-top-layer`, the escape hatch react-aria's " +
          "`FocusScope` checks to always allow focus to move into an element. " +
          "With it, the underlying Easy UI Modal's focus containment leaves the " +
          "third-party modal's inputs alone.",
      },
    },
  },
};

export const WithIframeThirdPartyModal: ModalStory = {
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
            Faithful repro of the real Stripe Link/autofill bug. This overlay is
            a cross-origin iframe portaled to `document.body` while the Easy UI
            modal is open. Opening it triggers Easy UI&apos;s `ariaHideOutside`
            (from `useModalOverlay`), which sets `inert` on everything outside
            the modal — including this overlay. `inert` blurs the iframe, and
            the modal&apos;s focus containment then pulls focus back. Watch the
            status line under the button: it reports `inert=true` and the
            iframe&apos;s field can&apos;t be used. This is the actual
            mechanism; the FocusScope `data-react-aria-top-layer` check is a red
            herring.
          </PlaceholderBox>
          <IframeThirdPartyModal attr="none" />
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
          "Faithful repro of the real cause: Easy UI's `ariaHideOutside` (via " +
          "`useModalOverlay`) sets `inert` on third-party overlays injected into " +
          "`document.body` after the modal opens. `inert` blurs the iframe, then " +
          "focus containment restores focus to the Easy UI modal. The status " +
          "line surfaces the live `inert`/`aria-hidden` state so the mechanism " +
          "is visible without devtools. See the Fixed story for the remedy.",
      },
    },
  },
};

export const WithIframeThirdPartyModalFixed: ModalStory = {
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
            The fix: `data-react-aria-top-layer=&quot;true&quot;` is set on the{" "}
            <strong>portal root</strong> — the node appended to `document.body`,
            which is exactly the node Easy UI&apos;s `ariaHideOutside` observer
            evaluates. With it, the overlay is kept visible (never `inert`), so
            the iframe holds focus. The status line reports `inert=false` and
            the field is usable. In a real app you can&apos;t edit Stripe&apos;s
            injected node, so the equivalent remedy is `keepVisible()` from
            `@react-aria/overlays` (or an Easy UI Modal opt-out).
          </PlaceholderBox>
          <IframeThirdPartyModal attr="root" />
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
          "Remedy: tagging the portal root (the node added to `document.body`) " +
          'with `data-react-aria-top-layer="true"` makes `ariaHideOutside` keep ' +
          "the overlay visible, so it is never `inert`'d and the iframe keeps " +
          "focus. In a real third-party integration where you can't tag the " +
          "injected node, use `keepVisible()` from `@react-aria/overlays`.",
      },
    },
  },
};

/**
 * Iframe-based stand-in for Stripe Link/autofill. To mirror Stripe faithfully
 * the iframe is CROSS-ORIGIN: it loads a `data:` URL, which the browser gives
 * an opaque origin, so the host page cannot reach into `contentDocument` (just
 * like a real Stripe frame). The iframe focuses its own first field via an
 * inline script on load, since the parent can't do it across the origin
 * boundary.
 *
 * The real bug is NOT the FocusScope top-layer check — it's `ariaHideOutside`
 * (pulled in by Easy UI's Modal via `useModalOverlay`). When this overlay is
 * portaled into `document.body` while the modal is open, `ariaHideOutside`'s
 * MutationObserver sets `inert` on it. `inert` blurs the iframe, and the
 * modal's focus containment then restores focus into the Easy UI modal.
 *
 * `attr` controls the fix:
 * - "none": nothing tagged → `ariaHideOutside` inerts the overlay → broken.
 * - "root": `data-react-aria-top-layer="true"` on the PORTAL ROOT (the node
 *   appended to `document.body`, which is what the observer evaluates) → the
 *   overlay is kept visible → the iframe keeps focus.
 *
 * The status readout polls whether the iframe is currently inside an `inert` or
 * `aria-hidden` subtree, making the mechanism visible without devtools.
 */
function IframeThirdPartyModal({ attr }: { attr: "none" | "root" }) {
  const [isOpen, setIsOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setStatus(null);
      return;
    }
    let raf = 0;
    const tick = () => {
      const f = iframeRef.current;
      if (f) {
        const inert = Boolean(f.closest("[inert]"));
        const hidden = Boolean(f.closest('[aria-hidden="true"]'));
        setStatus(
          inert || hidden
            ? `BROKEN — Easy UI hid the overlay (inert=${inert}, aria-hidden=${hidden}); the iframe can't hold focus.`
            : "OK — overlay is visible and interactive.",
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  // Cross-origin document (opaque origin via data: URL). The inline script
  // focuses the first field on load because the parent cannot reach in.
  const html = `<!DOCTYPE html><html><body style="margin:0;font-family:sans-serif">
    <h2 style="margin:0 0 12px">Third-party modal (cross-origin iframe)</h2>
    <form style="display:flex;flex-direction:column;gap:12px">
      <label style="display:flex;flex-direction:column;gap:4px">Name
        <input id="name" type="text" placeholder="Enter your name" />
      </label>
      <label style="display:flex;flex-direction:column;gap:4px">Email
        <input type="email" placeholder="Enter your email" />
      </label>
    </form>
    <script>window.addEventListener("load",function(){document.getElementById("name").focus();});<\/script>
  </body></html>`;
  const src = `data:text/html,${encodeURIComponent(html)}`;

  return (
    <>
      <Button variant="outlined" onPress={() => setIsOpen(true)}>
        Open iframe third-party modal
      </Button>
      {status && <p style={{ marginTop: 8, fontSize: 12 }}>{status}</p>}
      {isOpen &&
        ReactDOM.createPortal(
          <div
            // PORTAL ROOT — the node React appends to document.body, and the node
            // Easy UI's `ariaHideOutside` observer evaluates. Tagging it with
            // data-react-aria-top-layer="true" keeps the overlay visible;
            // without the tag the overlay (and its iframe) get inert'd.
            data-react-aria-top-layer={attr === "root" ? "true" : undefined}
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
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <iframe
                ref={iframeRef}
                title="Third-party modal"
                src={src}
                style={{ width: 360, height: 240, border: "none" }}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

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
 *
 * Pass `topLayer` to mark the overlay with `data-react-aria-top-layer`, which
 * tells react-aria's `FocusScope` to always allow focus to move into this
 * element — the supported escape hatch for third-party overlays, and the fix
 * for the focus-stealing bug.
 */
function CustomThirdPartyModal({ topLayer = false }: { topLayer?: boolean }) {
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
            data-react-aria-top-layer={topLayer ? "true" : undefined}
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

type StripeStory = StoryObj<{ publishableKey: string }>;

/**
 * Embeds the real Stripe `CardElement` inside an Easy UI `Modal`, mirroring
 * easypost-web-app's `stripe_card_modal.jsx`. This loads real Stripe.js, which
 * injects the actual Stripe Elements + Link / autofill iframes — so it can
 * reproduce the real focus-stealing bug (Easy UI's `ariaHideOutside` inerts the
 * injected Link overlay, blurring it and bouncing focus back into the modal).
 *
 * Paste a test publishable key (`pk_test_...`) into the `publishableKey`
 * control, then open the modal and trigger Link/autofill (focus the card field
 * as a returning Link user, or use the Link button in the field). Watch the
 * status line: when the Link overlay opens, its frame shows `inert`/aria-hidden
 * and can't be typed into.
 */
export const WithStripeCardElement: StripeStory = {
  render: (args) => (
    <StripeCardElementStory publishableKey={args.publishableKey} />
  ),
  args: {
    publishableKey: "pk_p59fpoe9eLIPbPIVoJPhOkN1EGB1q",
  },
  argTypes: {
    publishableKey: {
      control: "text",
      description: "Stripe test publishable key (pk_test_...)",
    },
  },
  parameters: {
    controls: { include: ["publishableKey"] },
    docs: {
      description: {
        story:
          "Real Stripe CardElement inside an Easy UI Modal (mirrors EPWA's " +
          "stripe_card_modal.jsx). Provide a `pk_test_...` key via the " +
          "publishableKey control, then trigger Stripe Link/autofill to " +
          "reproduce the focus steal. The status line surfaces whether the " +
          "Stripe/Link frames have been `inert`'d by react-aria.",
      },
    },
  },
};

function StripeCardElementStory({
  publishableKey,
}: {
  publishableKey: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Memoize so we create one Stripe instance per key, not per render.
  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey],
  );

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Open modal</Button>
      <ModalContainer onDismiss={() => setIsOpen(false)}>
        {isOpen &&
          (stripePromise ? (
            <Elements stripe={stripePromise}>
              <StripeCardModalContent />
            </Elements>
          ) : (
            <Modal>
              <Modal.Header>Stripe publishable key required</Modal.Header>
              <Modal.Body>
                <PlaceholderBox width="100%">
                  Paste a test publishable key (`pk_test_…`) into the
                  &quot;publishableKey&quot; control in the Controls panel, then
                  reopen this modal. The real Stripe `CardElement` will mount
                  and you can trigger Link / autofill to reproduce the focus
                  bug.
                </PlaceholderBox>
              </Modal.Body>
            </Modal>
          ))}
      </ModalContainer>
    </>
  );
}

function StripeCardModalContent() {
  const modalTriggerState = useModalTrigger();
  const [status, setStatus] = useState<string | null>(null);

  // Surface whether react-aria's `ariaHideOutside` has hidden any Stripe/Link
  // frame (the Link overlay is injected outside the modal, so it gets inert'd).
  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      const frames = Array.from(
        document.querySelectorAll<HTMLIFrameElement>(
          'iframe[name^="__privateStripe"], iframe[src*="stripe.com"]',
        ),
      );
      const inert = frames.filter((f) => f.closest("[inert]")).length;
      const hidden = frames.filter((f) =>
        f.closest('[aria-hidden="true"]'),
      ).length;
      setStatus(
        `Stripe frames: ${frames.length}, inert: ${inert}, aria-hidden: ${hidden}`,
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Modal>
      <Modal.Header
        iconAtEnd={{
          accessibilityLabel: "Stripe Logo",
          symbol: StripeLogo,
          size: "2xl",
        }}
      >
        New Credit Card Account
      </Modal.Header>
      <Modal.Body>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <CardElement options={{ hidePostalCode: true }} />
        </div>
        {status && <p style={{ marginTop: 8, fontSize: 12 }}>{status}</p>}
      </Modal.Body>
      <Modal.Footer
        primaryAction={{
          content: "Save Card",
          onAction: action("Save Card clicked!"),
        }}
        secondaryAction={{
          content: "Cancel",
          onAction: modalTriggerState.close,
        }}
      />
    </Modal>
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
