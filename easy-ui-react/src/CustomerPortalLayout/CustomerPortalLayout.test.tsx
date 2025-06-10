import { screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { Menu } from "../Menu";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
  userClick,
} from "../utilities/test";
import { CustomerPortalLayout, Mode } from "./CustomerPortalLayout";

describe("<CustomerPortalLayout />", () => {
  let restoreGetComputedStyle: () => void;
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    restoreIntersectionObserver = mockIntersectionObserver();
    restoreGetComputedStyle = mockGetComputedStyle();
  });

  afterEach(() => {
    restoreGetComputedStyle();
    restoreIntersectionObserver();
    vi.useRealTimers();
  });

  it("should render a hosted ui layout", async () => {
    const handleMenuAction = vi.fn();

    const { user } = render(
      createCustomerPortalLayout({
        onMenuAction: handleMenuAction,
        mode: "production",
      }),
    );

    expect(screen.getByText("CustomerPortal Content")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();

    await userClick(user, screen.getByRole("button", { name: "Menu Action" }));
    await userClick(user, screen.getByRole("menuitem", { name: "Action 1" }));

    expect(handleMenuAction).toBeCalled();
  });

  it("should render a banner in test mode", () => {
    render(
      createCustomerPortalLayout({
        mode: "test",
      }),
    );

    expect(
      screen.getByText("This Environment is in Test Mode"),
    ).toBeInTheDocument();

    expect(screen.getByTestId("test-mode")).toBeInTheDocument();
  });
});

function createCustomerPortalLayout(
  props: {
    onMenuAction?: () => void;
    mode?: Mode;
  } = {},
) {
  const { onMenuAction = vi.fn(), mode = "production" } = props;
  return (
    <CustomerPortalLayout mode={mode}>
      <CustomerPortalLayout.Header>
        <CustomerPortalLayout.LogoContainer>
          <CustomerPortalLayout.Logo>Logo</CustomerPortalLayout.Logo>
        </CustomerPortalLayout.LogoContainer>
        <CustomerPortalLayout.Actions>
          <CustomerPortalLayout.MenuAction
            accessibilityLabel="Menu Action"
            iconSymbol={Icon}
            renderBadge={() => <CustomerPortalLayout.ActionBadge />}
          >
            <Menu.Overlay onAction={onMenuAction}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </CustomerPortalLayout.MenuAction>
          <CustomerPortalLayout.ButtonAction
            accessibilityLabel="Button Action"
            iconSymbol={Icon}
            onPress={() => {}}
          />
        </CustomerPortalLayout.Actions>
      </CustomerPortalLayout.Header>
      <CustomerPortalLayout.Content>
        CustomerPortal Content
      </CustomerPortalLayout.Content>
    </CustomerPortalLayout>
  );
}

function Icon() {
  return (
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
  );
}
