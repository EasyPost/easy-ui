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
import { useFilter, VisuallyHidden } from "react-aria";
import {
  Button,
  ComboBox,
  ComboBoxProps as ComboBoxPrimitiveProps,
  Input,
  Key,
  ListBox,
  ListBoxItem,
  ListBoxItemProps,
  Popover,
  ValidationResult,
} from "react-aria-components";
import { ListData, useListData } from "react-stately";
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
import { classNames, getComponentToken, pxToRem } from "../utilities/css";
import { useScrollbar } from "../utilities/useScrollbar";

import styles from "./MultiSelect.module.scss";

type SelectedKey = {
  id: Key;
} & PillProps;

type MultipleSelectProps<T extends object> = Omit<
  ComboBoxPrimitiveProps<T>,
  | "children"
  | "validate"
  | "allowsEmptyCollection"
  | "inputValue"
  | "selectedKey"
  | "className"
  | "value"
  | "onSelectionChange"
  | "onInputChange"
> & {
  label: string;
  placeholder?: string;
  items: Array<T>;
  selectedItems: ListData<T>;
  className?: string;
  onItemInserted?: (key: Key) => void;
  onItemCleared?: (key: Key) => void;
  renderEmptyState?: (inputValue: string) => React.ReactNode;
  pill: (item: T) => React.ReactNode;
  children: React.ReactNode | ((item: T) => React.ReactNode);
  errorMessage?: string | ((validation: ValidationResult) => string);
  maxItemsUntilScroll?: MenuOverlayProps<T>["maxItemsUntilScroll"];
};

// inspired by https://github.com/irsyadadl/justd/blob/2.x/components/ui/multiple-select.tsx
const MultipleSelect = <T extends SelectedKey>({
  children,
  items,
  label,
  onItemCleared,
  onItemInserted,
  pill,
  selectedItems,
  maxItemsUntilScroll = DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
  ...props
}: MultipleSelectProps<T>) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState(0);

  const { contains } = useFilter({ sensitivity: "base" });
  const selectedKeys = selectedItems.items.map((i) => i.id);

  const filter = useCallback(
    (item: T, filterText: string) => {
      return (
        !selectedKeys.includes(item.id) && contains(item.label, filterText)
      );
    },
    [contains, selectedKeys],
  );

  const accessibleList = useListData({
    initialItems: items,
    filter,
  });

  const [fieldState, setFieldState] = useState<{
    selectedKey: Key | null;
    inputValue: string;
  }>({
    selectedKey: null,
    inputValue: "",
  });

  const onRemove = useCallback(
    (keys: Set<Key>) => {
      const key = keys.values().next().value;
      if (key) {
        selectedItems.remove(key);
        setFieldState({
          inputValue: "",
          selectedKey: null,
        });
        onItemCleared?.(key);
      }
    },
    [selectedItems, onItemCleared],
  );

  const onSelectionChange = (id: Key | null) => {
    if (!id) {
      return;
    }

    const item = accessibleList.getItem(id);

    if (!item) {
      return;
    }

    if (!selectedKeys.includes(id)) {
      selectedItems.append(item);
      setFieldState({ inputValue: "", selectedKey: id });
      onItemInserted?.(id);
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
    if (selectedItems.items.length === 0) {
      return;
    }

    const endKey = selectedItems.items[selectedItems.items.length - 1];

    if (endKey) {
      selectedItems.remove(endKey.id);
      onItemCleared?.(endKey.id);
    }

    setFieldState({
      inputValue: "",
      selectedKey: null,
    });
  }, [selectedItems, onItemCleared]);

  // handle deleting pills with keyboard
  const onKeyDownCapture = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && fieldState.inputValue === "") {
        popLast();
      }
    },
    [popLast, fieldState.inputValue],
  );

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
    <div
      ref={triggerRef}
      className={classNames(
        styles.MultiSelect,
        props.isDisabled && styles.disabled,
      )}
    >
      {selectedItems.items.length > 0 && (
        <PillGroup
          items={selectedItems.items}
          horizontalStackContainerProps={{ gap: "1" }}
          onRemove={onRemove}
          label={label}
        >
          {pill}
        </PillGroup>
      )}
      <div className={styles.comboBoxContainer}>
        <ComboBox
          {...props}
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
              placeholder={props.placeholder}
              className={styles.input}
              onBlur={() => {
                setFieldState({ inputValue: "", selectedKey: null });
                setTimeout(() => {
                  accessibleList.setFilterText("");
                });
              }}
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
          aria-hidden="true"
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
export type { MultipleSelectProps, SelectedKey };
