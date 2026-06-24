import { screen } from "@testing-library/react";
import React from "react";
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
import {
  Modal,
  ModalContainer,
  ModalNestingBehavior,
  ModalProps,
  useModalTrigger,
} from "./Modal";
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

  it("should hide the parent backdrop while a nested modal is open so only one renders", async () => {
    const { user } = render(<NestedModals />);

    // Only the outer modal is open: it renders its (visible) backdrop.
    expect(getBackdrops()).toHaveLength(1);
    expect(getVisibleBackdrops()).toHaveLength(1);

    await userClick(user, screen.getByRole("button", { name: "Open inner A" }));

    // Both modals are mounted, but the outer's backdrop is hidden so only the
    // topmost (inner) backdrop is visible.
    expect(getBackdrops()).toHaveLength(2);
    expect(getVisibleBackdrops()).toHaveLength(1);
    expect(isBackdropHidden("Outer")).toBe(true);
    expect(isBackdropHidden("Inner A")).toBe(false);

    await userClick(
      user,
      screen.getByRole("button", { name: "Close inner A" }),
    );

    // Closing the nested modal restores the outer modal's backdrop.
    expect(getBackdrops()).toHaveLength(1);
    expect(getVisibleBackdrops()).toHaveLength(1);
    expect(isBackdropHidden("Outer")).toBe(false);
  });

  it("should keep the parent backdrop hidden until every sibling nested modal closes", async () => {
    // Once a nested modal opens, the parent modal (backdrop and all) is hidden,
    // so a second sibling can't be opened from a control inside it. This harness
    // drives both nested modals from controls outside the parent instead.
    const { user } = render(<ControlledNestedModals />);

    await userClick(user, screen.getByRole("button", { name: "Open inner A" }));
    await userClick(user, screen.getByRole("button", { name: "Open inner B" }));

    // Two sibling nested modals are open; the shared parent stays hidden.
    expect(isBackdropHidden("Outer")).toBe(true);

    await userClick(
      user,
      screen.getByRole("button", { name: "Close inner A" }),
    );

    // One sibling remains open, so the parent backdrop must stay hidden. A
    // boolean flag would have incorrectly un-hidden it here; the count must not.
    expect(isBackdropHidden("Outer")).toBe(true);

    await userClick(
      user,
      screen.getByRole("button", { name: "Close inner B" }),
    );

    // With all nested modals closed, the parent backdrop returns.
    expect(isBackdropHidden("Outer")).toBe(false);
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

  it("should stack modals with their own backdrops when childNestingBehavior is stack", async () => {
    const { user } = render(<NestingBehaviorNested outerBehavior="stack" />);

    expect(getVisibleBackdrops()).toHaveLength(1);

    await userClick(user, screen.getByRole("button", { name: "Open inner" }));

    // `stack` stacks: nothing is hidden, so both modals render their own
    // backdrops on top of each other.
    expect(getBackdrops()).toHaveLength(2);
    expect(isBackdropHidden("Outer")).toBe(false);
    expect(isBackdropSuppressed("Outer")).toBe(false);
    expect(getVisibleBackdrops()).toHaveLength(2);
  });

  it("should hide the modal beneath an open nested modal when childNestingBehavior is replace", async () => {
    const { user } = render(<NestingBehaviorNested outerBehavior="replace" />);

    await userClick(user, screen.getByRole("button", { name: "Open inner" }));

    // `replace` hides the whole modal beneath, leaving only the topmost visible.
    expect(isBackdropHidden("Outer")).toBe(true);
    expect(getVisibleBackdrops()).toHaveLength(1);
  });

  it("should keep all modals visible and show only the lowest backdrop when childNestingBehavior is stack-shared-backdrop", async () => {
    const { user } = render(
      <NestingBehaviorNested outerBehavior="stack-shared-backdrop" />,
    );

    // The lowest (root) modal keeps its backdrop.
    expect(isBackdropSuppressed("Outer")).toBe(false);

    await userClick(user, screen.getByRole("button", { name: "Open inner" }));

    // The outer modal stays visible (not hidden) and keeps its backdrop, while
    // the nested modal stays visible but suppresses its own backdrop.
    expect(isBackdropHidden("Outer")).toBe(false);
    expect(isBackdropSuppressed("Outer")).toBe(false);
    expect(isBackdropSuppressed("Inner")).toBe(true);
    expect(screen.getByTestId("inner-content")).toBeInTheDocument();
  });

  it("should cascade childNestingBehavior to descendant modals that don't set their own", async () => {
    const { user } = render(
      <NestingBehaviorNested outerBehavior="stack-shared-backdrop" />,
    );

    await userClick(user, screen.getByRole("button", { name: "Open inner" }));

    // The nested modal inherits `stack-shared-backdrop` from its ancestor.
    expect(isBackdropSuppressed("Inner")).toBe(true);
  });

  it("should let a descendant override an inherited childNestingBehavior via selfNestingBehavior", async () => {
    const { user } = render(
      <NestingBehaviorNested
        outerBehavior="stack-shared-backdrop"
        innerBehavior="stack"
      />,
    );

    await userClick(user, screen.getByRole("button", { name: "Open inner" }));

    // Ancestor keeps the lowest backdrop, but the descendant's own value wins so
    // it renders its own backdrop.
    expect(isBackdropSuppressed("Outer")).toBe(false);
    expect(isBackdropSuppressed("Inner")).toBe(false);
    expect(isBackdropHidden("Inner")).toBe(false);
  });

  it("should not hide the parent by default when a nested modal opens", async () => {
    const { user } = render(<ReplaceParentNested />);

    await userClick(user, screen.getByRole("button", { name: "Open inner" }));

    // The parent is a plain (stack) modal, so it stays visible behind the nested
    // modal.
    expect(isBackdropHidden("Outer")).toBe(false);
  });

  it("should hide the parent when a nested modal sets selfNestingBehavior replace, without configuring the parent", async () => {
    const { user } = render(
      <ReplaceParentNested innerSelfBehavior="replace" />,
    );

    // Before the nested modal opens, the parent renders normally.
    expect(isBackdropHidden("Outer")).toBe(false);

    await userClick(user, screen.getByRole("button", { name: "Open inner" }));

    // The nested modal's own connection resolved to `replace`, so the parent
    // hides even though it was never configured with `childNestingBehavior`.
    expect(isBackdropHidden("Outer")).toBe(true);
    expect(screen.getByTestId("inner-content")).toBeInTheDocument();

    await userClick(user, screen.getByRole("button", { name: "Close inner" }));

    // Closing the nested modal restores the parent.
    expect(isBackdropHidden("Outer")).toBe(false);
  });

  it("should suppress only its own backdrop when a nested modal sets selfNestingBehavior stack-shared-backdrop", async () => {
    const { user } = render(
      <ReplaceParentNested innerSelfBehavior="stack-shared-backdrop" />,
    );

    await userClick(user, screen.getByRole("button", { name: "Open inner" }));

    // The nested modal shares the parent's backdrop: the parent stays visible
    // with its backdrop, and only the nested modal suppresses its own.
    expect(isBackdropHidden("Outer")).toBe(false);
    expect(isBackdropSuppressed("Outer")).toBe(false);
    expect(isBackdropSuppressed("Inner")).toBe(true);
    expect(screen.getByTestId("inner-content")).toBeInTheDocument();
  });
});

