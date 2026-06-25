import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { Button } from "../Button";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
  userClick,
} from "../utilities/test";
import { Modal, ModalContainer, ModalNestingBehavior } from "./Modal";

describe("<Modal /> nesting behavior", () => {
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

  it("should restore the hidden modal once the nested modal closes", async () => {
    const { user } = render(<NestedReplaceModals />);

    // Only the outer modal is open: it renders its (visible) backdrop.
    expect(getBackdrops()).toHaveLength(1);
    expect(getVisibleBackdrops()).toHaveLength(1);

    await userClick(user, screen.getByRole("button", { name: "Open inner A" }));

    // Both modals are mounted, but the outer is hidden so only the topmost
    // (inner) backdrop is visible.
    expect(getBackdrops()).toHaveLength(2);
    expect(getVisibleBackdrops()).toHaveLength(1);
    expect(isBackdropHidden("Outer")).toBe(true);
    expect(isBackdropHidden("Inner A")).toBe(false);

    await userClick(
      user,
      screen.getByRole("button", { name: "Close inner A" }),
    );

    // Closing the nested modal restores the outer modal.
    expect(getBackdrops()).toHaveLength(1);
    expect(getVisibleBackdrops()).toHaveLength(1);
    expect(isBackdropHidden("Outer")).toBe(false);
  });

  it("should keep the parent hidden until every sibling nested modal closes", async () => {
    // A counter (not a boolean) tracks replacing children, so the parent stays
    // hidden while any sibling nested modal is still open. This harness drives
    // both nested modals from controls outside the parent.
    const { user } = render(<ControlledReplaceModals />);

    await userClick(user, screen.getByRole("button", { name: "Open inner A" }));
    await userClick(user, screen.getByRole("button", { name: "Open inner B" }));

    // Two sibling nested modals are open; the shared parent stays hidden.
    expect(isBackdropHidden("Outer")).toBe(true);

    await userClick(
      user,
      screen.getByRole("button", { name: "Close inner A" }),
    );

    // One sibling remains open, so the parent must stay hidden. A boolean flag
    // would have incorrectly un-hidden it here; the count must not.
    expect(isBackdropHidden("Outer")).toBe(true);

    await userClick(
      user,
      screen.getByRole("button", { name: "Close inner B" }),
    );

    // With all nested modals closed, the parent returns.
    expect(isBackdropHidden("Outer")).toBe(false);
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

// A parent modal whose children replace it (via cascading `childNestingBehavior`),
// opened from two triggers inside it. The inner triggers use
// `allowsThirdPartyOverlays` so their controls stay reachable while open.
function NestedReplaceModals() {
  return (
    <Modal.Trigger defaultOpen childNestingBehavior="replace">
      <Button>Open outer</Button>
      <Modal>
        <Modal.Header>Outer</Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
      </Modal>
    </Modal.Trigger>
  );
}

// Drives two replacing nested modals that share a single parent from controls
// rendered *outside* the parent. Everything uses `allowsThirdPartyOverlays` so no
// modal `ariaHideOutside`s the controls, and everything is non-dismissable so
// clicking those outside controls doesn't dismiss an open modal via
// interact-outside. Nested modals are closed explicitly via their own buttons.
function ControlledReplaceModals() {
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

// CSS-module class names are scoped in tests (e.g. `_underlayBg_1a2b3`), so we
// match on the embedded local name rather than an exact class.
const UNDERLAY_CLASS = "underlayBg";
const UNDERLAY_HIDDEN_CLASS = "underlayBgHidden";
const UNDERLAY_NO_BACKDROP_CLASS = "underlayBgNoBackdrop";

function getBackdrops() {
  // The modifier classes share the `underlayBg` prefix, so each backdrop element
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

// `replace` hides the whole modal (box and backdrop) via `display: none`.
function isBackdropHidden(headerText: string) {
  return getBackdrop(headerText).className.includes(UNDERLAY_HIDDEN_CLASS);
}

// `stack-shared-backdrop` suppresses only the dark overlay while keeping the
// modal box visible, unlike `underlayBgHidden` which hides the whole modal.
function isBackdropSuppressed(headerText: string) {
  return getBackdrop(headerText).className.includes(UNDERLAY_NO_BACKDROP_CLASS);
}
