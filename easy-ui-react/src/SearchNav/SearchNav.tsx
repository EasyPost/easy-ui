import React, { ReactNode, useMemo } from "react";
import { classNames } from "../utilities/css";
import { flattenChildren } from "../utilities/react";
import styles from "./SearchNav.module.scss";
import { LogoGroup } from "./LogoGroup";
import { Search } from "./Search";
import { CTAGroup } from "./CTAGroup";
import { Logo } from "./Logo";
import { SecondaryCTAItem } from "./SecondaryCTAItem";
import { Selector } from "./Selector";
import { MenuOverlayProps } from "../Menu/MenuOverlay";
import { CondensedSearchNav } from "./CondensedSearchNav";
import { SelectOption } from "../Select/SelectOption";
import { InternalSearchNavContext } from "./context";
import { IconSymbol } from "../types";
import { PrimaryCTAItem } from "./PrimaryCTAItem";
import { Title } from "./Title";
import {
  getSearchChildren,
  getCTAGroupChildren,
  getLogoGroupChildren,
  getSelectorLabel,
} from "./utilities";

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

/**
 * The `<SearchNav />` component is a navigation bar focused on handling dense information interactions.
 *
 * @remarks
 * Use on a docs page where users can leverage a dropdown, a seach input, and CTAs to find information.
 * `<SearchNav.LogoGroup />` and `<SearchNav.Logo />` are required. 
 *
 * @example
 * _Full nav bar:_
*```tsx
* import { SearchComponent } from "library";
* import { SearchNav } from "@easypost/easy-ui/SearchNav";
* import Campaign from "@easypost/easy-ui-icons/Campaign";
* import Help from "@easypost/easy-ui-icons/Help";
* import Brightness5 from "@easypost/easy-ui-icons/Brightness5";
* import React from "react";
*
* function App() {
* const [selectedOption, setSelectedOption] = React.useState("V1.0");
*
*  return (
*    <SearchNav
*      menuOverlayProps={{
*        onAction: (key) => {},
*        disabledKeys: ["V99.99"],
*      }}
*    >
*      <SearchNav.LogoGroup>
*        <SearchNav.Logo>
*          <img alt="some logo" />
*        </SearchNav.Logo>
*        <SearchNav.Title>Docs</SearchNav.Title>
*        <SearchNav.Selector
*          label="docs version"
*          defaultSelectedKey="V1.0"
*          disabledKeys={["V99.99"]}
*          selectedKey={selectedOption}
*          onSelectionChange={(selected) => setSelectedOption(selected)}
*        >
*          <SearchNav.Option key="V1.0">V1.0</SearchNav.Option>
*          <SearchNav.Option key="V1.1">V1.1</SearchNav.Option>
*          <SearchNav.Option key="V99.99">V99.99</SearchNav.Option>
*        </SearchNav.Selector>
*      </SearchNav.LogoGroup>
*      <SearchNav.Search>
*        <SearchComponent />
*      </SearchNav.Search>
*      <SearchNav.CTAGroup>
*        <SearchNav.SecondaryCTAItem symbol={Campaign} key="Campaign" label="Optional" />
*        <SearchNav.SecondaryCTAItem symbol={Help} key="Help" label="Optional" />
*        <SearchNav.SecondaryCTAItem
*          symbol={Brightness5}
*          key="Brightness"
*          label="Toggle theme"
*          hideLabelOnDesktop
*        />
*        <SearchNav.PrimaryCTAItem
*          label="Sign up"
*        />
*      </SearchNav.CTAGroup>
*    </SearchNav>
*  );
* }
```
 */
export function SearchNav<T>(props: SearchNavProps<T>) {
  const { menuOverlayProps, ctaMenuSymbol, children } = props;

  const { onlyLogoGroup, context } = useMemo(() => {
    // To support the various configurations on smaller screens,
    // we extract data and nodes from the components provided
    // by consumers and use context to share them efficiently.
    const topLevelChildren = flattenChildren(children);

    const { logo, title, selector, selectorChildren } = getLogoGroupChildren(
      topLevelChildren[0],
    );
    const selectorLabel = getSelectorLabel(selector);

    const search =
      topLevelChildren.length > 1
        ? getSearchChildren(topLevelChildren[1])
        : undefined;

    const { secondaryCTAItems, primaryCTAItem } = getCTAGroupChildren(
      topLevelChildren[topLevelChildren.length - 1],
    );

    const onlyLogoGroup =
      secondaryCTAItems === undefined &&
      primaryCTAItem === undefined &&
      search === undefined;

    return {
      onlyLogoGroup,
      context: {
        logo,
        title,
        selector,
        selectorChildren,
        secondaryCTAItems,
        primaryCTAItem,
        search,
        menuOverlayProps,
        selectorLabel,
        ctaMenuSymbol,
      },
    };
  }, [children, menuOverlayProps, ctaMenuSymbol]);

  return (
    <InternalSearchNavContext.Provider value={context}>
      <nav className={classNames(styles.nav)}>
        <div
          className={classNames(
            styles.desktop,
            onlyLogoGroup && styles.onlyLogoGroup,
          )}
        >
          {children}
        </div>
        {!onlyLogoGroup && <CondensedSearchNav />}
      </nav>
    </InternalSearchNavContext.Provider>
  );
}

/**
 * Represents <SearchNav.LogoGroup />`.
 *
 * @remarks
 * Should be used as a wrapper for `<SearchNav.Logo />` and
 * as `<SearchNav.Selector />`
 */
SearchNav.LogoGroup = LogoGroup;

/**
 * Represents <SearchNav.Logo />`.
 *
 * @remarks
 * Should be used as a wrapper for a branding asset.
 */
SearchNav.Logo = Logo;

/**
 * Represents <SearchNav.Title />`.
 *
 * @remarks
 * Renders emphasized text.
 */
SearchNav.Title = Title;

/**
 * Represents <SearchNav.Selector />`.
 *
 * @remarks
 * The actual selector itself, should be used as a
 * wrapper for <SearchNav.Option />`
 */
SearchNav.Selector = Selector;

/**
 * Represents <SearchNav.Option />`.
 *
 * @remarks
 * Renders options for the selector.
 */
SearchNav.Option = SelectOption;

/**
 * Represents <SearchNav.Search />`.
 *
 * @remarks
 * Should be used as a wrapper for a custom search input.
 */
SearchNav.Search = Search;

/**
 * Represents <SearchNav.CTAGroup />`.
 *
 * @remarks
 * Should be used as a wrapper for `<SearchNav.SecondaryCTAItem />`
 */
SearchNav.CTAGroup = CTAGroup;

/**
 * Represents <SearchNav.PrimaryCTAItem />`.
 *
 * @remarks
 * Renders individual CTAs as buttons.
 */
SearchNav.PrimaryCTAItem = PrimaryCTAItem;

/**
 * Represents <SearchNav.SecondaryCTAItem />`.
 *
 * @remarks
 * Renders individual CTAs as buttons.
 */
SearchNav.SecondaryCTAItem = SecondaryCTAItem;
