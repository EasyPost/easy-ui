import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { Button } from "../Button";
import {
  disableReactTransitionGroup,
  enableReactTransitionGroup,
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
  userClick,
  userKeyboard,
} from "../utilities/test";
import {
  Drawer,
  DrawerContainer,
  DrawerProps,
  useDrawerTrigger,
} from "./Drawer";
import { DrawerTriggerProps } from "./DrawerTrigger";
import { VerticalStack } from "../VerticalStack";
import { HorizontalStack } from "../HorizontalStack";

describe("<Drawer />", () => {
  let restoreGetComputedStyle: () => void;
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    restoreGetComputedStyle = mockGetComputedStyle();
    restoreIntersectionObserver = mockIntersectionObserver();
    disableReactTransitionGroup();
  });

  afterEach(() => {
    restoreIntersectionObserver();
    restoreGetComputedStyle();
    vi.useRealTimers();
    enableReactTransitionGroup();
  });

  it("should render a Drawer", async () => {
    const [{ user }] = renderDrawer();

    const openButton = screen.getByRole("button", { name: "Open drawer" });
    await userClick(user, openButton);

    expect(screen.getByText("Drawer content")).toBeInTheDocument();
    expect(screen.getByText("Drawer title")).toBeInTheDocument();
  });

  it("should be dismissable by close button", async () => {
    const [{ user }] = await renderAndOpenDrawer();
    const closeButton = screen.getByRole("button", { name: "Close drawer" });
    await userClick(user, closeButton);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should be dismissable by esc key", async () => {
    const [{ user }] = await renderAndOpenDrawer();
    await userKeyboard(user, "{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should support being nondismissable", async () => {
    const [{ user }] = await renderAndOpenDrawer({ isDismissable: false });
    expect(
      screen.queryByRole("button", { name: "Close drawer" }),
    ).not.toBeInTheDocument();
    await userKeyboard(user, "{Escape}");
    expect(screen.queryByRole("dialog")).toBeInTheDocument();
  });

  it("should support default open", () => {
    renderDrawer({ defaultOpen: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should support being controlled", () => {
    renderDrawer({ isOpen: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should support rendering in a container", async () => {
    function CustomDrawer() {
      const modalTrigger = useDrawerTrigger();
      return (
        <Drawer>
          <Drawer.Body>
            <div>Content</div>
            <Button
              onPress={() => {
                modalTrigger.close();
              }}
            >
              Close drawer
            </Button>
          </Drawer.Body>
        </Drawer>
      );
    }

    const handleDismiss = vi.fn();
    const { user, rerender } = render(
      <DrawerContainer onDismiss={handleDismiss}>
        {true ? <CustomDrawer /> : null}
      </DrawerContainer>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userClick(user, screen.getByRole("button", { name: "Close drawer" }));
    expect(handleDismiss).toBeCalled();

    rerender(
      <DrawerContainer onDismiss={handleDismiss}>
        {false ? <CustomDrawer /> : null}
      </DrawerContainer>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

function renderDrawer({
  defaultOpen,
  isOpen,
  isDismissable,
}: Partial<DrawerProps> & Partial<DrawerTriggerProps> = {}) {
  const onOpenChange = vi.fn();
  const renderResult = render(
    <Drawer.Trigger
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      isDismissable={isDismissable}
      onOpenChange={onOpenChange}
    >
      <Button>Open drawer</Button>
      <Drawer>
        <Drawer.Body>
          <Drawer.StandaloneContentArea>
            <VerticalStack gap="2">
              <HorizontalStack align="space-between" blockAlign="center">
                <Drawer.Title>Drawer title</Drawer.Title>
                <Drawer.CloseButton />
              </HorizontalStack>
              <div>Drawer content</div>
            </VerticalStack>
          </Drawer.StandaloneContentArea>
        </Drawer.Body>
      </Drawer>
    </Drawer.Trigger>,
  );
  return [renderResult, { onOpenChange }] as const;
}

async function renderAndOpenDrawer(args = {}) {
  const response = renderDrawer(args);
  const [{ user }] = response;
  const openButton = screen.getByRole("button", { name: "Open drawer" });
  await userClick(user, openButton);
  expect(screen.queryByRole("dialog")).toBeInTheDocument();
  return response;
}
