import React, {
  ComponentProps,
  forwardRef,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  AriaLinkOptions,
  mergeProps,
  PressHookProps,
  useFocusRing,
  useHover,
  useLink,
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

export type NexusLayoutLinkActionProps = {
  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;

  /** Action link icon symbol. */
  iconSymbol: IconSymbol;

  /** Whether or not action link is selected. */
  isSelected?: boolean;

  /** Badge for the action. */
  renderBadge?: () => ReactNode;
} & AriaLinkOptions;

export function NexusLayoutActions(props: NexusLayoutActionsProps) {
  const { children } = props;
  return (
    <HorizontalStack wrap={false} gap="0.5" align="end">
      {children}
    </HorizontalStack>
  );
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

export function NexusLayoutLinkAction(props: NexusLayoutLinkActionProps) {
  const {
    accessibilityLabel = "Actions",
    iconSymbol,
    renderBadge,
    isSelected,
  } = props;
  const ref = useRef(null);
  const { linkProps } = useLink(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing(props);
  const { hoverProps, isHovered } = useHover(props);
  const className = classNames(
    styles.button,
    isFocusVisible && styles.focused,
    isHovered && styles.hovered,
    isSelected && styles.selected,
  );
  return (
    <a
      ref={ref}
      className={className}
      {...mergeProps(hoverProps, focusProps, linkProps)}
      aria-current={isSelected ? "true" : undefined}
    >
      <Text visuallyHidden>{accessibilityLabel}</Text>
      <Icon symbol={iconSymbol} />
      {renderBadge && (
        <div className={styles.badgeContainer}>{renderBadge()}</div>
      )}
    </a>
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
