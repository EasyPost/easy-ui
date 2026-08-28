import { RouterOptions } from "@react-types/shared";
import { screen } from "@testing-library/react";
import React, { ReactElement } from "react";
import { vi } from "vitest";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { Menu } from "../Menu";
import { TabNav } from "../TabNav";
import { VerticalNav } from "../VerticalNav";
import {
  mockGetComputedStyle,
  mockIntersectionObserver,
  render,
} from "../utilities/test";
import { Provider } from "./Provider";

import ArrowBackIcon from "@easypost/easy-ui-icons/ArrowBack";

// React Aria resolves `RouterOptions` to `never` until an app augments
// `RouterConfig` with its router's option type, so options need a cast here
const routerOptions = { replace: true } as unknown as RouterOptions;

describe("<Provider />", () => {
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

  it("should render children without a navigate function", () => {
    render(
      <Provider>
        <Button href="/somewhere">Go</Button>
      </Provider>,
    );
    expect(screen.getByRole("button", { name: /go/i })).toHaveAttribute(
      "href",
      "/somewhere",
    );
  });

  describe("navigate", () => {
    it("should client navigate from a <Button />", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <Button href="/somewhere">Go</Button>,
        navigate,
      );
      await user.click(screen.getByRole("button", { name: /go/i }));
      expect(navigate).toHaveBeenCalledWith("/somewhere", undefined);
    });

    it("should forward routerOptions from a <Button />", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <Button href="/somewhere" routerOptions={routerOptions}>
          Go
        </Button>,
        navigate,
      );
      await user.click(screen.getByRole("button", { name: /go/i }));
      expect(navigate).toHaveBeenCalledWith("/somewhere", routerOptions);
    });

    it("should client navigate from a <Button /> activated by keyboard", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <Button href="/somewhere">Go</Button>,
        navigate,
      );
      await user.tab();
      await user.keyboard("{Enter}");
      expect(navigate).toHaveBeenCalledWith("/somewhere", undefined);
    });

    it("should not client navigate from a <Button /> without an href", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(<Button>Go</Button>, navigate);
      await user.click(screen.getByRole("button", { name: /go/i }));
      expect(navigate).not.toHaveBeenCalled();
    });

    it("should not client navigate from a <Button /> to an external origin", async () => {
      // the link falls through to a full page load, which jsdom logs as
      // unimplemented
      const restoreConsoleError = suppressConsoleError();
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <Button href="https://www.easypost.com/">Go</Button>,
        navigate,
      );
      await user.click(screen.getByRole("button", { name: /go/i }));
      expect(navigate).not.toHaveBeenCalled();
      restoreConsoleError();
    });

    it("should not client navigate from a <Button /> opening a new tab", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <Button href="/somewhere" target="_blank">
          Go
        </Button>,
        navigate,
      );
      await user.click(screen.getByRole("button", { name: /go/i }));
      expect(navigate).not.toHaveBeenCalled();
    });

    it("should client navigate from an <IconButton />", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <IconButton
          href="/somewhere"
          icon={ArrowBackIcon}
          accessibilityLabel="Go"
        />,
        navigate,
      );
      await user.click(screen.getByRole("button", { name: /go/i }));
      expect(navigate).toHaveBeenCalledWith("/somewhere", undefined);
    });

    it("should client navigate from a <TabNav.Item />", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <TabNav aria-label="Nav">
          <TabNav.Item href="/somewhere">Go</TabNav.Item>
        </TabNav>,
        navigate,
      );
      await user.click(screen.getByRole("link", { name: /go/i }));
      expect(navigate).toHaveBeenCalledWith("/somewhere", undefined);
    });

    it("should client navigate from a <VerticalNav.Item />", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <VerticalNav aria-label="Nav" selectedKey="1">
          <VerticalNav.Item key="1" label="Go" href="/somewhere" />
        </VerticalNav>,
        navigate,
      );
      await user.click(screen.getByRole("link", { name: /go/i }));
      expect(navigate).toHaveBeenCalledWith("/somewhere", undefined);
    });

    it("should client navigate from a <Menu.Item />", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <Menu>
          <Menu.Trigger>
            <Button>Open</Button>
          </Menu.Trigger>
          <Menu.Overlay onAction={vi.fn()}>
            <Menu.Item key="1" href="/somewhere">
              Go
            </Menu.Item>
          </Menu.Overlay>
        </Menu>,
        navigate,
      );
      await user.click(screen.getByRole("button", { name: /open/i }));
      await user.click(screen.getByRole("menuitem", { name: /go/i }));
      expect(navigate).toHaveBeenCalledWith("/somewhere", undefined);
    });
  });

  describe("useHref", () => {
    it("should prepend a base path to a <Button /> href", () => {
      renderWithNavigate(
        <Button href="/somewhere">Go</Button>,
        vi.fn(),
        (href) => `/base${href}`,
      );
      expect(screen.getByRole("button", { name: /go/i })).toHaveAttribute(
        "href",
        "/base/somewhere",
      );
    });

    it("should prepend a base path to a <TabNav.Item /> href", () => {
      renderWithNavigate(
        <TabNav aria-label="Nav">
          <TabNav.Item href="/somewhere">Go</TabNav.Item>
        </TabNav>,
        vi.fn(),
        (href) => `/base${href}`,
      );
      expect(screen.getByRole("link", { name: /go/i })).toHaveAttribute(
        "href",
        "/base/somewhere",
      );
    });

    it("should navigate with the unresolved href", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <Button href="/somewhere">Go</Button>,
        navigate,
        (href) => `/base${href}`,
      );
      await user.click(screen.getByRole("button", { name: /go/i }));
      expect(navigate).toHaveBeenCalledWith("/somewhere", undefined);
    });
  });
});

function suppressConsoleError() {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  return () => spy.mockRestore();
}

function renderWithNavigate(
  children: ReactElement,
  navigate: (path: string) => void,
  useHref?: (href: string) => string,
) {
  return render(
    <Provider navigate={navigate} useHref={useHref}>
      {children}
    </Provider>,
  );
}
