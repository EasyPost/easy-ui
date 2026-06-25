import { act, screen } from "@testing-library/react";
import React, { useState } from "react";
import { vi } from "vitest";
import { Button } from "../Button";
import { HorizontalStack } from "../HorizontalStack";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
  userClick,
  userKeyboard,
} from "../utilities/test";
import { Select } from "../Select";
import { Modal, ModalContainer, ModalProps, useModalTrigger } from "./Modal";
import { ModalHeaderProps } from "./ModalHeader";
import { ModalTriggerProps } from "./ModalTrigger";

describe("<Modal />", () => {
  let restoreGetComputedStyle: () => void;
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    restoreGetComputedStyle = mockGetComputedStyle();
    restoreIntersectionObserver = mockIntersectionObserver();
  });

  afterEach(() => {
    restoreIntersectionObserver();
    restoreGetComputedStyle();
    vi.useRealTimers();
  });

  it("should render a Modal", async () => {
    const [{ user }, mocks] = renderModal({
      iconAtEnd: {
        accessibilityLabel: "Stripe Logo",
        symbol: CustomSymbol,
        size: "2xl",
      },
    });

    const openButton = screen.getByRole("button", { name: "Open modal" });
    await userClick(user, openButton);

    expect(screen.getByText("Modal content")).toBeInTheDocument();
    expect(screen.getByText("H4 Title")).toBeInTheDocument();
    expect(screen.getByText("Optional subtitle")).toBeInTheDocument();
    expect(screen.getByTitle("EasyPost Logo")).toBeInTheDocument();
    expect(screen.getByTitle("Stripe Logo")).toBeInTheDocument();

    const secondaryActionButton = screen.getByRole("button", {
      name: "Button 2",
    });
    await userClick(user, secondaryActionButton);

    expect(mocks.onSecondaryAction).toHaveBeenCalled();

    const primaryActionButton = screen.getByRole("button", {
      name: "Button 1",
    });
    await userClick(user, primaryActionButton);

    expect(mocks.onPrimaryAction).toHaveBeenCalled();
    expect(mocks.onOpenChange).toHaveBeenCalledWith(false);
  });

  it("should be dismissable by close button", async () => {
    const [{ user }] = await renderAndOpenModal();
    const closeButton = screen.getByRole("button", { name: "Close modal" });
    await userClick(user, closeButton);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should be dismissable by esc key", async () => {
    const [{ user }] = await renderAndOpenModal();
    await userKeyboard(user, "{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should support being nondismissable", async () => {
    const [{ user }] = await renderAndOpenModal({ isDismissable: false });
    expect(
      screen.queryByRole("button", { name: "Close modal" }),
    ).not.toBeInTheDocument();
    await userKeyboard(user, "{Escape}");
    expect(screen.queryByRole("dialog")).toBeInTheDocument();
  });

  it("should support custom size", async () => {
    await renderAndOpenModal({ size: "sm" });
    expect(screen.getByRole("dialog")).toHaveAttribute(
      "class",
      expect.stringContaining("sizeSm"),
    );
  });

  it("should support default open", () => {
    renderModal({ defaultOpen: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should support being controlled", () => {
    renderModal({ isOpen: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should support rendering in a container", async () => {
    function CustomModal() {
      const modalTrigger = useModalTrigger();
      return (
        <Modal>
          <Modal.Header>Header</Modal.Header>
          <Modal.Body>Content</Modal.Body>
          <Modal.Footer>
            <Button
              onPress={() => {
                modalTrigger.close();
              }}
            >
              Modal Action Button
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }

    const handleDismiss = vi.fn();
    const { user, rerender } = render(
      <ModalContainer onDismiss={handleDismiss}>
        {true ? <CustomModal /> : null}
      </ModalContainer>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userClick(
      user,
      screen.getByRole("button", { name: "Modal Action Button" }),
    );
    expect(handleDismiss).toBeCalled();

    rerender(
      <ModalContainer onDismiss={handleDismiss}>
        {false ? <CustomModal /> : null}
      </ModalContainer>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render a Modal with Footer actions", async () => {
    function ModalWithFooterActions({
      onPrimaryAction,
      onSecondaryAction,
    }: {
      onPrimaryAction: () => void;
      onSecondaryAction: () => void;
    }) {
      return (
        <Modal.Trigger>
          <Button>Open modal</Button>
          <Modal>
            <Modal.Header>Header</Modal.Header>
            <Modal.Body>Content</Modal.Body>
            <Modal.Footer
              primaryAction={{
                content: "Primary Action",
                onAction: onPrimaryAction,
              }}
              secondaryAction={{
                content: "Secondary Action",
                onAction: onSecondaryAction,
              }}
            />
          </Modal>
        </Modal.Trigger>
      );
    }

    const handlePrimaryAction = vi.fn();
    const handleSecondaryAction = vi.fn();

    const { user } = render(
      <ModalWithFooterActions
        onPrimaryAction={handlePrimaryAction}
        onSecondaryAction={handleSecondaryAction}
      />,
    );

    const openButton = screen.getByRole("button", { name: "Open modal" });
    await userClick(user, openButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userClick(
      user,
      screen.getByRole("button", { name: "Primary Action" }),
    );
    expect(handlePrimaryAction).toBeCalled();

    await userClick(
      user,
      screen.getByRole("button", { name: "Secondary Action" }),
    );
    expect(handleSecondaryAction).toBeCalled();
  });

  it("should hide outside content while open by default", () => {
    renderModalWithOutsideContent();
    expect(isElementHidden(screen.getByTestId("outside-content"))).toBe(true);
  });

  it("should not hide outside content when allowsThirdPartyOverlays is set", () => {
    renderModalWithOutsideContent({ allowsThirdPartyOverlays: true });
    expect(isElementHidden(screen.getByTestId("outside-content"))).toBe(false);
  });

  it("should keep a nested allowsThirdPartyOverlays modal interactive when opened inside a standard modal", async () => {
    const { user } = render(<NestedThirdPartyModal />);
    await userClick(user, screen.getByRole("button", { name: "Open inner" }));

    // The outer (standard) modal applies `ariaHideOutside`, which would
    // otherwise `inert` the nested third-party modal — making it unclickable
    // and causing pointer events to fall through and dismiss it.
    expect(isElementHidden(screen.getByTestId("inner-content"))).toBe(false);
    expect(
      screen.getByRole("button", { name: "Inner action" }),
    ).toBeInTheDocument();
  });

  it("should dismiss a Select on outside click within an allowsThirdPartyOverlays modal", async () => {
    const { user } = render(<ModalWithSelect />);

    await userClick(user, screen.getByRole("button", { name: /fruit/i }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // Click elsewhere inside the modal (not the listbox, not the backdrop). The
    // modal box used to be tagged `data-react-aria-top-layer`, which made
    // react-aria treat clicks inside the modal as "not outside" so the Select
    // never closed.
    await userClick(user, screen.getByTestId("modal-content"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should dismiss an allowsThirdPartyOverlays modal when interacting outside it", async () => {
    const { user } = render(
      <>
        <button data-testid="outside">Outside</button>
        <Modal.Trigger defaultOpen allowsThirdPartyOverlays>
          <Button>Open modal</Button>
          <Modal>
            <Modal.Header>Header</Modal.Header>
            <Modal.Body>Content</Modal.Body>
          </Modal>
        </Modal.Trigger>
      </>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userClick(user, screen.getByTestId("outside"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should not dismiss the outer modal when interacting with a nested modal", async () => {
    const { user } = render(<NestedDismissModals />);

    expect(screen.getByTestId("outer-content")).toBeInTheDocument();
    await userClick(user, screen.getByTestId("inner-content"));

    // Clicking inside the nested modal must not dismiss the modal beneath it.
    expect(screen.getByTestId("outer-content")).toBeInTheDocument();
    expect(screen.getByTestId("inner-content")).toBeInTheDocument();
  });

  it("should not dismiss the modal when interacting with a third-party top-layer overlay", async () => {
    const { user } = render(
      <>
        <div data-react-aria-top-layer="true">
          <button data-testid="third-party">Third-party field</button>
        </div>
        <Modal.Trigger defaultOpen allowsThirdPartyOverlays>
          <Button>Open modal</Button>
          <Modal>
            <Modal.Header>Header</Modal.Header>
            <Modal.Body>Content</Modal.Body>
          </Modal>
        </Modal.Trigger>
      </>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // react-aria ignores interact-outside on `[data-react-aria-top-layer]`, so a
    // genuine third-party overlay (e.g. Stripe) doesn't dismiss the modal.
    await userClick(user, screen.getByTestId("third-party"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not inert a node injected after a nested third-party modal opens", async () => {
    render(
      <Modal.Trigger defaultOpen>
        <Button>Open outer</Button>
        <Modal>
          <Modal.Header>Outer</Modal.Header>
          <Modal.Body>
            <Modal.Trigger defaultOpen allowsThirdPartyOverlays>
              <Button>Open inner</Button>
              <Modal>
                <Modal.Header>Inner</Modal.Header>
                <Modal.Body>Inner content</Modal.Body>
              </Modal>
            </Modal.Trigger>
          </Modal.Body>
        </Modal>
      </Modal.Trigger>,
    );

    // Simulate a third-party (e.g. Stripe Link) overlay injected into the body
    // *after* the modals open. A standard outer modal automatically stops hiding
    // the page while its `allowsThirdPartyOverlays` descendant is open, so the
    // injected overlay isn't `inert`'d/`aria-hidden` (which would lock it up).
    const injected = await injectBodyNode();
    expect(isElementHidden(injected)).toBe(false);
  });

  it("still hides outside content when no third-party descendant is open", async () => {
    render(
      <>
        <div data-testid="outside-content">Outside content</div>
        <Modal.Trigger defaultOpen>
          <Button>Open modal</Button>
          <Modal>
            <Modal.Header>Header</Modal.Header>
            <Modal.Body>Content</Modal.Body>
          </Modal>
        </Modal.Trigger>
      </>,
    );

    // With no third-party descendant open, a modal behaves exactly like a
    // standard focus-trapping modal: it hides the rest of the page.
    expect(isElementHidden(screen.getByTestId("outside-content"))).toBe(true);
  });

  it("resumes hiding the page after the nested third-party modal closes", async () => {
    const { user } = render(<ToggleableNestedThirdPartyModal />);

    await userClick(user, screen.getByRole("button", { name: "Open inner" }));
    const whileOpen = await injectBodyNode();
    expect(isElementHidden(whileOpen)).toBe(false);

    await userClick(user, screen.getByRole("button", { name: "Close inner" }));
    const afterClose = await injectBodyNode();
    // The outer modal traps again once the third-party descendant is gone.
    expect(isElementHidden(afterClose)).toBe(true);
  });
});

// Appends a node to <body> after the modals are open (mimicking a third-party
// script like Stripe) and lets react-aria's `ariaHideOutside` MutationObserver
// react before we assert.
async function injectBodyNode() {
  const node = document.createElement("div");
  await act(async () => {
    document.body.appendChild(node);
    await Promise.resolve();
  });
  return node;
}

function ToggleableNestedThirdPartyModal() {
  const [isInnerOpen, setIsInnerOpen] = useState(false);
  return (
    <Modal.Trigger defaultOpen>
      <Button>Open outer</Button>
      <Modal>
        <Modal.Header>Outer</Modal.Header>
        <Modal.Body>
          <Button onPress={() => setIsInnerOpen(true)}>Open inner</Button>
          <ModalContainer
            allowsThirdPartyOverlays
            onDismiss={() => setIsInnerOpen(false)}
          >
            {isInnerOpen && (
              <Modal>
                <Modal.Header>Inner</Modal.Header>
                <Modal.Body>
                  <Button onPress={() => setIsInnerOpen(false)}>
                    Close inner
                  </Button>
                </Modal.Body>
              </Modal>
            )}
          </ModalContainer>
        </Modal.Body>
      </Modal>
    </Modal.Trigger>
  );
}

function NestedThirdPartyModal() {
  return (
    <Modal.Trigger defaultOpen>
      <Button>Open outer</Button>
      <Modal>
        <Modal.Header>Outer</Modal.Header>
        <Modal.Body>
          <Modal.Trigger allowsThirdPartyOverlays>
            <Button>Open inner</Button>
            <Modal>
              <Modal.Header>Inner</Modal.Header>
              <Modal.Body>
                <div data-testid="inner-content">Inner content</div>
                <Button>Inner action</Button>
              </Modal.Body>
            </Modal>
          </Modal.Trigger>
        </Modal.Body>
      </Modal>
    </Modal.Trigger>
  );
}

function ModalWithSelect() {
  return (
    <Modal.Trigger defaultOpen allowsThirdPartyOverlays>
      <Button>Open modal</Button>
      <Modal>
        <Modal.Header>Header</Modal.Header>
        <Modal.Body>
          <div data-testid="modal-content">Modal content</div>
          <Select label="Fruit" placeholder="Pick a fruit">
            <Select.Option key="apple">Apple</Select.Option>
            <Select.Option key="banana">Banana</Select.Option>
          </Select>
        </Modal.Body>
      </Modal>
    </Modal.Trigger>
  );
}

function NestedDismissModals() {
  return (
    <Modal.Trigger defaultOpen>
      <Button>Open outer</Button>
      <Modal>
        <Modal.Header>Outer</Modal.Header>
        <Modal.Body>
          <div data-testid="outer-content">Outer content</div>
          <Modal.Trigger defaultOpen allowsThirdPartyOverlays>
            <Button>Open inner</Button>
            <Modal>
              <Modal.Header>Inner</Modal.Header>
              <Modal.Body>
                <div data-testid="inner-content">Inner content</div>
              </Modal.Body>
            </Modal>
          </Modal.Trigger>
        </Modal.Body>
      </Modal>
    </Modal.Trigger>
  );
}

const CustomSymbol = (props: object) => <span {...props} />;

function renderModal({
  defaultOpen,
  isOpen,
  size,
  isDismissable,
  iconAtEnd,
}: Partial<ModalProps> &
  Partial<ModalTriggerProps> &
  Partial<ModalHeaderProps> = {}) {
  const onPrimaryAction = vi.fn();
  const onSecondaryAction = vi.fn();
  const onOpenChange = vi.fn();
  const renderResult = render(
    <Modal.Trigger
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      isDismissable={isDismissable}
      onOpenChange={onOpenChange}
    >
      <Button>Open modal</Button>
      {(close) => (
        <Modal size={size}>
          <Modal.Header
            iconAtStart={{
              accessibilityLabel: "EasyPost Logo",
              symbol: CustomSymbol,
            }}
            iconAtEnd={iconAtEnd}
            subtitle="Optional subtitle"
          >
            H4 Title
          </Modal.Header>
          <Modal.Body>Modal content</Modal.Body>
          <Modal.Footer>
            <HorizontalStack align="space-between">
              <Button
                onPress={() => {
                  onPrimaryAction();
                  close();
                }}
              >
                Button 1
              </Button>
              <Button onPress={onSecondaryAction}>Button 2</Button>
            </HorizontalStack>
          </Modal.Footer>
        </Modal>
      )}
    </Modal.Trigger>,
  );
  return [
    renderResult,
    { onPrimaryAction, onSecondaryAction, onOpenChange },
  ] as const;
}

async function renderAndOpenModal(args = {}) {
  const response = renderModal(args);
  const [{ user }] = response;
  const openButton = screen.getByRole("button", { name: "Open modal" });
  await userClick(user, openButton);
  expect(screen.queryByRole("dialog")).toBeInTheDocument();
  return response;
}

// react-aria's `ariaHideOutside` hides outside content via `inert` (or
// `aria-hidden` where `inert` is unsupported), applied to an ancestor.
function isElementHidden(element: Element) {
  return Boolean(
    element.closest("[inert]") || element.closest('[aria-hidden="true"]'),
  );
}

function renderModalWithOutsideContent({
  allowsThirdPartyOverlays,
}: Partial<ModalTriggerProps> = {}) {
  return render(
    <>
      <div data-testid="outside-content">Outside content</div>
      <Modal.Trigger
        defaultOpen
        allowsThirdPartyOverlays={allowsThirdPartyOverlays}
      >
        <Button>Open modal</Button>
        <Modal>
          <Modal.Header>Header</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      </Modal.Trigger>
    </>,
  );
}
