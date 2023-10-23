import MenuIcon from "@easypost/easy-ui-icons/Menu";
import { CollectionChildren } from "@react-types/shared";
import React, { Key, ReactNode, useMemo } from "react";
import { Button, ButtonProps } from "../Button";
import { UnstyledPressButton } from "../DataGrid/UnstyledPressButton";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { classNames } from "../utilities/css";
import { HelpMenu } from "./HelpMenu";
import { ScreenSizeSwitcher } from "./ScreenSizeSwitcher";
import { useProductLayout } from "./context";

import styles from "./ProductLayoutHeader.module.scss";

export type ProductLayoutHeaderProps = {
  /**
   * List of help menu items to render. Should be an array of `<Menu.Item />`s.
   */
  helpMenuItems: CollectionChildren<object>;

  /**
   * Handler that is called when a help menu item is selected.
   */
  onHelpMenuAction?: (key: Key) => void;

  /**
   * Primary call to action for the header.
   */
  primaryAction?: ProductLayoutHeaderActionProps;

  /**
   * Logo to render in the header on mobile.
   */
  renderLogo: () => ReactNode;

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
  content: string;
  onAction: () => void;
  isDisabled?: boolean;
};

export function ProductLayoutHeader(props: ProductLayoutHeaderProps) {
  return (
    <header>
      <ScreenSizeSwitcher
        renderOnLargeScreen={() => <DesktopHeader {...props} />}
        renderOnSmallScreen={() => <MobileHeader {...props} />}
      />
    </header>
  );
}

function MobileHeader(props: ProductLayoutHeaderProps) {
  const { renderLogo, title } = props;
  const { sidebarTriggerProps } = useProductLayout();
  return (
    <div className={styles.ProductLayoutHeaderMobile}>
      <div className={styles.mobileTopBar}>
        <div className={styles.mobileLogoMenu}>
          <UnstyledPressButton
            className={styles.mobileLogoMenuBtn}
            {...sidebarTriggerProps}
          >
            <Icon symbol={MenuIcon} />
          </UnstyledPressButton>
          {renderLogo()}
        </div>
        <div className={styles.actions}>
          <MobileActions buttonSize="sm" {...props} />
        </div>
      </div>
      <div className={styles.mobileTitle}>
        <Text as="h2" variant="heading4">
          {title}
        </Text>
      </div>
    </div>
  );
}

function DesktopHeader(props: ProductLayoutHeaderProps) {
  const { title } = props;
  return (
    <div className={styles.ProductLayoutHeaderDesktop}>
      <Text as="h2" variant="heading4">
        {title}
      </Text>
      <div className={styles.actions}>
        <DesktopActions {...props} />
      </div>
    </div>
  );
}

function MobileActions(
  props: { buttonSize?: ButtonProps["size"] } & ProductLayoutHeaderProps,
) {
  const {
    buttonSize = "md",
    helpMenuItems,
    onHelpMenuAction,
    primaryAction,
  } = props;

  const actions = useMemo(() => {
    return [
      primaryAction ? (
        <Button
          size={buttonSize}
          onPress={primaryAction.onAction}
          isDisabled={primaryAction.isDisabled}
        >
          {primaryAction.content}
        </Button>
      ) : (
        <HelpMenu
          key="help-menu"
          items={helpMenuItems}
          onAction={onHelpMenuAction}
        />
      ),
    ];
  }, [buttonSize, helpMenuItems, primaryAction, onHelpMenuAction]);

  return actions.map((action, i) => (
    <Action key={String(i)} isStretched={i === 1}>
      {action}
    </Action>
  ));
}

function DesktopActions(
  props: { buttonSize?: ButtonProps["size"] } & ProductLayoutHeaderProps,
) {
  const {
    buttonSize = "md",
    helpMenuItems,
    onHelpMenuAction,
    primaryAction,
    secondaryAction,
  } = props;

  const actions = useMemo(() => {
    return [
      <HelpMenu
        key="help-menu"
        items={helpMenuItems}
        onAction={onHelpMenuAction}
      />,
      (primaryAction || secondaryAction) && <Divider />,
      secondaryAction && (
        <Button
          size={buttonSize}
          variant="outlined"
          color="support"
          onPress={secondaryAction.onAction}
          isDisabled={secondaryAction.isDisabled}
        >
          {secondaryAction.content}
        </Button>
      ),
      primaryAction && (
        <Button
          size={buttonSize}
          onPress={primaryAction.onAction}
          isDisabled={primaryAction.isDisabled}
        >
          {primaryAction.content}
        </Button>
      ),
    ].filter((a) => Boolean(a));
  }, [
    buttonSize,
    helpMenuItems,
    primaryAction,
    secondaryAction,
    onHelpMenuAction,
  ]);

  return actions.map((action, i) => (
    <Action key={String(i)} isStretched={i === 1}>
      {action}
    </Action>
  ));
}

function Action({
  isStretched,
  children,
}: {
  isStretched: boolean;
  children: ReactNode;
}) {
  const className = classNames(
    styles.action,
    isStretched && styles.actionStretched,
  );
  return <span className={className}>{children}</span>;
}

function Divider() {
  return <div className={styles.divider} />;
}
