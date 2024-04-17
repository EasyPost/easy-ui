import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { Button } from "../Button";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
  userClick,
  userKeyboard,
} from "../utilities/test";
import { Modal, ModalContainer, ModalProps, useModalTrigger } from "./Modal";
import { ModalHeaderProps } from "./ModalHeader";
import { ModalTriggerProps } from "./ModalTrigger";

describe.only("<Modal />", () => {
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
          <Modal.Footer
            primaryAction={{
              content: "Modal Action Button",
              onAction: () => {
                modalTrigger.close();
              },
            }}
          />
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
});

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
          <Modal.Footer
            primaryAction={{
              content: "Button 1",
              onAction: () => {
                onPrimaryAction();
                close();
              },
            }}
            secondaryAction={{
              content: "Button 2",
              onAction: onSecondaryAction,
            }}
          />
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
