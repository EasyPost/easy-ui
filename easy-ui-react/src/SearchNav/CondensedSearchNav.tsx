import React, { useState, ReactElement } from "react";
import Close from "@easypost/easy-ui-icons/Close";
import MenuSymbol from "@easypost/easy-ui-icons/Menu";
import Search from "@easypost/easy-ui-icons/Search";
import { Menu } from "../Menu";
import { HorizontalStack } from "../HorizontalStack";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";
import { Icon } from "../Icon";
import { classNames } from "../utilities/css";
import { useInternalSearchNavContext } from "./context";
import { LogoGroup } from "./LogoGroup";

import styles from "./CondensedSearchNav.module.scss";
import { getFlattenedKey } from "../utilities/react";

/**
 * @privateRemarks
 * Renders a left aligned menu button and right aligned search button.
 * The menu options come from `<SearchNav.Selector>` and `<SearchNav.CTAGroup>`.
 * On small screens, this effectively replaces `<SearchNav>`.
 */
export function CondensedSearchNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const {
    search,
    selectorChildren,
    secondaryCTAItems,
    primaryCTAItem,
    selectorLabel,
    menuOverlayProps,
    condensedBehavior,
  } = useInternalSearchNavContext();

  const hasMenuToShow = !!selectorChildren || !!secondaryCTAItems;

  return (
    <div className={classNames(styles.condensed)}>
      {isSearchOpen ? (
        <div className={classNames(styles.condensedSearch)}>
          {search}
          <UnstyledButton
            className={classNames(styles.btn)}
            onPress={() => setIsSearchOpen((prev) => !prev)}
          >
            <Icon symbol={Close} size="xs" />
          </UnstyledButton>
        </div>
      ) : (
        <>
          {condensedBehavior === "collapse-to-menu" && hasMenuToShow ? (
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
                <Menu.Section aria-label={selectorLabel}>
                  {selectorChildren?.map((item) => {
                    const itemEle = item as ReactElement;
                    return (
                      <Menu.Item key={getFlattenedKey(itemEle.key)}>
                        {itemEle.props.children}
                      </Menu.Item>
                    );
                  })}
                </Menu.Section>
                <Menu.Section aria-label="Nav actions">
                  {secondaryCTAItems?.map((item) => {
                    const itemEle = item as ReactElement;
                    return (
                      <Menu.Item
                        key={getFlattenedKey(itemEle.key)}
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
          ) : (
            <LogoGroup>{null}</LogoGroup>
          )}
          {(search || primaryCTAItem) && (
            <HorizontalStack gap="2">
              {search && (
                <UnstyledButton
                  className={classNames(styles.btn, styles.searchBtn)}
                  onPress={() => setIsSearchOpen((prev) => !prev)}
                >
                  <Icon symbol={Search} />
                  <Text visuallyHidden>search</Text>
                </UnstyledButton>
              )}
              {primaryCTAItem}
            </HorizontalStack>
          )}
        </>
      )}
    </div>
  );
}
