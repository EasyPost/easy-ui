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
import { HostedUILayout, Mode } from "./HostedUILayout";

describe("<HostedUILayout />", () => {
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
      createHostedUILayout({
        onMenuAction: handleMenuAction,
        mode: "production",
      }),
    );

    expect(screen.getByText("HostedUI Content")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();

    await userClick(user, screen.getByRole("button", { name: "Menu Action" }));
    await userClick(user, screen.getByRole("menuitem", { name: "Action 1" }));

    expect(handleMenuAction).toBeCalled();
  });

  it("should render a banner in test mode", () => {
    render(
      createHostedUILayout({
        mode: "test",
      }),
    );

    expect(
      screen.getByText("This Environment is in Test Mode"),
    ).toBeInTheDocument();

    expect(screen.getByTestId("test-mode")).toBeInTheDocument();
  });
});

function createHostedUILayout(
  props: {
    onMenuAction?: () => void;
    mode?: Mode;
  } = {},
) {
  const { onMenuAction = vi.fn(), mode = "production" } = props;
  return (
    <HostedUILayout mode={mode}>
      <HostedUILayout.Header>
        <HostedUILayout.LogoContainer>
          <HostedUILayout.Logo>Logo</HostedUILayout.Logo>
        </HostedUILayout.LogoContainer>
        <HostedUILayout.Actions>
          <HostedUILayout.MenuAction
            accessibilityLabel="Menu Action"
            iconSymbol={Icon}
            renderBadge={() => <HostedUILayout.ActionBadge />}
          >
            <Menu.Overlay onAction={onMenuAction}>
              <Menu.Item>Action 1</Menu.Item>
              <Menu.Item>Action 2</Menu.Item>
            </Menu.Overlay>
          </HostedUILayout.MenuAction>
          <HostedUILayout.ButtonAction
            accessibilityLabel="Button Action"
            iconSymbol={Icon}
            onPress={() => {}}
          />
        </HostedUILayout.Actions>
      </HostedUILayout.Header>
      <HostedUILayout.Content>HostedUI Content</HostedUILayout.Content>
    </HostedUILayout>
  );
}

function Icon() {
  return (
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
  );
}
