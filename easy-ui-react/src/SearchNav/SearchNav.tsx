import React, { ReactElement, ReactNode, useMemo } from "react";
import { classNames } from "../utilities/css";
import {
  flattenChildren,
  filterChildrenByDisplayName,
  getDisplayNameFromReactNode,
} from "../utilities/react";
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
import { EmphasizedText } from "./EmphasizedText";

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
*        <SearchNav.SecondaryCTAItem symbol={Campaign} key="Campaign" label="Optional" />
*        <SearchNav.SecondaryCTAItem symbol={Help} key="Help" label="Optional" />
*        <SearchNav.SecondaryCTAItem
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
export function SearchNav<T>(props: SearchNavProps<T>) {
  const { menuOverlayProps, ctaMenuSymbol, children } = props;

  const { onlyLogoGroup, context } = useMemo(() => {
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
    const logo = logoGroupChildren[0];

    let emphasizedText;
    if (
      logoGroupChildren.length > 1 &&
      getDisplayNameFromReactNode(logoGroupChildren[1]) ===
        "SearchNav.EmphasizedText"
    ) {
      emphasizedText = logoGroupChildren[1];
    }

    let selector;
    let selectorChildren;
    let selectorLabel = "";
    if (
      logoGroupChildren.length > 1 &&
      getDisplayNameFromReactNode(
        logoGroupChildren[logoGroupChildren.length - 1],
      ) === "SearchNav.Selector"
    ) {
      selector = logoGroupChildren[logoGroupChildren.length - 1];
      const selectorElem = selector as ReactElement;
      const { "aria-label": label } = selectorElem.props;
      selectorLabel = label;
      selectorChildren = flattenChildren(selectorElem.props.children);
    }

    let search;
    if (
      topLevelChildren.length > 1 &&
      getDisplayNameFromReactNode(topLevelChildren[1]) === "SearchNav.Search"
    ) {
      const searchChildren = flattenChildren(topLevelChildren[1]);
      if (searchChildren.length === 1) {
        search = searchChildren[0];
      }
    }

    let secondaryCTAItems;
    let primaryCTAItem;
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
      secondaryCTAItems = filterChildrenByDisplayName(
        ctaGroupElement.props.children,
        "SearchNav.SecondaryCTAItem",
      );
      const primaryCTAItemArr = filterChildrenByDisplayName(
        ctaGroupElement.props.children,
        "SearchNav.PrimaryCTAItem",
      );

      if (primaryCTAItemArr.length > 1) {
        throw new Error(
          "SearchNav.CTAGroup can support at most one SearchNav.PrimaryCTAItem.",
        );
      }
      if (primaryCTAItemArr.length !== 0) {
        primaryCTAItem = primaryCTAItemArr[0];
      }
    }

    const onlyLogoGroup = !hasCtaGroup && search === undefined;

    return {
      onlyLogoGroup,
      context: {
        logo,
        emphasizedText,
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
 * Represents <SearchNav.EmphasizedText />`.
 *
 * @remarks
 * Renders emphasized text.
 */
SearchNav.EmphasizedText = EmphasizedText;

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
