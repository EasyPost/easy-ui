import { act, screen } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event";
import React, { ReactNode } from "react";
import { vi } from "vitest";
import { Button } from "../Button";
import { DropdownButton } from "../DropdownButton";
import { Modal } from "../Modal";
import { RadioButtonGroup } from "../RadioButtonGroup";
import { Select, SelectButton } from "../Select";
import { TextField } from "../TextField";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
  userClick,
  userKeyboard,
  userTab,
} from "../utilities/test";
import { Popover, PopoverProps, usePopoverTrigger } from "./Popover";
import { PopoverOverlayProps } from "./PopoverOverlay";

describe("<Popover />", () => {
  let restoreGetComputedStyle: () => void;
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    restoreGetComputedStyle = mockGetComputedStyle();
    restoreIntersectionObserver = mockIntersectionObserver();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    restoreIntersectionObserver();
    restoreGetComputedStyle();
    vi.restoreAllMocks();
  });

  it("should render a trigger without an overlay", () => {
    render(getPopover());
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should show on trigger click", async () => {
    const { user } = render(getPopover());
    await openPopover(user, screen.getByRole("button"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should show on trigger keydown", async () => {
    const { user } = render(getPopover());
    await userTab(user);
    await userKeyboard(user, "{enter}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should show with defaultOpen", () => {
    render(getPopover({ popoverProps: { defaultOpen: true } }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should support being controlled", async () => {
    const handleOpenChange = vi.fn();
    const { user, rerender } = render(
      getPopover({
        popoverProps: { isOpen: false, onOpenChange: handleOpenChange },
      }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await openPopover(user, screen.getByRole("button"));
    expect(handleOpenChange).toHaveBeenCalledTimes(1);

    rerender(
      getPopover({
        popoverProps: { isOpen: true, onOpenChange: handleOpenChange },
      }),
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should close on escape", async () => {
    const { user } = render(
      getPopover({ popoverProps: { defaultOpen: true } }),
    );
    await userKeyboard(user, "{escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should close on outside press", async () => {
    const { user } = render(
      getPopover({ popoverProps: { defaultOpen: true } }),
    );
    await userClick(user, document.body);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should close from content inside the overlay", async () => {
    const { user } = render(
      getPopover({
        popoverProps: { defaultOpen: true },
        children: (
          <>
            <Popover.Body>Content</Popover.Body>
            <Popover.Footer>
              <CloseButton />
            </Popover.Footer>
          </>
        ),
      }),
    );
    await userClick(user, screen.getByRole("button", { name: "Done" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should point the trigger at the overlay", async () => {
    const { user } = render(getPopover());
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await openPopover(user, trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute(
      "aria-controls",
      screen.getByRole("dialog").id,
    );
  });

  it("should take its accessible name from aria-label", () => {
    render(
      getPopover({
        popoverProps: { defaultOpen: true },
        overlayProps: { "aria-label": "Packaging" },
      }),
    );
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Packaging");
  });

  it("should take its accessible name from Popover.Title", () => {
    render(
      getPopover({
        popoverProps: { defaultOpen: true },
        overlayProps: {},
        children: (
          <>
            <Popover.Header>
              <Popover.Title>Shipment Packaging</Popover.Title>
            </Popover.Header>
            <Popover.Body>Content</Popover.Body>
          </>
        ),
      }),
    );
    expect(screen.getByRole("dialog")).toHaveAccessibleName(
      "Shipment Packaging",
    );
  });

  it("should warn when it has neither a title nor an aria-label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      getPopover({
        popoverProps: { defaultOpen: true },
        overlayProps: {},
      }),
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Popover.Title"));
  });

  it("should not warn when it has a title", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      getPopover({
        popoverProps: { defaultOpen: true },
        overlayProps: {},
        children: (
          <>
            <Popover.Header>
              <Popover.Title>Items</Popover.Title>
            </Popover.Header>
            <Popover.Body>Content</Popover.Body>
          </>
        ),
      }),
    );
    expect(warn).not.toHaveBeenCalled();
  });

  it("should contain focus while open", async () => {
    const { user } = render(
      <>
        <button data-testid="outside">Outside</button>
        {getPopover({
          children: (
            <Popover.Body>
              <Button>First</Button>
              <Button>Last</Button>
            </Popover.Body>
          ),
        })}
      </>,
    );

    await openPopover(user, screen.getByRole("button", { name: "Click me" }));
    await flushFocus();

    // Focus containment reaches us indirectly—React Aria Components' `Dialog`
    // calls `useOverlayFocusContain`, which flips the ancestor `Overlay`'s
    // `FocusScope` to `contain`—so assert it rather than assume it.
    await userTab(user);
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    await userTab(user);
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();

    // Tab from the last focusable element wraps back to the first rather than
    // leaving for the button outside the popover.
    await userTab(user);
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    expect(screen.getByTestId("outside")).not.toHaveFocus();
  });

  it("should restore focus to the trigger on close", async () => {
    const { user } = render(getPopover());
    const trigger = screen.getByRole("button");

    await openPopover(user, trigger);
    await userKeyboard(user, "{escape}");
    await flushFocus();
    expect(trigger).toHaveFocus();
  });

  it("should support the trigger's width as a floor", () => {
    render(
      getPopover({
        popoverProps: { defaultOpen: true },
        overlayProps: { "aria-label": "Rates", width: "auto" },
      }),
    );
    expect(getOverlay()).toHaveStyle({
      "--ezui-c-popover-min-width": "var(--trigger-width)",
      "--ezui-c-popover-width-xs": "auto",
    });
  });

  it("should support the trigger's width as a width", () => {
    render(
      getPopover({
        popoverProps: { defaultOpen: true },
        overlayProps: { "aria-label": "Rates", width: "trigger" },
      }),
    );
    expect(getOverlay()).toHaveStyle({
      "--ezui-c-popover-width-xs": "var(--trigger-width)",
    });
    // A hard width, so the floor would be redundant.
    expect(
      getOverlay().style.getPropertyValue("--ezui-c-popover-min-width"),
    ).toBe("");
  });

  it("should size to its content by default", () => {
    render(
      getPopover({
        popoverProps: { defaultOpen: true },
        overlayProps: { "aria-label": "Rates" },
      }),
    );
    expect(getOverlay()).toHaveStyle({ "--ezui-c-popover-width-xs": "auto" });
    expect(
      getOverlay().style.getPropertyValue("--ezui-c-popover-min-width"),
    ).toBe("");
  });

  it("should support an explicit width", () => {
    render(
      getPopover({
        popoverProps: { defaultOpen: true },
        overlayProps: { "aria-label": "Rates", width: 320 },
      }),
    );
    expect(getOverlay()).toHaveStyle({ "--ezui-c-popover-width-xs": "320px" });
  });

  it("should render the container with the default surface styles", () => {
    render(
      getPopover({
        popoverProps: { defaultOpen: true },
        overlayProps: { "aria-label": "Rates" },
      }),
    );
    // The surface `Menu`, `Select`, and `MultiSelect` share.
    expect(getContainer()).toHaveStyle({
      "--ezui-c-box-background-xs": "var(--ezui-color-neutral-000)",
      "--ezui-c-box-border-color": "var(--ezui-color-neutral-300)",
      "--ezui-c-box-border-top-width": "var(--ezui-shape-border-width-1)",
      "--ezui-c-box-border-top-left-radius-xs":
        "var(--ezui-shape-border-radius-md)",
      "--ezui-c-box-box-shadow": "var(--ezui-shadow-level-1)",
    });
  });

  it("should support overriding the container with box style props", () => {
    render(
      getPopover({
        popoverProps: { defaultOpen: true },
        overlayProps: {
          "aria-label": "Rates",
          background: "primary.100",
          borderRadius: "xl",
          padding: "2",
        },
      }),
    );
    expect(getContainer()).toHaveStyle({
      "--ezui-c-box-background-xs": "var(--ezui-color-primary-100)",
      "--ezui-c-box-border-top-left-radius-xs":
        "var(--ezui-shape-border-radius-xl)",
      "--ezui-c-box-padding-top-xs": "var(--ezui-space-2)",
      // Untouched defaults survive an override of their neighbors.
      "--ezui-c-box-box-shadow": "var(--ezui-shadow-level-1)",
    });
  });

  it("should preserve handlers on the trigger's child", async () => {
    const handlePress = vi.fn();
    const { user } = render(
      <Popover>
        <Popover.Trigger>
          <DropdownButton onPress={handlePress}>Click me</DropdownButton>
        </Popover.Trigger>
        <Popover.Overlay aria-label="Popover">Content</Popover.Overlay>
      </Popover>,
    );
    await openPopover(user, screen.getByRole("button"));
    expect(handlePress).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should support a SelectButton as the trigger", async () => {
    const { user } = render(
      <Popover>
        <Popover.Trigger>
          <SelectButton>Add Packaging</SelectButton>
        </Popover.Trigger>
        <Popover.Overlay aria-label="Packaging">Content</Popover.Overlay>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Add Packaging" });
    expect(trigger.tagName).toBe("BUTTON");

    await openPopover(user, trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should stay open while interacting with form content", async () => {
    const { user } = render(
      getPopover({
        popoverProps: { defaultOpen: true },
        children: (
          <Popover.Body>
            <RadioButtonGroup aria-label="Unit" defaultSelectedKeys={["in"]}>
              <RadioButtonGroup.Button id="in">in</RadioButtonGroup.Button>
              <RadioButtonGroup.Button id="cm">cm</RadioButtonGroup.Button>
            </RadioButtonGroup>
            <TextField label="Total Weight" />
            <Select label="Package" placeholder="Select one">
              <Select.Option key="box">Box</Select.Option>
              <Select.Option key="envelope">Envelope</Select.Option>
            </Select>
          </Popover.Body>
        ),
      }),
    );

    await userClick(user, screen.getByRole("radio", { name: "cm" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userClick(user, screen.getByRole("button", { name: /Package/ }));
    await userClick(user, screen.getByRole("option", { name: "Box" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should nest inside a modal", async () => {
    const { user } = render(
      <Modal.Trigger defaultOpen>
        <Button>Open modal</Button>
        <Modal>
          <Modal.Header>Modal</Modal.Header>
          <Modal.Body>
            <Popover>
              <Popover.Trigger>
                <DropdownButton>Click me</DropdownButton>
              </Popover.Trigger>
              <Popover.Overlay aria-label="Popover">
                <Popover.Body>Content</Popover.Body>
              </Popover.Overlay>
            </Popover>
          </Modal.Body>
        </Modal>
      </Modal.Trigger>,
    );

    // Held by node rather than re-queried, because an open popover hides the
    // rest of the page from assistive technologies—`usePopover` runs
    // `ariaHideOutside`—so the modal drops out of the accessibility tree while
    // the popover is up, exactly as it does under `Menu` and `Select`.
    const modal = screen.getByRole("dialog", { name: "Modal" });

    await openPopover(user, screen.getByRole("button", { name: "Click me" }));
    const popover = screen.getByRole("dialog", { name: "Popover" });

    await userClick(user, screen.getByText("Content"));
    expect(popover).toBeInTheDocument();
    expect(modal).toBeInTheDocument();

    // Only the topmost overlay handles the key, so the modal stays open.
    await userKeyboard(user, "{escape}");
    expect(
      screen.queryByRole("dialog", { name: "Popover" }),
    ).not.toBeInTheDocument();
    expect(modal).toBeInTheDocument();

    // The second escape has to come from inside the modal, so wait for focus to
    // land back on the popover's trigger first.
    await flushFocus();
    await userKeyboard(user, "{escape}");
    expect(modal).not.toBeInTheDocument();
  });
});

export async function openPopover(user: UserEvent, el: HTMLElement) {
  await userClick(user, el);
}

// React Aria's `FocusScope` moves focus from a queued task, so the assertion has
// to wait for it.
async function flushFocus() {
  await act(async () => {
    vi.runOnlyPendingTimers();
    await Promise.resolve();
  });
}

// The `<Box />` the dialog sits in, which carries the surface styles.
function getContainer() {
  return screen.getByRole("dialog").parentElement as HTMLElement;
}

function getOverlay() {
  // The overlay is React Aria's positioned element, which holds the width
  // custom properties. It carries no role of its own, and sits a level above
  // the container.
  return getContainer().parentElement as HTMLElement;
}

function CloseButton() {
  const { close } = usePopoverTrigger();
  return <Button onPress={close}>Done</Button>;
}

function getPopover({
  popoverProps = {},
  overlayProps = { "aria-label": "Popover" },
  children = "Content" as ReactNode,
}: {
  popoverProps?: Partial<PopoverProps>;
  overlayProps?: Partial<PopoverOverlayProps>;
  children?: ReactNode;
} = {}) {
  return (
    <Popover {...popoverProps}>
      <Popover.Trigger>
        <DropdownButton>Click me</DropdownButton>
      </Popover.Trigger>
      <Popover.Overlay {...overlayProps}>{children}</Popover.Overlay>
    </Popover>
  );
}
