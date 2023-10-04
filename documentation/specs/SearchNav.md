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

`SearchNav` will be made up of sub-component containers. At the top level, the `SearchNav` serves as the container for the logo, dropdown, search input, and CTAs. The logo and dropdown will be grouped into a `SearchNav.LogoOptions` container. The search input will be wrapped by a `SearchNav.Search` container. The CTAs will be wrapped by a `SearchNav.CTAGroup` container.

`SearchNav.LogoOptions` will be comprised of `SearchNav.Logo`, a minimal wrapper for the consumer provided logo, and `SearchNav.Select`. `SearchNav.Select` will be built using React Aria's `useSelect`, `useListBox`, `usePopover`, `useOption` and `HiddenSelect`. To help manage state, it will also rely on React Stately's `useSelectState`.

`SearchNav.CTAGroup` will render individual CTAs via `SearchNav.CTAItem`, which will make use of Easy UI's `UnstyledButton` component.

`SearchNav` will also need to handle a unique configuration for smaller devices. Although it won't be exposed to consumers directly,this will be accomplished via a `SearchNavMobile` component, which will be responsible for rendering a clickable hamburger and search icon. The hamburger icon will effectively be a trigger to render a menu comprised of `SearchNav.Select` and the CTAs in `SearchNav.CTAGroup`. The clickable search icon will render the contents of `SearchNav.Search` and a right aligned close button.

### API

```ts
type SearchNavProps = {
  /**
   * The children of the <SearchNav> element. Should render `<SearchNav.LogoOptions>`,
   * `<SearchNav.Search>`, and `<SearchNav.CTAGroup>`
   */
  children: ReactNode;
};

type LogoOptionsProps = {
  /**
   * The children of the <SearchNav.LogoOptions> element. Should render `<SearchNav.Logo>`
   * and `<SearchNav.Select>`
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

type SelectProps<T> = AriaSelectProps<T> & {
  /**
   * Method that is called when the open state of the select changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Sets the open state of the select field.
   * @default false
   */
  isOpen?: boolean;
  /**
   * The currently selected key in the collection (controlled).
   */
  selectedKey?: Key | null;
  /**
   * The initial selected key in the collection (uncontrolled).
   */
  defaultSelectedKey?: Key;
  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange?: (key: Key) => void;
  /**
   * The contents of the collection.
   */
  children: CollectionChildren<T>;
  /**
   * The option keys that are disabled. These options cannot be selected, focused, or otherwise interacted with.
   */
  disabledKeys?: Iterable<Key>;
};

type CTAGroupProps = {
  /**
   * The children of the <SearchNav.CTAGroup> element. Should include <SearchNav.CTAItem> elements.
   */
  children: ReactNode;
};

type CTAItem = AriaButtonProps & {
  /**
   * Icon symbol SVG source from @easypost/easy-ui-icons.
   */
  symbol?: IconSymbol;
  /**
   * Contents of CTA
   */
  children?: ReactNode;
};
```

### Example Usage

_Basic usage:_

```tsx
import { SearchComponent } from "library";
import { SearchNav } from "@easypost/easy-ui/SearchNav";
import Radar from "@easypost/easy-ui-icons/Radar";
import Help from "@easypost/easy-ui-icons/Help";
import Info from "@easypost/easy-ui-icons/Info";

function App() {
  const [selectedOption, setSelectedOption] = React.useState("V1.0");

  const handlePress = () => {};

  return (
    <SearchNav>
      <SearchNav.LogoOptions>
        <SearchNav.Logo>
          <a href="/">
            <img src="img-src-path" />
          </a>
        </SearchNav.Logo>
        <SearchNav.Select
          aria-label="doc version"
          selectedKey={selectedOption}
          onSelectionChange={(selected) => setSelectedOption(selected)}>
          <SearchNav.SelectOption key="V1.0">V1.0</SearchNav.SelectOption>
          <SearchNav.SelectOption key="V1.1">V1.1</SearchNav.SelectOption>
          <SearchNav.SelectOption key="V1.2">V1.2</SearchNav.SelectOption>
        </SearchNav.Select>
      </SearchNav.LogoOptions>
      <SearchNav.Search>
        <SearchComponent>
      </SearchNav.Search>
      <SearchNav.CTAGroup>
        <SearchNav.CTAItem symbol={Radar} href="https://www.easypoststatus.com/">
          Status
        </SearchNav.CTAItem>
        <SearchNav.CTAItem symbol={Help} href="https://support.easypost.com/hc/en-us">
          Support
        </SearchNav.CTAItem>
        <SearchNav.CTAItem symbol={Info} onPress={() => handlePress()} />
      </SearchNav.CTAGroup>
    </SearchNav>
  );
}
```
