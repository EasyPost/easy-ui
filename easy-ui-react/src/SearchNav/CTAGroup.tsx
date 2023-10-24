import React, { ReactNode, useMemo, Fragment, ReactElement } from "react";
import Help from "@easypost/easy-ui-icons/Help";
import { Separator } from "./Separator";
import { Menu } from "../Menu";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { UnstyledButton } from "../UnstyledButton";
import { useInternalSearchNavContext } from "./context";
import { classNames } from "../utilities/css";
import { flattenChildren, getFlattenedKey } from "../utilities/react";

import styles from "./CTAGroup.module.scss";

export type CTAGroupProps = {
  /**
   * The children of the <SearchNav.CTAGroup> element. Should include <SearchNav.CTAItem> elements.
   */
  children: ReactNode;
};

export function CTAGroup(props: CTAGroupProps) {
  const { children } = props;
  const { menuOverlayProps, ctaMenuSymbol } = useInternalSearchNavContext();

  const items = useMemo(() => {
    return flattenChildren(children);
  }, [children]);

  const totalItems = items.length;

  return (
    <>
      <div className={classNames(styles.ctaGroup, styles.ctaGroupExpanded)}>
        {items.map((item, index) => {
          const isLastChild = index === totalItems - 1;
          const itemEle = item as ReactElement;
          return (
            <Fragment key={itemEle.key}>
              {itemEle}
              {!isLastChild && <Separator group="cta" />}
            </Fragment>
          );
        })}
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
              {items.map((item) => {
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
      </div>
    </>
  );
}

CTAGroup.displayName = "SearchNav.CTAGroup";