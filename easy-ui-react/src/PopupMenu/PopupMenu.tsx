import React, {
  MutableRefObject,
  ReactElement,
  createContext,
  useContext,
  useMemo,
} from "react";
import {
  DismissButton,
  OverlayContainer,
  mergeProps,
  useMenu,
  useMenuItem,
  useMenuTrigger,
  usePopover,
  useMenuSection,
  useSeparator,
} from "react-aria";
import {
  useMenuTriggerState,
  MenuTriggerState,
  useTreeState,
  Item,
  Section,
  Node,
  TreeState,
} from "react-stately";
import { useButton } from "react-aria";

type PopupMenuContext = {
  triggerRef: MutableRefObject<null>;
  menuTriggerProps: object;
  menuTriggerState: MenuTriggerState;
  menuProps: object;
};

const PopupMenuContext = createContext<PopupMenuContext | null>(null);

const usePopupMenu = () => {
  const popupMenuContext = useContext(PopupMenuContext);
  if (!popupMenuContext) {
    throw new Error("Must be within a PopupMenu");
  }
  return popupMenuContext;
};

function PopupMenu(props) {
  const triggerRef = React.useRef(null);

  const menuTriggerState = useMenuTriggerState(props);
  const { menuTriggerProps, menuProps } = useMenuTrigger(
    props,
    menuTriggerState,
    triggerRef,
  );

  const context = useMemo(() => {
    return { triggerRef, menuTriggerProps, menuTriggerState, menuProps };
  }, [menuTriggerProps, menuProps, menuTriggerState]);

  return (
    <PopupMenuContext.Provider value={context}>
      {props.children}
    </PopupMenuContext.Provider>
  );
}

function Trigger({ children }: { children: ReactElement }) {
  const { triggerRef, menuTriggerProps } = usePopupMenu();
  return React.cloneElement(children, {
    ...menuTriggerProps,
    buttonRef: triggerRef,
  });
}

function Menu(props) {
  const { menuTriggerState } = usePopupMenu();
  if (!menuTriggerState.isOpen) {
    return null;
  }
  return <MenuInner {...props} />;
}

function MenuInner(props) {
  const { menuTriggerState, triggerRef, menuProps } = usePopupMenu();
  const popoverRef = React.useRef(null);
  const { popoverProps, underlayProps } = usePopover(
    {
      placement: props.placement || "bottom start",
      offset: props.offset,
      crossOffset: props.crossOffset,
      triggerRef,
      popoverRef,
    },
    menuTriggerState,
  );
  const menuTreeState = useTreeState(props);
  const menuRef = React.useRef(null);
  const { menuProps: innerMenuProps } = useMenu(
    mergeProps(props, menuProps),
    menuTreeState,
    menuRef,
  );
  return (
    <OverlayContainer>
      <div {...underlayProps} style={{ position: "fixed", inset: 0 }} />
      <div
        {...popoverProps}
        ref={popoverRef}
        style={{
          ...popoverProps.style,
          background: "lightgray",
          border: "1px solid gray",
        }}
      >
        <div
          style={{
            maxHeight: 150,
            overflow: "auto",
          }}
        >
          <DismissButton onDismiss={menuTriggerState.close} />
          <ul
            {...innerMenuProps}
            ref={menuRef}
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              width: 150,
            }}
          >
            {[...menuTreeState.collection].map((item) => {
              return item.type === "section" ? (
                <MenuSection
                  key={item.key}
                  section={item}
                  state={menuTreeState}
                />
              ) : (
                <MenuItem key={item.key} item={item} state={menuTreeState} />
              );
            })}
          </ul>
          <DismissButton onDismiss={menuTriggerState.close} />
        </div>
      </div>
    </OverlayContainer>
  );
}

function MenuItem({
  item,
  state,
}: {
  item: Node<object>;
  state: TreeState<object>;
}) {
  // Get props for the menu item element
  const ref = React.useRef(null);
  const { menuItemProps, isFocused, isSelected, isDisabled } = useMenuItem(
    { key: item.key },
    state,
    ref,
  );

  return (
    <li
      {...menuItemProps}
      ref={ref}
      style={{
        background: isFocused ? "gray" : "transparent",
        color: isDisabled ? "gray" : isFocused ? "white" : "black",
        padding: "2px 5px",
        outline: "none",
        cursor: "default",
        display: "flex",
        justifyContent: "space-between",
        height: 30,
      }}
    >
      {item.rendered}
      {isSelected && <span aria-hidden="true">✅</span>}
    </li>
  );
}

function MenuSection({ section, state }) {
  const { itemProps, headingProps, groupProps } = useMenuSection({
    heading: section.rendered,
    "aria-label": section["aria-label"],
  });

  const { separatorProps } = useSeparator({
    elementType: "li",
  });

  // If the section is not the first, add a separator element.
  // The heading is rendered inside an <li> element, which contains
  // a <ul> with the child items.
  return (
    <>
      {section.key !== state.collection.getFirstKey() && (
        <li
          {...separatorProps}
          style={{
            borderTop: "1px solid gray",
            margin: "2px 5px",
            height: 30,
          }}
        />
      )}
      <li {...itemProps}>
        {section.rendered && (
          <span
            {...headingProps}
            style={{
              fontWeight: "bold",
              fontSize: "1.1em",
              padding: "2px 5px",
            }}
          >
            {section.rendered}
          </span>
        )}
        <ul
          {...groupProps}
          style={{
            padding: 0,
            listStyle: "none",
          }}
        >
          {[...section.childNodes].map((node) => (
            <MenuItem key={node.key} item={node} state={state} />
          ))}
        </ul>
      </li>
    </>
  );
}

PopupMenu.Trigger = Trigger;
PopupMenu.Menu = Menu;
PopupMenu.Item = Item;
PopupMenu.Section = Section;

export function Button(props) {
  const ref = props.buttonRef;
  const { buttonProps } = useButton(props, ref);
  return (
    <button {...buttonProps} ref={ref}>
      {props.children}
    </button>
  );
}

export { PopupMenu };
