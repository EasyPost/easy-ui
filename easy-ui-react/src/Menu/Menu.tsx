import { useResizeObserver } from "@react-aria/utils";
import { CollectionChildren } from "@react-types/shared";
import noop from "lodash/noop";
import omit from "lodash/omit";
import React, {
  ElementType,
  Key,
  MutableRefObject,
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  AriaButtonProps,
  AriaMenuOptions,
  DismissButton,
  OverlayContainer,
  Placement,
  mergeProps,
  useMenu,
  useMenuItem,
  useMenuSection,
  useMenuTrigger,
  usePopover,
  useSeparator,
} from "react-aria";
import {
  Item,
  MenuTriggerState,
  Node,
  Section,
  TreeState,
  useMenuTriggerState,
  useTreeState,
} from "react-stately";
import { Text } from "../Text";
import {
  ResponsiveProp,
  getComponentToken,
  getResponsiveValue,
  pxToRem,
} from "../utilities/css";

import { NoInfer } from "types";
import styles from "./Menu.module.scss";

const ITEM_HEIGHT = 32;
const MAX_ITEMS_BEFORE_SCROLL = 5;
const Y_PADDING_INSIDE_OVERLAY = 8;
const OVERLAY_OFFSET = 8;
const OVERLAY_PADDING_FROM_CONTAINER = 12;

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

export type MenuTriggerProps = {
  /** The element that will activate the menu. */
  children: ReactElement;
};

export type MenuOverlayWidth =
  | "auto"
  | "fit-content"
  | "fit-trigger"
  | ResponsiveProp<string | number>;

export type MenuOverlayProps<T> = {
  /** The contents of the menu. */
  children: CollectionChildren<T>;

  /** The item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with. */
  disabledKeys?: Iterable<Key>;

  /** Handler that is called when an item is selected. */
  onAction?: (key: Key) => void;

  /** Handler that is called when the menu should close after selecting an item. */
  onClose?: () => void;

  /**
   * The placement of the element with respect to its anchor element.
   * @default bottom
   */
  placement?: Placement;

  /**
   * The width of the menu overlay.
   * @default auto
   */
  width?: MenuOverlayWidth;
};

export type MenuItemProps = {
  /** An accessibility label for the item. */
  "aria-label"?: string;

  /** Rendered contents of the item or child items. */
  children: ReactNode;

  /**
   * Whether the menu should close when the menu item is selected.
   * @default true
   */
  closeOnSelect?: boolean;

  /** A URL to link to if the menu item should be a link. */
  href?: string;

  /**
   * If href is provided, a custom component to render for the link. Useful for
   * framework link components like next/link.
   * @default "a"
   */
  hrefComponent?: ElementType;

  /** The relationship between the linked resource and the current page. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). */
  rel?: string;

  /** The target window for the link. */
  target?: string;
};

export type MenuSectionProps = {
  /** Rendered contents of the item or child items. */
  children: ReactNode;

  /** An accessibility label for the section. */
  "aria-label"?: string;
};

type InternalMenuContextType = {
  triggerWidth: number | null;
  triggerRef: MutableRefObject<HTMLElement | null>;
  menuTriggerProps: AriaButtonProps;
  menuTriggerState: MenuTriggerState;
  menuPropsFromTrigger: AriaMenuOptions<unknown>;
};

const InternalMenuContext = createContext<InternalMenuContextType | null>(null);

function useInternalMenuContext() {
  const menuContext = useContext(InternalMenuContext);
  if (!menuContext) {
    throw new Error("Must be inside a Menu");
  }
  return menuContext;
}

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

function MenuTrigger(props: MenuTriggerProps) {
  const { children } = props;
  const { triggerRef, menuTriggerProps } = useInternalMenuContext();
  return React.cloneElement(children, { ...menuTriggerProps, ref: triggerRef });
}

function MenuOverlay<T extends object>(props: MenuOverlayProps<T>) {
  const { menuTriggerState, triggerWidth } = useInternalMenuContext();
  if (!menuTriggerState.isOpen || triggerWidth === null) {
    return null;
  }
  return <MenuOverlayInner {...props} />;
}

