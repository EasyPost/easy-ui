# `SearchNav` Component Specification

## Overview

A `SearchNav` is a navigation bar focused on handling dense information interactions.

### Use Cases

- Use on a docs page where users can leverage a dropdown, a seach input, and CTAs to find information.

### Features

- On small devices, the navigation bar collapses where options become accessible via a left aligned hamburger menu and the search input becomes accessible via a right aligned clickbale search icon.
- If applicable, consumers are to provide a search input.

---

## Design

`SearchNav` will be made up of sub-component containers. At the top level, the `SearchNav` serves as the container for the logo, dropdown, search input, and CTAs. The logo and dropdown will be grouped into a `SearchNav.LogoGroup` container. The search input will be wrapped by a `SearchNav.Search` container. The CTAs will be wrapped by a `SearchNav.CTAGroup` container.

`SearchNav.LogoGroup` will be comprised of `SearchNav.Logo`, a minimal wrapper for the consumer provided logo, and `SearchNav.Selector`. `SearchNav.Selector` will be built using React Aria's `useSelect`, `useListBox`, `usePopover`, `useOption` and `HiddenSelect`. To help manage state, it will also rely on React Stately's `useSelectState`.

`SearchNav.CTAGroup` will render individual CTAs via `SearchNav.CTAItem`, which will make use of Easy UI's `UnstyledButton` component.

`SearchNav` will also need to handle a unique configuration for smaller devices. Although it won't be exposed to consumers directly,this will be accomplished via a `SearchNavMobile` component, which will be responsible for rendering a clickable hamburger and search icon. The hamburger icon will effectively be a trigger to render a menu comprised of `SearchNav.Selector` and the CTAs in `SearchNav.CTAGroup`. The clickable search icon will render the contents of `SearchNav.Search` and a right aligned close button.

### API

```ts
export type SearchNavOverlayMenuProps<T> = Omit<
  MenuOverlayProps<T>,
  "children" | "maxItemsUntilScroll" | "placement" | "width"
>;

export type SearchNavProps<T> = {
  /**
   * Overlay props that apply to condensed menu configurations. Note that
   * the keys defined in <SearchNav> will be preserved.
   */
  menuOverlayProps?: SearchNavOverlayMenuProps<T>;
  /**
   * Symbol for collapsed CTA menu, symbol SVG source from @easypost/easy-ui-icons.
   */
  ctaMenuSymbol?: IconSymbol;
  /**
   * The children of the <SearchNav> element. Should render `<SearchNav.LogoGroup>`,
   * `<SearchNav.Search>`, and `<SearchNav.CTAGroup>`
   */
  children: ReactNode;
};

type LogoGroupProps = {
  /**
   * The children of the <SearchNav.LogoGroup> element. Should render `<SearchNav.Logo>`
   * and `<SearchNav.Selector>`
   */
  children: ReactNode;
};

type LogoProps = {
  /**
   * The children of the <SearchNav.Logo> element. Should render passed in content from
   * user. Although it is content agnostic, it should be passed a logo or similar branding asset.
   */
  children: ReactNode;
};

export type SelectorProps<T> = AriaSelectProps<T> &
  BaseSelectProps<T> & {
    /**
     * Hidden label that applies to expanded <SearchNav.Select> and will
     * become aria-label to apply to <Menu.Section> when <SearchNav>
     * collapses.
     */
    label: string;
  };

export type CTAGroupProps = {
  /**
   * The children of the <SearchNav.CTAGroup> element. Should include <SearchNav.CTAItem> elements.
   */
  children: ReactNode;
};

export type CTAItemProps = AriaButtonProps<"button"> & {
  /**
   * Icon symbol SVG source from @easypost/easy-ui-icons.
   */
  symbol?: IconSymbol;
  /**
   * Text content to display.
   */
  label: string;
  /**
   * Hides label on desktop.
   */
  hideLabelOnDesktop?: boolean;
  /**
   * Key to link to <Menu.Item />
   */
  key: Key;
};
```

### Example Usage

_Basic usage:_

```tsx
import { SearchComponent } from "library";
import { SearchNav } from "@easypost/easy-ui/SearchNav";
import Campaign from "@easypost/easy-ui-icons/Campaign";
import Help from "@easypost/easy-ui-icons/Help";
import Brightness5 from "@easypost/easy-ui-icons/Brightness5";
import React from "react";

function App() {
  const [selectedOption, setSelectedOption] = React.useState("V1.0");

  return (
    <SearchNav
      menuOverlayProps={{
        onAction: (key) => {},
        disabledKeys: ["V99.99"],
      }}
    >
      <SearchNav.LogoGroup>
        <SearchNav.Logo>
          <img alt="some logo" />
        </SearchNav.Logo>
        <SearchNav.Selector
          label="docs version"
          defaultSelectedKey="V1.0"
          disabledKeys={["V99.99"]}
          selectedKey={selectedOption}
          onSelectionChange={(selected) => setSelectedOption(selected)}
        >
          <SearchNav.Option key="V1.0">V1.0</SearchNav.Option>
          <SearchNav.Option key="V1.1">V1.1</SearchNav.Option>
          <SearchNav.Option key="V99.99">V99.99</SearchNav.Option>
        </SearchNav.Selector>
      </SearchNav.LogoGroup>
      <SearchNav.Search>
        <SearchComponent />
      </SearchNav.Search>
      <SearchNav.CTAGroup>
        <SearchNav.CTAItem symbol={Campaign} key="Campaign" label="Optional" />
        <SearchNav.CTAItem symbol={Help} key="Help" label="Optional" />
        <SearchNav.CTAItem
          symbol={Brightness5}
          key="Brightness"
          label="Toggle theme"
          hideLabelOnDesktop
        />
      </SearchNav.CTAGroup>
    </SearchNav>
  );
}
```
