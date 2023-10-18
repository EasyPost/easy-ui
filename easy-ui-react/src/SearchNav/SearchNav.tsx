import React, { ReactElement, ReactNode, useMemo } from "react";
import { classNames } from "../utilities/css";
import {
  flattenChildren,
  getDisplayNameFromReactNode,
} from "../utilities/react";
import styles from "./SearchNav.module.scss";
import { LogoGroup } from "./LogoGroup";
import { Search } from "./Search";
import { CTAGroup } from "./CTAGroup";
import { Logo } from "./Logo";
import { CTAItem } from "./CTAItem";
import { Selector } from "./Selector";
import { MenuOverlayProps } from "../Menu/MenuOverlay";
import { CondensedSearchNav } from "./CondensedSearchNav";
import { SelectOption } from "../Select/SelectOption";
import { InternalSearchNavContext } from "./context";
import { IconSymbol } from "../types";

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
*        <SearchNav.CTAItem symbol={Campaign} key="Campaign" label="Optional" />
*        <SearchNav.CTAItem symbol={Help} key="Help" label="Optional" />
*        <SearchNav.CTAItem
*          symbol={Brightness5}
*          key="Brightness"
*          label="Toggle theme"
*          hideLabelOnDesktop
*        />
*      </SearchNav.CTAGroup>
*    </SearchNav>
*  );
* }
```
 */
export function SearchNav<T extends object>(props: SearchNavProps<T>) {
  const { menuOverlayProps, ctaMenuSymbol, children } = props;

  const context = useMemo(() => {
    const topLevelChildren = flattenChildren(children);

    const logoGroupDisplayName = getDisplayNameFromReactNode(
      topLevelChildren[0],
    );

    if (logoGroupDisplayName !== "SearchNav.LogoGroup") {
      throw new Error("SearchNav must contain SearchNav.LogoGroup.");
    }
    const logoGroupElement = topLevelChildren[0] as ReactElement;
    const logoGroupChildren = flattenChildren(logoGroupElement.props.children);
    const logoDisplayName = getDisplayNameFromReactNode(logoGroupChildren[0]);
    if (logoDisplayName !== "SearchNav.Logo") {
      throw new Error("SearchNav.LogoGroup must contain SearchNav.Logo.");
    }

    let selectChildren;
    let selectLabel = "";
    if (
      logoGroupChildren.length === 2 &&
      getDisplayNameFromReactNode(logoGroupChildren[1]) === "SearchNav.Selector"
    ) {
      const selectElement = logoGroupChildren[1] as ReactElement;
      selectLabel = selectElement.props.label;
      selectChildren = flattenChildren(selectElement.props.children);
    }

    let searchNode;
    if (
      topLevelChildren.length > 1 &&
      getDisplayNameFromReactNode(topLevelChildren[1]) === "SearchNav.Search"
    ) {
      const searchChildren = flattenChildren(topLevelChildren[1]);
      if (searchChildren.length === 1) {
        searchNode = searchChildren[0];
      }
    }

    let ctaGroupChildren;
    let hasCtaGroup = false;
    if (
      topLevelChildren.length > 1 &&
      getDisplayNameFromReactNode(
        topLevelChildren[topLevelChildren.length - 1],
      ) === "SearchNav.CTAGroup"
    ) {
      const ctaGroupElement = topLevelChildren[
        topLevelChildren.length - 1
      ] as ReactElement;
      hasCtaGroup = true;
      ctaGroupChildren = flattenChildren(ctaGroupElement.props.children);
    }

    const onlyLogoGroup = !hasCtaGroup && searchNode === undefined;

    return {
      selectChildren,
      ctaGroupChildren,
      searchNode,
      onlyLogoGroup,
      menuOverlayProps,
      selectLabel,
      ctaMenuSymbol,
    };
  }, [children, menuOverlayProps, ctaMenuSymbol]);

  const { onlyLogoGroup } = context;

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

SearchNav.displayName = "SearchNav";

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
 * Should be used as a wrapper for `<SearchNav.CTAItem />`
 */
SearchNav.CTAGroup = CTAGroup;

/**
 * Represents <SearchNav.CTAItem />`.
 *
 * @remarks
 * Renders individual CTAs as buttons.
 */
SearchNav.CTAItem = CTAItem;

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
