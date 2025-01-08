import KeyboardArrowDownIcon from "@easypost/easy-ui-icons/KeyboardArrowDown";
import React, {
  KeyboardEvent,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Key, useFilter, VisuallyHidden } from "react-aria";
import {
  Button,
  ComboBox,
  Input,
  ListBox,
  ListBoxItem,
  ListBoxItemProps,
  Popover,
} from "react-aria-components";
import { useListData } from "react-stately";
import { Icon } from "../Icon";
import { MenuOverlayProps } from "../Menu/MenuOverlay";
import {
  DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
  getMenuPopoverMaxHeight,
  ITEM_HEIGHT,
  Y_PADDING_INSIDE_OVERLAY,
} from "../Menu/utilities";
import { PillGroup, PillProps } from "../PillGroup";
import { Text, TextProps } from "../Text";
import { getComponentToken, pxToRem } from "../utilities/css";
import { useScrollbar } from "../utilities/useScrollbar";

import styles from "./MultiSelect.module.scss";

type FieldState = {
  selectedKey: Key | null;
  inputValue: string;
};

type Item = { key: Key } & PillProps;

type MultipleSelectProps<T extends object> = {
  children: React.ReactNode | ((item: T) => React.ReactNode);
  items: Array<T>;
  maxItemsUntilScroll?: MenuOverlayProps<T>["maxItemsUntilScroll"];
  placeholder?: string;
  renderPill: (item: T) => React.ReactNode;

  /**
   * The currently selected keys in the collection (controlled).
   */
  selectedKeys: Iterable<Key>;

  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange: (keys: Iterable<Key>) => void;
};

// inspired by https://github.com/irsyadadl/justd/blob/2.x/components/ui/multiple-select.tsx
const MultipleSelect = <T extends Item>(props: MultipleSelectProps<T>) => {
  const {
    children,
    items,
    maxItemsUntilScroll = DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
    onSelectionChange: onSourceSelectionChange,
    placeholder,
    renderPill,
    selectedKeys,
  } = props;

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState(0);
  const { contains } = useFilter({ sensitivity: "base" });

  const filter = useCallback(
    (item: T, filterText: string) => {
      return (
        ![...selectedKeys].includes(item.key) &&
        contains(item.label, filterText)
      );
    },
    [contains, selectedKeys],
  );

  const accessibleList = useListData({ initialItems: items, filter });
  const [fieldState, setFieldState] = useState<FieldState>({
    selectedKey: null,
    inputValue: "",
  });

  const onRemove = useCallback(
    (keys: Set<Key>) => {
      const key = keys.values().next().value;
      if (key) {
        onSourceSelectionChange([...selectedKeys].filter((k) => k !== key));
        setFieldState({ inputValue: "", selectedKey: null });
      }
    },
    [onSourceSelectionChange, selectedKeys],
  );

  const onSelectionChange = (id: Key | null) => {
    if (!id) {
      return;
    }

    const item = accessibleList.getItem(id);

    if (!item) {
      return;
    }

    if (![...selectedKeys].includes(id)) {
      onSourceSelectionChange([...selectedKeys, item.key]);
      setFieldState({ inputValue: "", selectedKey: id });
    }

    setTimeout(() => {
      accessibleList.setFilterText("");
    });
  };

  const onInputChange = (value: string) => {
    setFieldState((prev) => ({
      inputValue: value,
      selectedKey: value === "" ? null : prev.selectedKey,
    }));
    accessibleList.setFilterText(value);
  };

  const popLast = useCallback(() => {
    if ([...selectedKeys].length === 0) {
      return;
    }

    const endKey = [...selectedKeys][[...selectedKeys].length - 1];
    if (endKey) {
      onSourceSelectionChange([...selectedKeys].filter((k) => k !== endKey));
    }

    setFieldState({ inputValue: "", selectedKey: null });
  }, [selectedKeys, onSourceSelectionChange]);

  // handle deleting pills with keyboard
  const onKeyDownCapture = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && fieldState.inputValue === "") {
        popLast();
      }
    },
    [popLast, fieldState.inputValue],
  );

  const onBlurInput = useCallback(() => {
    setFieldState({ inputValue: "", selectedKey: null });
    setTimeout(() => {
      accessibleList.setFilterText("");
    });
  }, [accessibleList]);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.target.clientWidth);
      }
    });

    observer.observe(trigger);
    return () => {
      observer.unobserve(trigger);
    };
  }, []);

  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div ref={triggerRef} className={styles.MultiSelect}>
      {[...selectedKeys].length > 0 && (
        <PillGroup
          items={[...selectedKeys]
            .map((k) => items.find((i) => i.key === k))
            .filter((i) => !!i)}
          horizontalStackContainerProps={{ gap: "1" }}
          onRemove={onRemove}
          label="Selected items"
        >
          {renderPill}
        </PillGroup>
      )}
      <div className={styles.comboBoxContainer}>
        <ComboBox
          className={styles.comboBox}
          allowsEmptyCollection
          aria-label="Available items"
          items={accessibleList.items}
          selectedKey={fieldState.selectedKey}
          inputValue={fieldState.inputValue}
          onSelectionChange={onSelectionChange}
          onInputChange={onInputChange}
        >
          <div className={styles.inputContainer}>
            <Input
              placeholder={placeholder}
              className={styles.input}
              onBlur={onBlurInput}
              onKeyDownCapture={onKeyDownCapture}
            />
            <VisuallyHidden>
              <Button
                slot="remove"
                type="button"
                aria-label="Remove"
                ref={triggerButtonRef}
              />
            </VisuallyHidden>
          </div>
          <Popover
            isNonModal
            className={styles.popover}
            style={{
              width,
              ...getComponentToken(
                "menu",
                "item_height",
                `${pxToRem(ITEM_HEIGHT)}rem`,
              ),
              ...getComponentToken(
                "menu",
                "padding.y",
                `${pxToRem(Y_PADDING_INSIDE_OVERLAY)}rem`,
              ),
            }}
            triggerRef={triggerRef}
            scrollRef={menuRef}
            trigger="ComboBox"
            maxHeight={getMenuPopoverMaxHeight({ maxItemsUntilScroll })}
          >
            <ListBoxContainer menuRef={menuRef}>
              <ListBox
                renderEmptyState={() => (
                  <div className={styles.listEmptyState}>
                    <Text variant="subtitle2" color="neutral.400">
                      No results found
                    </Text>
                  </div>
                )}
                selectionMode="multiple"
              >
                {children}
              </ListBox>
            </ListBoxContainer>
          </Popover>
        </ComboBox>
        <button
          type="button"
          className={styles.button}
          onClick={() => triggerButtonRef.current?.click()}
          tabIndex={-1}
        >
          <Icon symbol={KeyboardArrowDownIcon} />
        </button>
      </div>
    </div>
  );
};

function ListBoxContainer({
  menuRef,
  children,
}: {
  menuRef: RefObject<HTMLDivElement>;
  children: ReactNode;
}) {
  useScrollbar(menuRef, "ezui-os-theme-overlay");
  return (
    <div className={styles.menu} ref={menuRef}>
      {children}
    </div>
  );
}

function MultipleSelectOption(props: ListBoxItemProps) {
  return <ListBoxItem {...props} className={styles.option} />;
}

function MultipleSelectOptionText(props: TextProps) {
  return <Text variant="body1" {...props} />;
}

MultipleSelect.Pill = PillGroup.Pill;
MultipleSelect.Option = MultipleSelectOption;
MultipleSelect.OptionText = MultipleSelectOptionText;

export { MultipleSelect };
export type { Item, MultipleSelectProps };
