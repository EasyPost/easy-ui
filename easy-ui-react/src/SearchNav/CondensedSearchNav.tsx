import React, { useState, ReactElement } from "react";
import Close from "@easypost/easy-ui-icons/Close";
import MenuSymbol from "@easypost/easy-ui-icons/Menu";
import Search from "@easypost/easy-ui-icons/Search";
import { Menu } from "../Menu";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";
import { Icon } from "../Icon";
import { classNames } from "../utilities/css";
import { useInternalSearchNavContext } from "./context";

import styles from "./CondensedSearchNav.module.scss";

/**
 * @privateRemarks
 * Renders a left aligned menu button and right aligned search button.
 * The menu options come from `SearchNav.Selector` and `SearchNav.CTAGroup`.
 * On small screens, this effectively replaces `SearchNav`.
 */
export function CondensedSearchNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const {
    searchNode,
    selectChildren,
    ctaGroupChildren,
    selectLabel,
    menuOverlayProps,
  } = useInternalSearchNavContext();

  const hasMenuToShow = !!selectChildren || !!ctaGroupChildren;
  const hasSearchToShow = searchNode !== null;

  return (
    <div className={classNames(styles.condensed)}>
      {!isSearchOpen && hasMenuToShow ? (
        <>
          <Menu isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <Menu.Trigger>
              <UnstyledButton
                className={classNames(
                  styles.btn,
                  styles.menuBtn,
                  isMenuOpen && styles.menuOpen,
                )}
              >
                <Icon symbol={MenuSymbol} />
                <Text visuallyHidden>menu</Text>
              </UnstyledButton>
            </Menu.Trigger>
            <Menu.Overlay placement="bottom left" {...menuOverlayProps}>
              <Menu.Section aria-label={selectLabel}>
                {selectChildren?.map((item) => {
                  const itemEle = item as ReactElement;
                  const keyAsString = itemEle.key as string;
                  const originalKey = keyAsString.substring(2);
                  return (
                    <Menu.Item key={originalKey || itemEle.key}>
                      {itemEle.props.children}
                    </Menu.Item>
                  );
                })}
              </Menu.Section>
              <Menu.Section aria-label="Nav actions">
                {ctaGroupChildren?.map((item) => {
                  const itemEle = item as ReactElement;
                  const keyAsString = itemEle.key as string;
                  const originalKey = keyAsString.substring(2);
                  return (
                    <Menu.Item
                      key={originalKey || itemEle.key}
                      href={itemEle.props.href}
                      target={itemEle.props.target}
                    >
                      {itemEle.props.label}
                    </Menu.Item>
                  );
                })}
              </Menu.Section>
            </Menu.Overlay>
          </Menu>
          {searchNode && (
            <UnstyledButton
              className={classNames(styles.btn, styles.searchBtn)}
              onPress={() => setIsSearchOpen((prev) => !prev)}
            >
              <Icon symbol={Search} />
              <Text visuallyHidden>search</Text>
            </UnstyledButton>
          )}
        </>
      ) : (
        hasSearchToShow && (
          <div className={classNames(styles.condensedSearch)}>
            {searchNode}
            <UnstyledButton
              className={classNames(styles.btn)}
              onPress={() => setIsSearchOpen((prev) => !prev)}
            >
              <Icon symbol={Close} size="xs" />
            </UnstyledButton>
          </div>
        )
      )}
    </div>
  );
}