function NestedModals() {
  return (
    <Modal.Trigger defaultOpen childNestingBehavior="replace">
      <Button>Open outer</Button>
      <Modal>
        <Modal.Header>Outer</Modal.Header>
        <Modal.Body>
          {/*
            The inner triggers use `allowsThirdPartyOverlays` so they don't
            `ariaHideOutside`, keeping every control reachable via the
            accessibility tree while multiple nested modals are open. The
            backdrop-hiding logic under test is shared by both underlay variants.
          */}
          <Modal.Trigger allowsThirdPartyOverlays>
            <Button>Open inner A</Button>
            {(close) => (
              <Modal>
                <Modal.Header>Inner A</Modal.Header>
                <Modal.Body>
                  <Button onPress={close}>Close inner A</Button>
                </Modal.Body>
              </Modal>
            )}
          </Modal.Trigger>
          <Modal.Trigger allowsThirdPartyOverlays>
            <Button>Open inner B</Button>
            {(close) => (
              <Modal>
                <Modal.Header>Inner B</Modal.Header>
                <Modal.Body>
                  <Button onPress={close}>Close inner B</Button>
                </Modal.Body>
              </Modal>
            )}
          </Modal.Trigger>
        </Modal.Body>
      </Modal>
    </Modal.Trigger>
  );
}

