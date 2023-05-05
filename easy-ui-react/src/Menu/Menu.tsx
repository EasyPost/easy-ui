import { useResizeObserver } from "@react-aria/utils";
import React, { ReactNode, useMemo, useState } from "react";
import { useMenuTrigger } from "react-aria";
import { useMenuTriggerState } from "react-stately";
import { InternalMenuContext } from "./MenuContext";
import { MenuItem } from "./MenuItem";
import { MenuOverlay } from "./MenuOverlay";
import { MenuSection } from "./MenuSection";
import { MenuTrigger } from "./MenuTrigger";

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

  const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
  const menuTriggerState = useMenuTriggerState(props);
  const { menuTriggerProps, menuProps: menuPropsFromTrigger } = useMenuTrigger(
    { ...props, type: "menu" },
    menuTriggerState,
    triggerRef,
  );

  // Used to size the menu based on the width of the trigger
  useResizeObserver({
    ref: triggerRef,
    onResize: () => {
      if (triggerRef.current) {
        const { width } = triggerRef.current.getBoundingClientRect();
        setTriggerWidth(width);
      }
    },
  });

  const context = useMemo(() => {
    return {
      triggerRef,
      triggerWidth,
      menuTriggerProps,
      menuTriggerState,
      menuPropsFromTrigger,
    };
  }, [triggerWidth, menuTriggerProps, menuPropsFromTrigger, menuTriggerState]);

  return (
    <InternalMenuContext.Provider value={context}>
      {children}
    </InternalMenuContext.Provider>
  );
}

Menu.Trigger = MenuTrigger;
Menu.Overlay = MenuOverlay;
Menu.Section = MenuSection;
Menu.Item = MenuItem;
