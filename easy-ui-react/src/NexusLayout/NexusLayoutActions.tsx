import React, { ReactNode } from "react";
import { UnstyledPressButton } from "../DataGrid/UnstyledPressButton";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { Text } from "../Text";
import { IconSymbol } from "../types";

import styles from "./NexusLayoutActions.module.scss";

export type NexusLayoutActionsProps = {
  /** Actions children. */
  children: ReactNode;
};

export type NexusLayoutMenuActionProps = {
  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;

  /** Icon symbol for the action. */
  iconSymbol: IconSymbol;

  /** Badge for the action. */
  renderBadge?: () => ReactNode;

  /** Render the menu overlay. */
  children: ReactNode;
};

export function NexusLayoutActions(props: NexusLayoutActionsProps) {
  const { children } = props;
  return <HorizontalStack gap="0.5">{children}</HorizontalStack>;
}

export function NexusLayoutMenuAction(props: NexusLayoutMenuActionProps) {
  const {
    accessibilityLabel = "Actions",
    iconSymbol,
    children,
    renderBadge,
  } = props;
  return (
    <Menu>
      <Menu.Trigger>
        <UnstyledPressButton className={styles.button}>
          <Text visuallyHidden>{accessibilityLabel}</Text>
          <Icon symbol={iconSymbol} />
          {renderBadge && <div className={styles.badge}>{renderBadge()}</div>}
        </UnstyledPressButton>
      </Menu.Trigger>
      {children}
    </Menu>
  );
}
