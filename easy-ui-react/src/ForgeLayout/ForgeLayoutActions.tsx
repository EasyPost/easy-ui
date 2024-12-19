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
import { Button } from "react-aria-components";
import { ButtonProps } from "../Button";
import { HorizontalStack } from "../HorizontalStack";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { Text } from "../Text";
import { IconSymbol } from "../types";
import { classNames } from "../utilities/css";

import styles from "./ForgeLayoutActions.module.scss";

export type ForgeLayoutActionsProps = {
  /** Actions children. */
  children: ReactNode;
};

export type ForgeLayoutActionBadgeProps = {
  /** Badge children. */
  children?: ReactNode;
};

export type ForgeLayoutMenuActionProps = {
  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;

  /** Icon symbol for the action. */
  iconSymbol: IconSymbol;

  /** Badge for the action. */
  renderBadge?: () => ReactNode;

  /** Render the menu overlay. */
  children: ReactNode;
};

export type ForgeLayoutLinkActionProps = {
  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;

  /** Action link icon symbol. */
  iconSymbol: IconSymbol;

  /** Whether or not action link is selected. */
  isSelected?: boolean;

  /** Badge for the action. */
  renderBadge?: () => ReactNode;
} & AriaLinkOptions;

export type ForgeLayoutButtonActionProps = {
  /** Optional custom accessibility label describing the menu action. */
  accessibilityLabel?: string;

  /** Action button icon symbol. */
  iconSymbol: IconSymbol;

  /** Whether or not action button is selected. */
  isSelected?: boolean;

  /** Badge for the action. */
  renderBadge?: () => ReactNode;
} & ButtonProps &
  React.RefAttributes<HTMLButtonElement>;

export function ForgeLayoutActions(props: ForgeLayoutActionsProps) {
  const { children } = props;
  return (
    <HorizontalStack wrap={false} gap="1" align="end">
      {children}
    </HorizontalStack>
  );
}

export function ForgeLayoutMenuAction(props: ForgeLayoutMenuActionProps) {
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

export function ForgeLayoutLinkAction(props: ForgeLayoutLinkActionProps) {
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

export function ForgeLayoutButtonAction(props: ForgeLayoutButtonActionProps) {
  const {
    accessibilityLabel = "Actions",
    iconSymbol,
    renderBadge,
    isSelected,
    ...buttonProps
  } = props;
  const ref = useRef(null);
  const className = classNames(styles.button, isSelected && styles.selected);
  return (
    <Button
      ref={ref}
      className={className}
      aria-current={isSelected ? "true" : undefined}
      {...buttonProps}
    >
      <Text visuallyHidden>{accessibilityLabel}</Text>
      <Icon symbol={iconSymbol} />
      {renderBadge && (
        <div className={styles.badgeContainer}>{renderBadge()}</div>
      )}
    </Button>
  );
}

export function ForgeLayoutActionBadge(props: ForgeLayoutActionBadgeProps) {
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
