import React, { ReactNode, Fragment, ReactElement } from "react";
import Help from "@easypost/easy-ui-icons/Help";
import { Separator } from "./Separator";
import { Menu } from "../Menu";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { UnstyledButton } from "../UnstyledButton";
import { useInternalSearchNavContext } from "./context";
import { classNames } from "../utilities/css";
import { getFlattenedKey } from "../utilities/react";

import styles from "./CTAGroup.module.scss";

export type CTAGroupProps = {
  /**
   * The children of the <SearchNav.CTAGroup> element. Should include <SearchNav.SecondaryCTAItem>
   * elements and <SearchNav.PrimaryCTAItem>
   */
  children: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CTAGroup(_props: CTAGroupProps) {
  const { menuOverlayProps, ctaMenuSymbol, primaryCTAItem, secondaryCTAItems } =
    useInternalSearchNavContext();

  const totalItems = secondaryCTAItems?.length || 0;

  return (
    <>
      <div className={classNames(styles.ctaGroup, styles.ctaGroupExpanded)}>
        {secondaryCTAItems?.map((item, index) => {
          const isLastChild = index === totalItems - 1;
          const itemEle = item as ReactElement;
          return (
            <Fragment key={itemEle.key}>
              {itemEle}
              {!isLastChild && <Separator group="cta" />}
            </Fragment>
          );
        })}
        {primaryCTAItem && (
          <>
            <Separator group="cta" />
            {primaryCTAItem}
          </>
        )}
      </div>
      <div className={classNames(styles.ctaGroup, styles.ctaGroupMenu)}>
        <Menu>
          <Menu.Trigger>
            <UnstyledButton className={classNames(styles.menuBtn)}>
              <Icon symbol={ctaMenuSymbol ? ctaMenuSymbol : Help} />
              <Text visuallyHidden>menu</Text>
            </UnstyledButton>
          </Menu.Trigger>
          <Menu.Overlay placement="bottom right" {...menuOverlayProps}>
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
        {primaryCTAItem && (
          <>
            <Separator group="cta" />
            {primaryCTAItem}
          </>
        )}
      </div>
    </>
  );
}

CTAGroup.displayName = "SearchNav.CTAGroup";