function MenuOverlayInner<T extends object>(props: MenuOverlayProps<T>) {
  const {
    children,
    disabledKeys,
    onAction,
    onClose,
    placement = "bottom",
    width = "auto",
  } = props;

  const popoverRef = React.useRef(null);
  const menuRef = React.useRef(null);

  const menuTreeState = useTreeState({
    children,
    disabledKeys,
  });

  const { menuTriggerState, triggerRef, triggerWidth, menuPropsFromTrigger } =
    useInternalMenuContext();

  const { popoverProps, underlayProps } = usePopover(
    {
      containerPadding: OVERLAY_PADDING_FROM_CONTAINER,
      isKeyboardDismissDisabled: false,
      isNonModal: false,
      maxHeight:
        ITEM_HEIGHT * MAX_ITEMS_BEFORE_SCROLL +
        Y_PADDING_INSIDE_OVERLAY * 2 +
        2,
      offset: OVERLAY_OFFSET,
      placement,
      popoverRef,
      triggerRef,
      scrollRef: menuRef,
    },
    menuTriggerState,
  );

  const { menuProps } = useMenu(
    mergeProps({ disabledKeys, onAction, onClose }, menuPropsFromTrigger),
    menuTreeState,
    menuRef,
  );

  const style = {
    ...popoverProps.style,
    ...getComponentToken("menu", "item_height", `${pxToRem(ITEM_HEIGHT)}rem`),
    ...getComponentToken(
      "menu",
      "padding.y",
      `${pxToRem(Y_PADDING_INSIDE_OVERLAY)}rem`,
    ),
    ...getComponentToken(
      "menu",
      "min-width",
      width === "auto" ? `${triggerWidth}px` : undefined,
    ),
    ...getResponsiveValue(
      "menu",
      "width",
      width !== "auto" && width !== "fit-content" && width !== "fit-trigger"
        ? width
        : width === "fit-trigger"
        ? `${pxToRem(triggerWidth as number)}rem`
        : "auto",
    ),
  } as React.CSSProperties;

  return (
    <OverlayContainer>
      <div {...underlayProps} className={styles.underlay} />
      <div
        {...mergeProps(popoverProps, { style })}
        ref={popoverRef}
        className={styles.root}
      >
        <DismissButton onDismiss={menuTriggerState.close} />
        <ul {...menuProps} ref={menuRef} className={styles.list}>
          {[...menuTreeState.collection].map((item) => {
            return item.type === "section" ? (
              <MenuSectionContent
                key={item.key}
                section={item}
                state={menuTreeState}
              />
            ) : (
              <MenuItemContent
                key={item.key}
                item={item}
                state={menuTreeState}
              />
            );
          })}
        </ul>
        <DismissButton onDismiss={menuTriggerState.close} />
      </div>
    </OverlayContainer>
  );
}

export type MenuItemContentProps<T> = {
  item: Node<T>;
  state: TreeState<T>;
};

function MenuItemContent<T>({ item, state }: MenuItemContentProps<T>) {
  const ref = React.useRef(null);
  const { closeOnSelect, href } = item.props;
  const { menuItemProps, isFocused, isSelected, isDisabled } = useMenuItem(
    { ...item, closeOnSelect },
    state,
    ref,
  );
  if (href) {
    const { hrefComponent: Component = "a", ...restProps } = item.props;
    const linkProps = omit(restProps, [
      "aria-label",
      "as",
      "children",
      "closeOnSelect",
    ]);
    return (
      <li role="none">
        <Component
          {...mergeProps(menuItemProps, linkProps)}
          onPointerUp={noop}
          onKeyDown={noop}
          className={styles.item}
          ref={ref}
          data-is-disabled={isDisabled}
          data-is-focused={isFocused}
          data-is-selected={isSelected}
        >
          <div className={styles.itemContent}>
            <Text variant="body1" truncate>
              {item.rendered}
            </Text>
          </div>
        </Component>
      </li>
    );
  }
  return (
    <li
      {...menuItemProps}
      title={item.textValue}
      className={styles.item}
      ref={ref}
      data-is-disabled={isDisabled}
      data-is-focused={isFocused}
      data-is-selected={isSelected}
    >
      <div className={styles.itemContent}>
        <Text variant="body1" truncate>
          {item.rendered}
        </Text>
      </div>
    </li>
  );
}

export type MenuSectionContentProps<T> = {
  section: Node<T>;
  state: TreeState<T>;
};

function MenuSectionContent<T>({ section, state }: MenuSectionContentProps<T>) {
  const { itemProps, groupProps } = useMenuSection({
    "aria-label": section["aria-label"],
  });
  const { separatorProps } = useSeparator({ elementType: "li" });
  return (
    <>
      {section.key !== state.collection.getFirstKey() && (
        <li {...separatorProps} className={styles.separator} />
      )}
      <li {...itemProps}>
        {section.hasChildNodes && (
          <ul {...groupProps} className={styles.sectionList}>
            {[...section.childNodes].map((item) => {
              return (
                <MenuItemContent key={item.key} item={item} state={state} />
              );
            })}
          </ul>
        )}
      </li>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MenuSection(_props: MenuSectionProps) {
  return null;
}
Object.assign(MenuSection, Section);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MenuItem<T>(_props: MenuItemProps & NoInfer<T>) {
  return null;
}
Object.assign(MenuItem, Item);

Menu.Trigger = MenuTrigger;
Menu.Overlay = MenuOverlay;
Menu.Section = MenuSection;
Menu.Item = MenuItem;
