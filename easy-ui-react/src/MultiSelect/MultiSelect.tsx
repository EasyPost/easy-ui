import KeyboardArrowDownIcon from "@easypost/easy-ui-icons/KeyboardArrowDown";
import React, {
  KeyboardEvent,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Key, useFilter, VisuallyHidden } from "react-aria";
import {
  Button,
  ComboBox,
  ComboBoxProps,
  Input,
  ListBox,
  ListBoxItem,
  ListBoxItemProps,
  Popover,
} from "react-aria-components";
import { AsyncListData, useAsyncList, useListData } from "react-stately";
import { Icon } from "../Icon";
import { MenuOverlayProps } from "../Menu/MenuOverlay";
import {
  DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
  getMenuPopoverMaxHeight,
  ITEM_HEIGHT,
  Y_PADDING_INSIDE_OVERLAY,
} from "../Menu/utilities";
import { PillGroup, PillProps } from "../PillGroup";
import { Spinner } from "../Spinner";
import { Text, TextProps } from "../Text";
import { getComponentToken, pxToRem } from "../utilities/css";
import { useScrollbar } from "../utilities/useScrollbar";

import styles from "./MultiSelect.module.scss";

type Item = { key: Key } & PillProps;

type MultipleSelectProps<T extends object> = {
  children: React.ReactNode | ((item: T) => React.ReactNode);
  maxItemsUntilScroll?: MenuOverlayProps<T>["maxItemsUntilScroll"];
  placeholder?: string;
  renderPill: (item: T) => React.ReactNode;

  dropdownItems: ComboBoxProps<T>["items"];
  inputValue: ComboBoxProps<T>["inputValue"];
  onInputChange: ComboBoxProps<T>["onInputChange"];
  disabledKeys?: ComboBoxProps<T>["disabledKeys"];
  isLoading?: AsyncListData<T>["isLoading"];

  /**
   * The currently selected keys in the collection (controlled).
   */
  selectedItems: T[];

  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange: (items: T[]) => void;
};

// some inspiration from https://github.com/irsyadadl/justd/blob/2.x/components/ui/multiple-select.tsx
// note that there are some limitations to this until React Aria builds a dedicated component
// https://github.com/adobe/react-spectrum/issues/2140
const MultipleSelect = <T extends Item>(props: MultipleSelectProps<T>) => {
  const {
    children,
    maxItemsUntilScroll = DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
    onSelectionChange,
    placeholder,
    renderPill,
    selectedItems,
    dropdownItems = [],
    inputValue,
    onInputChange = () => {},
    isLoading,
    disabledKeys,
  } = props;

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState(0);
  const [comboBoxSelectedKey, setComboBoxSelectedKey] = useState<Key | null>(
    null,
  );

  const onRemove = (keys: Set<Key>) => {
    const key = keys.values().next().value;
    if (key) {
      onSelectionChange(selectedItems.filter((k) => k.key !== key));
      onInputChange("");
      setComboBoxSelectedKey(null);
    }
  };

  const onComboBoxSelectionChange = (key: Key | null) => {
    if (!key) {
      return;
    }

    const item = [...dropdownItems].find((i) => i.key === key);
    if (!item) {
      return;
    }

    if (!selectedItems.map((i) => i.key).includes(key)) {
      onSelectionChange([...selectedItems, item]);
      setComboBoxSelectedKey(key);
    }

    onInputChange("");
  };

  const onComboBoxInputChange = (value: string) => {
    onInputChange(value);
    setComboBoxSelectedKey((prevSelectedKey) =>
      value === "" ? null : prevSelectedKey,
    );
  };

  const onKeyDownCapture = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "") {
      if (selectedItems.length === 0) {
        return;
      }

      if (selectedItems.length > 0) {
        const endItem = selectedItems[selectedItems.length - 1];
        onSelectionChange(selectedItems.filter((k) => k.key !== endItem.key));
      }

      onInputChange("");
      setComboBoxSelectedKey(null);
    }
  };

  const onBlurInput = () => {
    onInputChange("");
    setComboBoxSelectedKey(null);
  };

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
      {selectedItems.length > 0 && (
        <PillGroup
          items={selectedItems}
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
          selectedKey={comboBoxSelectedKey}
          onSelectionChange={onComboBoxSelectionChange}
          items={dropdownItems}
          inputValue={inputValue}
          onInputChange={onComboBoxInputChange}
          disabledKeys={disabledKeys}
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
            {isLoading ? (
              <div className={styles.spinnerContainer}>
                <div className={styles.spinner}>
                  <Spinner isIndeterminate aria-label="Loading" size="sm" />
                </div>
              </div>
            ) : (
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
            )}
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

export { MultipleSelect, useAsyncList, useListData, useFilter };
export type { Item, Key, MultipleSelectProps };
