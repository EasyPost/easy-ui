import { RouterOptions } from "@react-types/shared";
import { screen } from "@testing-library/react";
import React, { ComponentProps, ReactElement } from "react";
import { vi } from "vitest";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { Menu } from "../Menu";
import { SearchNav } from "../SearchNav";
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
    customNavigate.mockClear();
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

    it("should not client navigate from a disabled <Button />", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <Button href="/somewhere" isDisabled>
          Go
        </Button>,
        navigate,
      );
      const button = screen.getByRole("button", { name: /go/i });
      expect(button).not.toHaveAttribute("href");
      await user.click(button);
      expect(navigate).not.toHaveBeenCalled();
    });

    it("should not client navigate from a <Button /> that downloads", async () => {
      // the link falls through to a full page load, which jsdom logs as
      // unimplemented
      const restoreConsoleError = suppressConsoleError();
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <Button href="/report.csv" download>
          Go
        </Button>,
        navigate,
      );
      await user.click(screen.getByRole("button", { name: /go/i }));
      expect(navigate).not.toHaveBeenCalled();
      restoreConsoleError();
    });

    it("should not client navigate from a <Button /> whose handler prevents default", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <Button href="/somewhere" onClick={(e) => e.preventDefault()}>
          Go
        </Button>,
        navigate,
      );
      await user.click(screen.getByRole("button", { name: /go/i }));
      expect(navigate).not.toHaveBeenCalled();
    });

    it("should not client navigate from a <Button /> whose handler prevents default on Enter", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <Button href="/somewhere" onClick={(e) => e.preventDefault()}>
          Go
        </Button>,
        navigate,
      );
      await user.tab();
      await user.keyboard("{Enter}");
      expect(navigate).not.toHaveBeenCalled();
    });

    it("should not client navigate from a <Button /> whose handler prevents default on Space", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <Button href="/somewhere" onClick={(e) => e.preventDefault()}>
          Go
        </Button>,
        navigate,
      );
      await user.tab();
      await user.keyboard(" ");
      expect(navigate).not.toHaveBeenCalled();
    });

    it("should client navigate once from a <Button /> with an onPress handler", async () => {
      const navigate = vi.fn();
      const onPress = vi.fn();
      const { user } = renderWithNavigate(
        <Button href="/somewhere" onPress={onPress}>
          Go
        </Button>,
        navigate,
      );
      await user.click(screen.getByRole("button", { name: /go/i }));
      expect(onPress).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith("/somewhere", undefined);
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

    it("should client navigate from a <SearchNav /> CTA", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(searchNavWithCTA(), navigate);
      // the CTA renders in the desktop layout, which a media query hides in
      // jsdom's default viewport
      await user.click(
        screen.getByRole("button", { name: /docs/i, hidden: true }),
      );
      expect(navigate).toHaveBeenCalledWith("/somewhere", routerOptions);
    });

    // `<SearchNav />` rebuilds its CTAs as menu items in two places: the CTA
    // group's own overflow menu, and the condensed nav that replaces the whole
    // bar on small screens. Both render at once and are shown by media query,
    // so both trigger buttons are in the DOM and the hidden one still needs
    // asserting
    it.each([
      ["a <SearchNav.CTAGroup /> menu item", 0],
      ["a condensed <SearchNav /> menu item", 1],
    ])("should forward routerOptions from %s", async (_, triggerIndex) => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(searchNavWithCTA(), navigate);
      const triggers = screen.getAllByRole("button", {
        name: "menu",
        hidden: true,
      });
      await user.click(triggers[triggerIndex]);
      await user.click(screen.getByRole("menuitem", { name: /docs/i }));
      expect(navigate).toHaveBeenCalledWith("/somewhere", routerOptions);
    });

    it("should client navigate from a <VerticalNav.SupplementaryAction />", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <VerticalNav
          aria-label="Nav"
          selectedKey="1"
          supplementaryAction={
            <VerticalNav.SupplementaryAction as="a" href="/somewhere">
              Go
            </VerticalNav.SupplementaryAction>
          }
        >
          <VerticalNav.Item key="1" label="Item 1" href="/1" />
        </VerticalNav>,
        navigate,
      );
      await user.click(screen.getByRole("link", { name: /go/i }));
      expect(navigate).toHaveBeenCalledWith("/somewhere", undefined);
    });
  });

  // components rendering a custom link component are left alone; the link
  // component is expected to handle client-side navigation itself, and it may
  // accept hrefs that only it understands, such as next/link's URL objects
  describe("custom link components", () => {
    it("should not client navigate from a <TabNav.Item />", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <TabNav aria-label="Nav">
          <TabNav.Item as={CustomLink} href="/somewhere">
            Go
          </TabNav.Item>
        </TabNav>,
        navigate,
        (href) => `/base${href}`,
      );
      const link = screen.getByRole("link", { name: /go/i });
      expect(link).toHaveAttribute("href", "/somewhere");
      await user.click(link);
      expect(navigate).not.toHaveBeenCalled();
      expect(customNavigate).toHaveBeenCalledTimes(1);
    });

    it("should not client navigate from a <VerticalNav.Item />", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <VerticalNav aria-label="Nav" selectedKey="1">
          <VerticalNav.Item
            key="1"
            as={CustomLink}
            label="Go"
            href="/somewhere"
          />
        </VerticalNav>,
        navigate,
        (href) => `/base${href}`,
      );
      const link = screen.getByRole("link", { name: /go/i });
      expect(link).toHaveAttribute("href", "/somewhere");
      await user.click(link);
      expect(navigate).not.toHaveBeenCalled();
      expect(customNavigate).toHaveBeenCalledTimes(1);
    });

    // `<Menu.Item />` is the exception. `useMenuItem()` reads the item from the
    // collection rather than from the props it's handed, so its click handling
    // can't be opted out of; only the rendered `href` is left as written
    it("should give a <Menu.Item /> hrefComponent the unresolved href", async () => {
      const navigate = vi.fn();
      const { user } = renderWithNavigate(
        <Menu>
          <Menu.Trigger>
            <Button>Open</Button>
          </Menu.Trigger>
          <Menu.Overlay onAction={vi.fn()}>
            <Menu.Item key="1" href="/somewhere" hrefComponent={ChainingLink}>
              Go
            </Menu.Item>
          </Menu.Overlay>
        </Menu>,
        navigate,
        (href) => `/base${href}`,
      );
      await user.click(screen.getByRole("button", { name: /open/i }));
      const link = screen.getByRole("menuitem", { name: /go/i });
      expect(link).toHaveAttribute("href", "/somewhere");
      await user.click(link);
      expect(customNavigate).toHaveBeenCalledWith("/somewhere");
      // the provider's router runs too, on the unresolved href
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

    it("should prepend a base path to a <Menu.Item /> href", async () => {
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
        vi.fn(),
        (href) => `/base${href}`,
      );
      await user.click(screen.getByRole("button", { name: /open/i }));
      expect(screen.getByRole("menuitem", { name: /go/i })).toHaveAttribute(
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

const customNavigate = vi.fn();

/** Stands in for a link component such as `next/link`. */
function CustomLink({
  href,
  children,
  ...linkProps
}: ComponentProps<"a"> & { href: string }) {
  return (
    <a
      {...linkProps}
      href={href}
      onClick={(e) => {
        e.preventDefault();
        customNavigate(href);
      }}
    >
      {children}
    </a>
  );
}

/**
 * Stands in for a link component that chains the `onClick` it's handed before
 * navigating, the way `next/link` does. Anything merged onto it by Easy UI runs
 * on the click, so a component that means to hand navigation off to the link
 * component has to keep its own handlers off it in the first place.
 */
function ChainingLink({
  href,
  children,
  onClick,
  ...linkProps
}: ComponentProps<"a"> & { href: string }) {
  return (
    <a
      {...linkProps}
      href={href}
      onClick={(e) => {
        onClick?.(e);
        e.preventDefault();
        customNavigate(href);
      }}
    >
      {children}
    </a>
  );
}

function searchNavWithCTA() {
  return (
    <SearchNav>
      <SearchNav.LogoGroup>
        <SearchNav.Logo>
          <img alt="some logo" />
        </SearchNav.Logo>
      </SearchNav.LogoGroup>
      <SearchNav.CTAGroup>
        <SearchNav.SecondaryCTAItem
          key="Docs"
          label="Docs"
          href="/somewhere"
          routerOptions={routerOptions}
        />
      </SearchNav.CTAGroup>
    </SearchNav>
  );
}

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
