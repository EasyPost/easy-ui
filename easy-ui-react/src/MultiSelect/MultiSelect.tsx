import KeyboardArrowDownIcon from "@easypost/easy-ui-icons/KeyboardArrowDown";
import React, { KeyboardEvent, useRef, useState } from "react";
import { Key, useFilter, VisuallyHidden } from "react-aria";
import { Button, ComboBox, ComboBoxProps, Input } from "react-aria-components";
import { AsyncListData, useAsyncList, useListData } from "react-stately";
import { Icon } from "../Icon";
import { MenuOverlayProps } from "../Menu/MenuOverlay";
import { DEFAULT_MAX_ITEMS_UNTIL_SCROLL } from "../Menu/utilities";
import { PillGroup, PillProps, PillBackground } from "../PillGroup";
import {
  MultiSelectDropdown,
  MultiSelectDropdownOption,
  MultiSelectDropdownOptionText,
} from "./MultiSelectDropdown";
import { useElementWidth } from "./utilities";

import styles from "./MultiSelect.module.scss";
import { Text } from "../Text";

export type Item = { key: Key } & PillProps;

export type MultiSelectProps<T extends object> = {
  /**
   * The children to render inside the multi-select component. This can either be a direct
   * React node or a function that takes an item from the provided collection and returns a React node.
   */
  children: React.ReactNode | ((item: T) => React.ReactNode);

  /**
   * A list of keys representing disabled items in the dropdown. These items will be
   * non-selectable in the multi-select input.
   */
  disabledKeys?: ComboBoxProps<T>["disabledKeys"];

  /**
   * The list of items to display in the dropdown. These items are typically passed down
   * from a ComboBox component and represent the available options for selection.
   */
  dropdownItems: ComboBoxProps<T>["items"];

  /**
   * The current input value in the multi-select input field. This is used to filter or search
   * for items within the dropdown list.
   */
  inputValue: ComboBoxProps<T>["inputValue"];

  /**
   * A boolean flag that indicates whether the dropdown is in a loading state.
   * When true, the dropdown will display a loading spinner or indicator.
   */
  isLoading?: AsyncListData<T>["isLoading"];

  /**
   * The maximum number of items to show before the dropdown becomes scrollable.
   * This value is passed down from the MenuOverlay component and controls the
   * appearance of the dropdown when there are too many items to display.
   */
  maxItemsUntilScroll?: MenuOverlayProps<T>["maxItemsUntilScroll"];

  /**
   * Handler that is triggered whenever the input value changes. It is typically used to
   * filter or update the available dropdown items based on the input.
   */
  onInputChange: ComboBoxProps<T>["onInputChange"];

  /**
   * A callback handler that is invoked when the selection changes. It receives the updated
   * list of selected items and is typically used to manage state or trigger other side effects.
   */
  onSelectionChange: (items: T[]) => void;

  /**
   * Placeholder text that appears when no items are selected in the multi-select input.
   */
  placeholder?: string;

  /**
   * Function that renders a "pill" or tag-like element for each selected item in the multi-select.
   * This is useful for custom rendering of selected items.
   */
  renderPill: (item: T) => React.ReactNode;

  /**
   * The currently selected items in the collection. This is a controlled value that reflects
   * the currently selected items.
   */
  selectedItems: T[];

  /**
   * The background of individual pills.
   */
  pillBackground?: PillBackground;
};

/**
 * An input and dropdown that allows users to select multiple options from a list.
 *
 * @privateRemarks
 * Some inspiration from
 * https://github.com/irsyadadl/justd/blob/2.x/components/ui/multiple-select.tsx
 * Note that there are some limitations to this component until React Aria
 * builds a dedicated component:
 * https://github.com/adobe/react-spectrum/issues/2140
 *
 * @example
 * _Sync list:_
 * ```tsx
 * const [selectedItems, setSelectedItems] = React.useState<Item[]>([]);
 * const { contains } = useFilter({ sensitivity: "base" });
 * const filter = useCallback(
 *   (item: Item, filterText: string) => contains(item.label, filterText),
 *   [contains],
 * );
 * const list = useListData<Item>({
 *   initialSelectedKeys: [],
 *   initialItems: [{ key: 1, label: "Apple" }, { key: 2, label: "Banana" }],
 *   filter,
 * });
 *
 * <MultiSelect
 *   isLoading={list.isLoading}
 *   dropdownItems={list.items}
 *   inputValue={list.filterText}
 *   onInputChange={list.setFilterText}
 *   disabledKeys={selectedItems.map((item) => item.key)}
 *   selectedItems={selectedItems}
 *   onSelectionChange={setSelectedItems}
 *   placeholder="Select a fruit"
 *   maxItemsUntilScroll={10}
 *   renderPill={(item) => (
 *     <MultiSelect.Pill label={item.label} />
 *   )}
 * >
 *   {(item) => (
 *     <MultiSelect.Option textValue={item.label}>
 *       <MultiSelect.OptionText>{item.label}</MultiSelect.OptionText>
 *     </MultiSelect.Option>
 *   )}
 * </MultiSelect>
 * ```
 */
