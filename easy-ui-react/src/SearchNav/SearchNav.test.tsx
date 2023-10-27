import { act, screen } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import Campaign from "@easypost/easy-ui-icons/Campaign";
import Help from "@easypost/easy-ui-icons/Help";
import Brightness5 from "@easypost/easy-ui-icons/Brightness5";
import React from "react";
import { vi } from "vitest";
import { mockGetComputedStyle, render } from "../utilities/test";
import { SearchNav } from "./SearchNav";

describe("<SearchNav />", () => {
  let restoreGetComputedStyle: () => void;

  beforeEach(() => {
    restoreGetComputedStyle = mockGetComputedStyle();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    restoreGetComputedStyle();
  });

  it("should render a SearchNav", () => {
    render(getSearchNav({}));
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("should throw an error when SearchNav.LogoGroup is missing", () => {
    expect(() => render(getSearchNavWithoutLogoGroup())).toThrow(
      "SearchNav must contain SearchNav.LogoGroup.",
    );
  });

  it("should support rendering SearchNav.Logo", () => {
    render(getSearchNav({}));
    expect(screen.getByAltText("some logo")).toBeInTheDocument();
  });

  it("should throw an error when SearchNav.Logo is missing", () => {
    expect(() => render(getSearchNavWithoutLogo())).toThrow(
      "SearchNav.LogoGroup must contain SearchNav.Logo.",
    );
  });

  it("should support rendering Search.EmphasizedText with appropriate styles", () => {
    render(getSearchNav({}));
    const emphasizedText = screen.getByText("DOCS");
    expect(emphasizedText).toBeInTheDocument();
    expect(emphasizedText).toHaveAttribute(
      "class",
      expect.stringContaining("subtitle1"),
    );
  });

  it("should support SearchNav.Selector being controlled", async () => {
    const handleSelectionChange = vi.fn();
    const { user } = render(
      getSearchNav({
        selectorProps: { onSelectionChange: handleSelectionChange },
      }),
    );
    await clickElement(user, screen.getByTestId("trigger"));
    await clickElement(user, screen.queryAllByRole("option")[0]);
    expect(handleSelectionChange).toHaveBeenCalledTimes(1);
  });

  it("should support tab triggering SearchNav.Selector", async () => {
    const { user } = render(getSearchNav({}));
    await tabToAndEnterKeySelectTrigger(user);
    expect(
      screen.getByRole("group", { name: "docs version" }),
    ).toBeInTheDocument();
  });

  it("should support rendering a search input", () => {
    render(getSearchNav({}));
    expect(screen.getByLabelText("search")).toBeInTheDocument();
  });

  it("should support expanding the SearchNav.CTAGroup menu", async () => {
    const { user } = render(getSearchNav({}));
    const menuBtn = screen.getByRole("button", { name: "menu" });
    expect(menuBtn).toBeInTheDocument();
    await clickElement(user, menuBtn);
    expect(menuBtn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("should support rendering SearchNav.PrimaryCTAItem", () => {
    render(getSearchNav({}));
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("should throw an error when more than one SearchNav.PrimaryCTAItem is provided", () => {
    expect(() => render(getSearchNavWithMultiplePrimaryCTAItems())).toThrow(
      "SearchNav.CTAGroup can support at most one SearchNav.PrimaryCTAItem.",
    );
  });
});

function getSearchNavWithMultiplePrimaryCTAItems() {
  return (
    <SearchNav>
      <SearchNav.LogoGroup>
        <SearchNav.Logo>
          <img alt="some logo" />
        </SearchNav.Logo>
      </SearchNav.LogoGroup>
      <SearchNav.CTAGroup>
        <SearchNav.SecondaryCTAItem
          symbol={Campaign}
          key="Campaign"
          label="Optional"
        />
        <SearchNav.PrimaryCTAItem label="Sign up" />
        <SearchNav.PrimaryCTAItem label="example" />
      </SearchNav.CTAGroup>
    </SearchNav>
  );
}

function getSearchNavWithoutLogoGroup() {
  return <SearchNav>example</SearchNav>;
}

function getSearchNavWithoutLogo() {
  return (
    <SearchNav>
      <SearchNav.LogoGroup>example</SearchNav.LogoGroup>
    </SearchNav>
  );
}

function getSearchNav({ selectorProps = {} }) {
  return (
    <SearchNav>
      <SearchNav.LogoGroup>
        <SearchNav.Logo>
          <img alt="some logo" />
        </SearchNav.Logo>
        <SearchNav.EmphasizedText>DOCS</SearchNav.EmphasizedText>
        <SearchNav.Selector
          aria-label="docs version"
          defaultSelectedKey="V1.0"
          {...selectorProps}
        >
          <SearchNav.Option key="V1.0">V1.0</SearchNav.Option>
          <SearchNav.Option key="V1.1">V1.1</SearchNav.Option>
          <SearchNav.Option key="V99.99">V99.99</SearchNav.Option>
        </SearchNav.Selector>
      </SearchNav.LogoGroup>
      <SearchNav.Search>
        <input type="search" aria-label="search" />
      </SearchNav.Search>
      <SearchNav.CTAGroup>
        <SearchNav.SecondaryCTAItem
          symbol={Campaign}
          key="Campaign"
          label="Optional"
        />
        <SearchNav.SecondaryCTAItem symbol={Help} key="Help" label="Optional" />
        <SearchNav.SecondaryCTAItem
          symbol={Brightness5}
          key="Brightness"
          label="Toggle theme"
          hideLabelOnDesktop
        />
        <SearchNav.PrimaryCTAItem label="Sign up" />
      </SearchNav.CTAGroup>
    </SearchNav>
  );
}

async function clickElement(user: UserEvent, el: HTMLElement) {
  await act(async () => {
    await user.click(el);
    vi.runAllTimers();
  });
}

async function tabToAndEnterKeySelectTrigger(user: UserEvent) {
  await act(async () => {
    await user.tab();
    await user.keyboard("{enter}");
    vi.runAllTimers();
  });
}
