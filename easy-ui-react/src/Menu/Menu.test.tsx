import { screen } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import React, { ComponentProps, forwardRef } from "react";
import { vi } from "vitest";
import { DropdownButton } from "../DropdownButton";
import {
  mockGetComputedStyle,
  render,
  userClick,
  userKeyboard,
  userTab,
} from "../utilities/test";
import { Menu } from "./Menu";

describe("<Menu />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    restoreGetComputedStyle = mockGetComputedStyle();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    restoreGetComputedStyle();
  });

  it("should show on trigger click", async () => {
    const { user } = render(getMenu());
    await clickMenuTrigger(user, screen.getByRole("button"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("should show on trigger keydown", async () => {
    const { user } = render(getMenu());
    await tabToAndEnterKeyMenuTrigger(user);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("should show with defaultOpen", async () => {
    render(getMenu({ menuProps: { defaultOpen: true } }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("should support being controlled", async () => {
    const handleOpenChange = vi.fn();
    const { user, rerender } = render(
      getMenu({
        menuProps: { isOpen: false, onOpenChange: handleOpenChange },
      }),
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await clickMenuTrigger(user, screen.getByRole("button"));
    expect(handleOpenChange).toHaveBeenCalledTimes(1);

    rerender(
      getMenu({
        menuProps: { isOpen: true, onOpenChange: handleOpenChange },
      }),
    );
    expect(screen.queryByRole("menu")).toBeInTheDocument();
  });

  it("should be able to be disabled", async () => {
    const { user } = render(getMenu({ menuProps: { isDisabled: true } }));
    await clickMenuTrigger(user, screen.getByRole("button"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("supports onAction", async () => {
    const handleAction = vi.fn();
    const { user } = render(
      getMenu({
        menuProps: { defaultOpen: true },
        menuOverlayProps: { onAction: handleAction },
        items: [<Menu.Item key="click">Click me</Menu.Item>],
      }),
    );
    await clickMenuItem(user, screen.getAllByRole("menuitem")[0]);
    expect(handleAction).toBeCalledWith("click");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("supports onClose", async () => {
    const handleClose = vi.fn();
    const { user } = render(
      getMenu({
        menuProps: { defaultOpen: true },
        menuOverlayProps: { onClose: handleClose },
      }),
    );
    await clickMenuItem(user, screen.getAllByRole("menuitem")[0]);
    expect(handleClose).toBeCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("supports disabledKeys", async () => {
    const handleAction = vi.fn();
    const { user } = render(
      getMenu({
        menuProps: { defaultOpen: true },
        menuOverlayProps: { onAction: handleAction, disabledKeys: ["click"] },
        items: [<Menu.Item key="click">Click me</Menu.Item>],
      }),
    );
    await clickMenuItem(user, screen.getAllByRole("menuitem")[0]);
    expect(handleAction).not.toBeCalled();
    expect(screen.queryByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem")).toHaveAttribute("aria-disabled");
  });

  it("supports maxItemsUntilScroll", async () => {
    render(
      getMenu({
        menuProps: { defaultOpen: true },
        menuOverlayProps: { maxItemsUntilScroll: 2 },
      }),
    );
    expect(screen.getByRole("menu")).toHaveAttribute(
      "data-max-items-until-scroll",
      "2",
    );
  });

  it("supports width", async () => {
    render(
      getMenu({
        menuProps: { defaultOpen: true },
        menuOverlayProps: { width: "fit-content" },
      }),
    );
    expect(screen.getByRole("menu")).toHaveAttribute(
      "data-width",
      "fit-content",
    );
  });

  it("supports Menu.Section", async () => {
    render(
      getMenu({
        menuProps: { defaultOpen: true },
        items: [
          <Menu.Section key="s-1" aria-label="Section 1">
            <Menu.Item key="i-1">1</Menu.Item>
          </Menu.Section>,
          <Menu.Section key="s-2" aria-label="Section 2">
            <Menu.Item key="i-1">1</Menu.Item>
          </Menu.Section>,
        ],
      }),
    );
    expect(screen.getAllByRole("group")).toHaveLength(2);
    expect(screen.getAllByRole("group")[0]).toHaveAttribute(
      "aria-label",
      "Section 1",
    );
  });

  it("supports Menu.Section title", async () => {
    render(
      getMenu({
        menuProps: { defaultOpen: true },
        items: [
          <Menu.Section key="s-1" title="Title option">
            <Menu.Item key="i-1">1</Menu.Item>
          </Menu.Section>,
        ],
      }),
    );
    expect(screen.getByText("Title option")).toBeInTheDocument();
  });

  it("supports Menu.Item href", async () => {
    render(
      getMenu({
        menuProps: { defaultOpen: true },
        items: [
          <Menu.Item key="i-1" href="https://easypost.com" target="_blank">
            1
          </Menu.Item>,
        ],
      }),
    );
    expect(screen.getByRole("menuitem").tagName).toBe("A");
    expect(screen.getByRole("menuitem")).toHaveAttribute("href");
    expect(screen.getByRole("menuitem")).toHaveAttribute("target");
  });

  it("supports Menu.Item hrefComponent", async () => {
    type LinkProps = ComponentProps<"a"> & { replace?: boolean };
    const Link = forwardRef<null, LinkProps>(({ replace, ...props }, ref) => (
      <a ref={ref} data-replace={replace} {...props} />
    ));
    Link.displayName = "Link";
    render(
      getMenu({
        menuProps: { defaultOpen: true },
        items: [
          <Menu.Item<LinkProps>
            key="i-1"
            href="https://easypost.com"
            hrefComponent={Link}
            replace
          >
            1
          </Menu.Item>,
        ],
      }),
    );
    expect(screen.getByRole("menuitem").tagName).toBe("A");
    expect(screen.getByRole("menuitem")).toHaveAttribute("href");
    expect(screen.getByRole("menuitem")).toHaveAttribute(
      "data-replace",
      "true",
    );
  });

  it("supports Menu.Item closeOnSelect", async () => {
    const { user } = render(
      getMenu({
        menuProps: { defaultOpen: true },
        items: [
          <Menu.Item key="i-1" closeOnSelect={false}>
            1
          </Menu.Item>,
        ],
      }),
    );
    await clickMenuItem(user, screen.getByRole("menuitem"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("supports multiple selection", async () => {
    const { user } = render(
      getMenu({
        menuProps: { defaultOpen: true },
        menuOverlayProps: {
          selectionMode: "multiple",
        },
      }),
    );
    const checkboxes = screen.getAllByRole("menuitemcheckbox");
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
    await clickMenuItem(user, checkboxes[0]);
    await clickMenuItem(user, checkboxes[1]);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it("displays select all checkbox as indeterminate when few options are selected", async () => {
    const { user } = render(
      getMenu({
        menuProps: { defaultOpen: true },
        menuOverlayProps: {
          selectionMode: "multiple",
        },
        items: [
          <Menu.Item key="all">Select All</Menu.Item>,
          <Menu.Item key="1">1</Menu.Item>,
          <Menu.Item key="2">2</Menu.Item>,
          <Menu.Item key="3">3</Menu.Item>,
        ],
      }),
    );
    const checkboxes = screen.getAllByRole("menuitemcheckbox");
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
    await clickMenuItem(user, checkboxes[1]);
    await clickMenuItem(user, checkboxes[2]);
    expect(
      (
        screen.getByRole("checkbox", {
          name: /select all/i,
        }) as HTMLInputElement
      ).indeterminate,
    ).toBeTruthy();
  });

  it("should select all options when select all checkbox is selected", async () => {
    const { user } = render(
      getMenu({
        menuProps: { defaultOpen: true },
        menuOverlayProps: {
          selectionMode: "multiple",
        },
        items: [
          <Menu.Item key="all">Select All</Menu.Item>,
          <Menu.Item key="1">1</Menu.Item>,
          <Menu.Item key="2">2</Menu.Item>,
          <Menu.Item key="3">3</Menu.Item>,
        ],
      }),
    );
    const checkboxes = screen.getAllByRole("menuitemcheckbox");
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
    await clickMenuItem(user, checkboxes[0]);
    checkboxes.forEach((checkbox) => expect(checkbox).toBeChecked());
  });

  // TODO: userKeyboard is not registering onSelectionChange in React Aria
  //       figure out how to get working with react aria
  it.skip("should select all options when cmd + a keyboard shortcut is used", async () => {
    const { user } = render(
      getMenu({
        menuProps: { defaultOpen: true },
        menuOverlayProps: {
          selectionMode: "multiple",
        },
        items: [
          <Menu.Item key="all">Select All</Menu.Item>,
          <Menu.Item key="1">1</Menu.Item>,
          <Menu.Item key="2">2</Menu.Item>,
          <Menu.Item key="3">3</Menu.Item>,
        ],
      }),
    );
    await userKeyboard(user, "{Meta>}{a}{/Meta}");
    const checkboxes = screen.getAllByRole("menuitemcheckbox");
    checkboxes.forEach((checkbox) => expect(checkbox).toBeChecked());
  });
});

function getMenu({
  menuProps = {},
  menuOverlayProps = {},
  items = [
    <Menu.Item key="1">1</Menu.Item>,
    <Menu.Item key="2">2</Menu.Item>,
    <Menu.Item key="3">3</Menu.Item>,
  ],
} = {}) {
  return (
    <Menu {...menuProps}>
      <Menu.Trigger>
        <DropdownButton>Click me</DropdownButton>
      </Menu.Trigger>
      <Menu.Overlay {...menuOverlayProps}>{...items}</Menu.Overlay>
    </Menu>
  );
}

async function clickMenuTrigger(user: UserEvent, el: HTMLElement) {
  await userClick(user, el);
}

async function tabToAndEnterKeyMenuTrigger(user: UserEvent) {
  await userTab(user);
  await userKeyboard(user, "{enter}");
}

async function clickMenuItem(user: UserEvent, el: HTMLElement) {
  await userClick(user, el);
}
