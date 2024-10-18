import React, {
  ComponentProps,
  forwardRef,
  ReactNode,
  useCallback,
  useState,
} from "react";
import {
  mergeProps,
  PressHookProps,
  useFocusRing,
  useHover,
  usePress,
} from "react-aria";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { classNames } from "../utilities/css";

import styles from "./NexusLayoutActions.module.scss";

export type NexusLayoutActionsProps = {
  /** Actions children. */
  children: ReactNode;
};

export type NexusLayoutActionBadgeProps = {
  /** Badge children. */
  children?: ReactNode;
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
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenChange = useCallback((isOpen: boolean) => {
    setIsOpen(isOpen);
  }, []);
  const { focusProps, isFocusVisible } = useFocusRing({});
  const { hoverProps, isHovered } = useHover({});
  const className = classNames(
    styles.button,
    isFocusVisible && styles.focused,
    isHovered && styles.hovered,
    isOpen && styles.open,
  );
  return (
    <Menu isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Menu.Trigger>
        <PressableButton
          className={className}
          {...mergeProps(focusProps, hoverProps)}
        >
          <Text visuallyHidden>{accessibilityLabel}</Text>
          <Icon symbol={iconSymbol} />
          {renderBadge && (
            <div className={styles.badgeContainer}>{renderBadge()}</div>
          )}
        </PressableButton>
      </Menu.Trigger>
      {children}
    </Menu>
  );
}

export function NexusLayoutActionBadge(props: NexusLayoutActionBadgeProps) {
  const { children } = props;
  return <div className={styles.badge}>{children}</div>;
}

/** TODO: Figure out how to work with UnstyledButton instead */
export const PressableButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & PressHookProps
>((props, ref) => {
  const { pressProps } = usePress(props);
  return (
    <button
      {...pressProps}
      ref={ref}
      className={classNames(pressProps.className)}
    />
  );
});

PressableButton.displayName = "PressableButton";
