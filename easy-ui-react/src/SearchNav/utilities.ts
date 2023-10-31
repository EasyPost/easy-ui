import { ReactElement, ReactNode } from "react";
import {
  getDisplayNameFromReactNode,
  filterChildrenByDisplayName,
  flattenChildren,
} from "../utilities/react";

export function getLogoGroupChildren(logoGroup: ReactNode) {
  const logoGroupDisplayName = getDisplayNameFromReactNode(logoGroup);

  if (logoGroupDisplayName !== "SearchNav.LogoGroup") {
    throw new Error("SearchNav must contain SearchNav.LogoGroup.");
  }
  const logoGroupElement = logoGroup as ReactElement;
  const logoGroupChildren = flattenChildren(logoGroupElement.props.children);
  const logoDisplayName = getDisplayNameFromReactNode(logoGroupChildren[0]);
  if (logoDisplayName !== "SearchNav.Logo") {
    throw new Error("SearchNav.LogoGroup must contain SearchNav.Logo.");
  }
  const logo = logoGroupChildren[0];

  let title;
  if (
    logoGroupChildren.length > 1 &&
    getDisplayNameFromReactNode(logoGroupChildren[1]) === "SearchNav.Title"
  ) {
    title = logoGroupChildren[1];
  }

  let selector;
  let selectorChildren;
  if (
    logoGroupChildren.length > 1 &&
    getDisplayNameFromReactNode(
      logoGroupChildren[logoGroupChildren.length - 1],
    ) === "SearchNav.Selector"
  ) {
    selector = logoGroupChildren[logoGroupChildren.length - 1];
    const selectorElem = selector as ReactElement;
    selectorChildren = flattenChildren(selectorElem.props.children);
  }

  return {
    logo,
    title,
    selector,
    selectorChildren,
  };
}

export function getSearchChildren(searchParent: ReactNode) {
  let search;
  if (getDisplayNameFromReactNode(searchParent) === "SearchNav.Search") {
    const searchChildren = flattenChildren(searchParent);
    if (searchChildren.length === 1) {
      search = searchChildren[0];
    }
  }
  return search;
}

export function getCTAGroupChildren(ctaGroup: ReactNode) {
  let secondaryCTAItems;
  let primaryCTAItem;
  if (getDisplayNameFromReactNode(ctaGroup) === "SearchNav.CTAGroup") {
    const ctaGroupElement = ctaGroup as ReactElement;
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

  return {
    secondaryCTAItems,
    primaryCTAItem,
  };
}

export function getSelectorLabel(selector: ReactNode) {
  let selectorLabel;
  if (selector) {
    const selectorElem = selector as ReactElement;
    const { "aria-label": label } = selectorElem.props;
    selectorLabel = label;
  }
  return selectorLabel;
}