export function MultiSelect<T extends Item>(props: MultiSelectProps<T>) {
  const {
    children,
    disabledKeys,
    dropdownItems = [],
    inputValue,
    isLoading,
    maxItemsUntilScroll = DEFAULT_MAX_ITEMS_UNTIL_SCROLL,
    onInputChange = () => {},
    onSelectionChange,
    placeholder,
    renderPill,
    selectedItems,
    pillBackground,
  } = props;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const clearComboBoxButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // ComboBox needs a temporary selected key to handle changes properly
  const [tempSelectedKey, setTempSelectedKey] = useState<Key | null>(null);

  const rootWidth = useElementWidth(rootRef);

  const onRemoveSelectedItem = (keys: Set<Key>) => {
    const key = keys.values().next().value;
    if (key) {
      onSelectionChange(selectedItems.filter((k) => k.key !== key));
      onInputChange("");
      setTempSelectedKey(null);
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
      setTempSelectedKey(key);
    }

    onInputChange("");
  };

  const onComboBoxInputChange = (value: string) => {
    onInputChange(value);
    setTempSelectedKey((prevSelectedKey) =>
      value === "" ? null : prevSelectedKey,
    );
  };

  const onComboBoxInputKeyDownCapture = (
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && inputValue === "") {
      if (selectedItems.length === 0) {
        return;
      }

      if (selectedItems.length > 0) {
        const endItem = selectedItems[selectedItems.length - 1];
        onSelectionChange(selectedItems.filter((k) => k.key !== endItem.key));
      }

      onInputChange("");
      setTempSelectedKey(null);
    }
  };

  const onComboBoxInputBlur = () => {
    onInputChange("");
    setTempSelectedKey(null);
  };

  return (
    <div ref={rootRef} className={styles.MultiSelect}>
      {selectedItems.length > 0 ? (
        <PillGroup
          items={selectedItems}
          horizontalStackContainerProps={{ gap: "1" }}
          onRemove={onRemoveSelectedItem}
          label="Selected items"
          background={pillBackground}
        >
          {renderPill}
        </PillGroup>
      ) : (
        <VisuallyHidden>
          <Text>No selected items</Text>
        </VisuallyHidden>
      )}
      <div className={styles.comboBoxContainer}>
        <ComboBox
          className={styles.comboBox}
          allowsEmptyCollection
          aria-label="Available items"
          selectedKey={tempSelectedKey}
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
              onBlur={onComboBoxInputBlur}
              onKeyDownCapture={onComboBoxInputKeyDownCapture}
            />
            <VisuallyHidden>
              <Button
                type="button"
                slot="remove"
                aria-label="Clear"
                ref={clearComboBoxButtonRef}
              />
            </VisuallyHidden>
          </div>
          <MultiSelectDropdown
            triggerRef={rootRef}
            menuRef={menuRef}
            maxItemsUntilScroll={maxItemsUntilScroll}
            isLoading={isLoading}
            width={rootWidth}
          >
            {children}
          </MultiSelectDropdown>
        </ComboBox>
        <button
          type="button"
          className={styles.dropdownArrowButton}
          onClick={() => clearComboBoxButtonRef.current?.click()}
          tabIndex={-1}
        >
          <Text visuallyHidden>Open dropdown</Text>
          <Icon symbol={KeyboardArrowDownIcon} />
        </button>
      </div>
    </div>
  );
}

/**
 * Represents a selected item as pill in a `<MultiSelect />`.
 */
MultiSelect.Pill = PillGroup.Pill;

/**
 * Represents a dropdown option in a `<MultiSelect />`.
 */
MultiSelect.Option = MultiSelectDropdownOption;

/**
 * Represents the default text in a dropdown option in a `<MultiSelect />`.
 */
MultiSelect.OptionText = MultiSelectDropdownOptionText;

export { useAsyncList, useFilter, useListData };
export type { Key };