// Drives two nested modals that share a single parent from controls rendered
// *outside* the parent. Everything uses `allowsThirdPartyOverlays` so no modal
// `ariaHideOutside`s the controls, and everything is non-dismissable so clicking
// those outside controls doesn't dismiss an open modal via interact-outside.
// Nested modals are closed explicitly via their own buttons. The parent-hiding
// logic under test is shared by both underlay variants, so this doesn't change
// what's exercised.
function ControlledNestedModals() {
  const [isAOpen, setIsAOpen] = React.useState(false);
  const [isBOpen, setIsBOpen] = React.useState(false);
  return (
    <>
      <Button onPress={() => setIsAOpen(true)}>Open inner A</Button>
      <Button onPress={() => setIsBOpen(true)}>Open inner B</Button>
      <Modal.Trigger
        defaultOpen
        allowsThirdPartyOverlays
        isDismissable={false}
        childNestingBehavior="replace"
      >
        <Button>Open outer</Button>
        <Modal>
          <Modal.Header>Outer</Modal.Header>
          <Modal.Body>
            <ModalContainer
              allowsThirdPartyOverlays
              isDismissable={false}
              onDismiss={() => setIsAOpen(false)}
            >
              {isAOpen && (
                <Modal>
                  <Modal.Header>Inner A</Modal.Header>
                  <Modal.Body>
                    <Button onPress={() => setIsAOpen(false)}>
                      Close inner A
                    </Button>
                  </Modal.Body>
                </Modal>
              )}
            </ModalContainer>
            <ModalContainer
              allowsThirdPartyOverlays
              isDismissable={false}
              onDismiss={() => setIsBOpen(false)}
            >
              {isBOpen && (
                <Modal>
                  <Modal.Header>Inner B</Modal.Header>
                  <Modal.Body>
                    <Button onPress={() => setIsBOpen(false)}>
                      Close inner B
                    </Button>
                  </Modal.Body>
                </Modal>
              )}
            </ModalContainer>
          </Modal.Body>
        </Modal>
      </Modal.Trigger>
    </>
  );
}

// CSS-module class names are scoped in tests (e.g. `_underlayBg_1a2b3`), so we
// match on the embedded local name rather than an exact class.
const UNDERLAY_CLASS = "underlayBg";
const UNDERLAY_HIDDEN_CLASS = "underlayBgHidden";
const UNDERLAY_NO_BACKDROP_CLASS = "underlayBgNoBackdrop";

function getBackdrops() {
  // The hidden modifier shares the `underlayBg` prefix, so each backdrop element
  // is matched exactly once.
  return Array.from(
    document.querySelectorAll(`[class*="${UNDERLAY_CLASS}"]`),
  ) as HTMLElement[];
}

function getVisibleBackdrops() {
  return getBackdrops().filter(
    (el) => !el.className.includes(UNDERLAY_HIDDEN_CLASS),
  );
}

function getBackdrop(headerText: string) {
  return screen
    .getByText(headerText)
    .closest(`[class*="${UNDERLAY_CLASS}"]`) as HTMLElement;
}

function isBackdropHidden(headerText: string) {
  return getBackdrop(headerText).className.includes(UNDERLAY_HIDDEN_CLASS);
}

// `never` keeps the modal box visible but suppresses the dark overlay, unlike
// `underlayBgHidden` which hides the whole modal.
function isBackdropSuppressed(headerText: string) {
  return getBackdrop(headerText).className.includes(UNDERLAY_NO_BACKDROP_CLASS);
}

// Outer modal opens by default; the inner trigger uses `allowsThirdPartyOverlays`
// so its controls stay reachable while both modals are open. The outer sets
// `childNestingBehavior` (which cascades) and the inner sets `selfNestingBehavior`
// (which overrides for its own connection), exercising the cascade/override paths.
function NestingBehaviorNested({
  outerBehavior,
  innerBehavior,
}: {
  outerBehavior?: ModalNestingBehavior;
  innerBehavior?: ModalNestingBehavior;
}) {
  return (
    <Modal.Trigger defaultOpen childNestingBehavior={outerBehavior}>
      <Button>Open outer</Button>
      <Modal>
        <Modal.Header>Outer</Modal.Header>
        <Modal.Body>
          <Modal.Trigger
            allowsThirdPartyOverlays
            selfNestingBehavior={innerBehavior}
          >
            <Button>Open inner</Button>
            {(close) => (
              <Modal>
                <Modal.Header>Inner</Modal.Header>
                <Modal.Body>
                  <div data-testid="inner-content">Inner content</div>
                  <Button onPress={close}>Close inner</Button>
                </Modal.Body>
              </Modal>
            )}
          </Modal.Trigger>
        </Modal.Body>
      </Modal>
    </Modal.Trigger>
  );
}

// A plain (stack) parent modal with a single nested modal. The nested modal can
// configure its own connection to the parent via `selfNestingBehavior` — without
// the parent itself being configured — mirroring a one-off nesting deep in a
// larger modal tree.
function ReplaceParentNested({
  innerSelfBehavior,
}: {
  innerSelfBehavior?: ModalNestingBehavior;
}) {
  return (
    <Modal.Trigger defaultOpen>
      <Button>Open outer</Button>
      <Modal>
        <Modal.Header>Outer</Modal.Header>
        <Modal.Body>
          <Modal.Trigger
            allowsThirdPartyOverlays
            selfNestingBehavior={innerSelfBehavior}
          >
            <Button>Open inner</Button>
            {(close) => (
              <Modal>
                <Modal.Header>Inner</Modal.Header>
                <Modal.Body>
                  <div data-testid="inner-content">Inner content</div>
                  <Button onPress={close}>Close inner</Button>
                </Modal.Body>
              </Modal>
            )}
          </Modal.Trigger>
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
