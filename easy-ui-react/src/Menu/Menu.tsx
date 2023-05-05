import React, { ReactNode, useMemo } from "react";
import { useMenuTrigger } from "react-aria";
import { useMenuTriggerState } from "react-stately";
import { InternalMenuContext } from "./MenuContext";
import { MenuItem } from "./MenuItem";
import { MenuOverlay } from "./MenuOverlay";
import { MenuSection } from "./MenuSection";
import { MenuTrigger } from "./MenuTrigger";
import { useTriggerWidth } from "./useTriggerWidth";

export type MenuProps = {
  /** The trigger and menu to render. */
  children: ReactNode;

  /** Whether the menu is open by default (uncontrolled). */
  defaultOpen?: boolean;

  /** Whether the menu should be disabled, independent from the trigger. */
  isDisabled?: boolean;

  /** Whether the menu is open by default (controlled). */
  isOpen?: boolean;

  /** Handler that is called when the menu's open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
};

/**
 * An overlay that presents a list of items that a user can choose to perform
 * an action through a trigger element.
 *
 * @remarks
 * A menu item can be used to perform a single action.
 *
 * A menu must only be placed on a natively focusable HTML element. Good
 * candidates include a `<DropdownButton />`, `<Button />`, or `<IconButton />`.
 *
 * @example
 * _Simple menu:_
 * ```tsx
 * <Menu>
 *   <Menu.Trigger>
 *     <DropdownButton>Click me</DropdownButton>
 *   </Menu.Trigger>
 *   <Menu.Overlay onAction={(key) => {}}>
 *     <Menu.Item key="copy">Copy</Menu.Item>
 *     <Menu.Item key="cut">Cut</Menu.Item>
 *     <Menu.Item key="paste">Paste</Menu.Item>
 *   </Menu.Overlay>
 * </Menu>
 * ```
 *
 * @example
 * _With separated sections:_
 * ```tsx
 * <Menu>
 *   <Menu.Trigger>
 *     <DropdownButton>Click me</DropdownButton>
 *   </Menu.Trigger>
 *   <Menu.Overlay onAction={(key) => {}}>
 *     <Menu.Section>
 *       <Menu.Item key="edit">Edit</Menu.Item>
 *       <Menu.Item key="duplicate">Duplicate</Menu.Item>
 *     </Menu.Section>
 *     <Menu.Section>
 *       <Menu.Item key="copy">Copy</Menu.Item>
 *       <Menu.Item key="cut">Cut</Menu.Item>
 *       <Menu.Item key="paste">Paste</Menu.Item>
 *     </Menu.Section>
 *   </Menu.Overlay>
 * </Menu>
 * ```
 */
export function Menu(props: MenuProps) {
  const { children } = props;

  const triggerRef = React.useRef<HTMLElement | null>(null);

  const menuTriggerState = useMenuTriggerState(props);
  const { menuTriggerProps, menuProps: menuPropsFromTrigger } = useMenuTrigger(
    { ...props, type: "menu" },
    menuTriggerState,
    triggerRef,
  );

  const triggerWidth = useTriggerWidth(triggerRef);

  const context = useMemo(() => {
    return {
      menuPropsFromTrigger,
      menuTriggerProps,
      menuTriggerState,
      triggerRef,
      triggerWidth,
    };
  }, [triggerWidth, menuTriggerProps, menuPropsFromTrigger, menuTriggerState]);

  return (
    <InternalMenuContext.Provider value={context}>
      {children}
    </InternalMenuContext.Provider>
  );
}

/**
 * Represents the trigger in a `<Menu />`.
 *
 * @remarks
 * Should contain a single natively focusable Easy UI element such as a
 * `<DropdownButton />` or `<Button />`.
 */
Menu.Trigger = MenuTrigger;

/**
 * Represents the overlay in a `<Menu />`.
 *
 * @remarks
 * Should contain `<Menu.Item />`s and `<Menu.Section />`s as
 * immediate children.
 */
Menu.Overlay = MenuOverlay;

/**
 * Represents a section in a `<Menu />`.
 *
 * @remarks
 * Should be used within a `<Menu.Overlay />` component as `<Menu.Section />`.
 */
Menu.Section = MenuSection;

/**
 * Represents an item in a `<Menu />`.
 *
 * @remarks
 * Should be used within a `<Menu.Overlay />` or `<Menu.Section />` component
 * as `<Menu.Item />`.
 */
Menu.Item = MenuItem;
