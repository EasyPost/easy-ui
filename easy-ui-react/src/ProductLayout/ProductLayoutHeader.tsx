import MenuIcon from "@easypost/easy-ui-icons/Menu";
import React, { ReactNode } from "react";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { MenuOverlayProps } from "../Menu/MenuOverlay";
import { Text } from "../Text";
import { UnstyledButton } from "../UnstyledButton";
import { classNames } from "../utilities/css";
import { HelpMenu } from "./HelpMenu";
import { LayoutScreenSizeRenderer } from "./LayoutScreenSizeRenderer";
import { useProductLayout } from "./context";

import styles from "./ProductLayoutHeader.module.scss";

export type ProductLayoutHeaderProps = {
  /**
   * List of help menu items to render. Should be an array of `<Menu.Item />`s.
   */
  helpMenuItems: MenuOverlayProps<object>["children"];

  /**
   * Handler that is called when a help menu item is selected.
   */
  onHelpMenuAction?: MenuOverlayProps<object>["onAction"];

  /**
   * Primary call to action for the header.
   */
  primaryAction?: ProductLayoutHeaderActionProps;

  /**
   * Logo to render in the header on small screens.
   */
  renderSmallScreenLogo: () => ReactNode;

  /**
   * Secondary call to action for the header.
   */
  secondaryAction?: ProductLayoutHeaderActionProps;

  /**
   * Page title.
   */
  title: ReactNode;
};

export type ProductLayoutHeaderActionProps = {
  /**
   * Content text to render for the header action.
   */
  content: string;

  /**
   * Action to invoke for the header action.
   */
  onAction: () => void;

  /**
   * Whether or not the header action is disabled.
   */
  isDisabled?: boolean;
};

export function ProductLayoutHeader(props: ProductLayoutHeaderProps) {
  return (
    <header>
      <LayoutScreenSizeRenderer
        renderOnLargeScreen={() => <LargeScreenHeader {...props} />}
        renderOnSmallScreen={() => <SmallScreenHeader {...props} />}
      />
    </header>
  );
}

function SmallScreenHeader(props: ProductLayoutHeaderProps) {
  const {
    helpMenuItems,
    onHelpMenuAction,
    primaryAction,
    renderSmallScreenLogo,
    title,
  } = props;
  const { sidebarTriggerProps } = useProductLayout();
  return (
    <div className={classNames(styles.ProductLayoutHeader, styles.smallScreen)}>
      <div className={styles.smallScreenTopBar}>
        <div className={styles.logoMenu}>
          <UnstyledButton
            className={styles.logoMenuBtn}
            {...sidebarTriggerProps}
          >
            <Icon symbol={MenuIcon} />
            <Text visuallyHidden>Menu</Text>
          </UnstyledButton>
          {renderSmallScreenLogo()}
        </div>
        <div className={styles.actions}>
          {primaryAction ? (
            <Button
              size="sm"
              onPress={primaryAction.onAction}
              isDisabled={primaryAction.isDisabled}
            >
              {primaryAction.content}
            </Button>
          ) : (
            <HelpMenu items={helpMenuItems} onAction={onHelpMenuAction} />
          )}
        </div>
      </div>
      <Text as="h2" variant="heading4">
        {title}
      </Text>
    </div>
  );
}

function LargeScreenHeader(props: ProductLayoutHeaderProps) {
  const {
    helpMenuItems,
    onHelpMenuAction,
    primaryAction,
    secondaryAction,
    title,
  } = props;
  return (
    <div className={classNames(styles.ProductLayoutHeader, styles.largeScreen)}>
      <Text as="h2" variant="heading4">
        {title}
      </Text>
      <div className={styles.actions}>
        <HelpMenu items={helpMenuItems} onAction={onHelpMenuAction} />
        {(primaryAction || secondaryAction) && <ActionDivider />}
        {secondaryAction && (
          <Button
            variant="outlined"
            color="support"
            onPress={secondaryAction.onAction}
            isDisabled={secondaryAction.isDisabled}
          >
            {secondaryAction.content}
          </Button>
        )}
        {primaryAction && (
          <Button
            onPress={primaryAction.onAction}
            isDisabled={primaryAction.isDisabled}
          >
            {primaryAction.content}
          </Button>
        )}
      </div>
    </div>
  );
}

function ActionDivider() {
  return <div className={styles.divider} />;
}
