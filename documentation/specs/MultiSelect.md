# `MultiSelect` Component Specification

## Overview

The `MultiSelect` component allows users to select multiple options from a list.

### Use Cases

- Used in forms requiring multi-selection fields.
- Suitable for workflows needing multiple discrete selections.

### Features

- Dynamic filtering of options via text input.
- Pill-based display of selected items with removable pills.
- Customizable rendering for items and pills.
- Configurable maximum number of visible options before scrolling.
- Keyboard and mouse navigation support.
- Accessibility compliant with ARIA roles and attributes.

### Risks and Challenges

- Performance optimization for large datasets.
- Maintaining accessibility while supporting extensive customization.
- Handling dynamic dropdown positioning within constrained containers.

### Prior Art

- [MUI `<Autocomplete />`](https://mui.com/material-ui/react-autocomplete/)
- [Ant Design `<Select mode="multiple" />`](https://ant.design/components/select/)
- [Chakra UI `<Select />`](https://chakra-ui.com/docs/components/select)
- [React Spectrum `<ComboBox />`](https://react-spectrum.adobe.com/react-spectrum/ComboBox.html)

---

## Design

### API

The `MultiSelect` API is a limited subset of `react-aria-component`'s `ComboBox` component extended to support multiple selected keys. Support for more `ComboBox` functionality may be added in the future.

`MultiSelect` is an entirely controlled component. Support for uncontrolled behavior may be added in the future.

`items` passed to a `MultiSelect` extend `PillProps`. They must contain a `key` and `label`. Optionally they can have an attached `icon` for rendering in the dropdown option and pill.

`MultiSelect` supports dynamic item and pill rendering.

```ts
type MultiSelectProps<T extends object> = {
  /** Children or render function for dropdown options. */
  children: React.ReactNode | ((item: T) => React.ReactNode);

  /** List of disabled item keys. */
  disabledKeys?: Array<Key>;

  /** Array of dropdown items (dynamic or async). */
  dropdownItems: T[];

  /** Current input value for filtering dropdown items. */
  inputValue: string;

  /** Flag indicating if the dropdown is in a loading state. */
  isLoading?: boolean;

  /** Maximum number of items visible before scrolling. */
  maxItemsUntilScroll?: number;

  /** Callback fired when the input value changes. */
  onInputChange: (value: string) => void;

  /** Callback fired when the selection changes. */
  onSelectionChange: (items: T[]) => void;

  /** Placeholder text when no items are selected. */
  placeholder?: string;

  /** Render function for each selected pill. */
  renderPill: (item: T) => React.ReactNode;

  /** Array of currently selected items. */
  selectedItems: T[];
};
```

### Example Usage

_Sync list_

```tsx
import { Item, MultiSelect, Key, useListData, useFilter } from "./MultiSelect";

function App() {
  const [selectedItems, setSelectedItems] = React.useState<Item[]>([]);
  const { contains } = useFilter({ sensitivity: "base" });
  const filter = useCallback(
    (item: Item, filterText: string) => contains(item.label, filterText),
    [contains],
  );
  const list = useListData<Item>({ initialItems: fruits, filter });
  return (
    <div style={{ display: "inline-flex", width: "100%", maxWidth: 600 }}>
      <MultiSelect
        isLoading={list.isLoading}
        dropdownItems={list.items}
        inputValue={list.filterText}
        onInputChange={list.setFilterText}
        disabledKeys={selectedItems.map((item) => item.key)}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        placeholder="Select a fruit"
        maxItemsUntilScroll={10}
        renderPill={(item) => (
          <MultiSelect.Pill icon={item.icon} label={item.label} />
        )}
      >
        {(item) => (
          <MultiSelect.Option textValue={item.label}>
            <HorizontalStack gap="1" blockAlign="center">
              {item.icon && <Icon symbol={item.icon} />}
              <MultiSelect.OptionText>{item.label}</MultiSelect.OptionText>
            </HorizontalStack>
          </MultiSelect.Option>
        )}
      </MultiSelect>
    </div>
  );
}
```

_Async list_

```tsx
import { MultiSelect, Item, Key, useAsyncList, useFilter } from "./MultiSelect";

function App() {
  const [selectedItems, setSelectedItems] = React.useState<Item[]>([]);
  const { contains } = useFilter({ sensitivity: "base" });
  const list = useAsyncList<Item>({
    initialSelectedKeys: [],
    async load({ filterText }) {
      // perform a fetch to a server
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        items: fruits.filter((fruit) => {
          return filterText ? contains(fruit.label, filterText) : true;
        }),
      };
    },
  });
  return (
    <MultiSelect
      isLoading={list.isLoading}
      dropdownItems={list.items}
      inputValue={list.filterText}
      onInputChange={list.setFilterText}
      disabledKeys={selectedItems.map((item) => item.key)}
      selectedItems={selectedItems}
      onSelectionChange={setSelectedItems}
      placeholder="Select a fruit"
      maxItemsUntilScroll={10}
      renderPill={(item) => (
        <MultiSelect.Pill icon={item.icon} label={item.label} />
      )}
    >
      {(item) => (
        <MultiSelect.Option textValue={item.label}>
          <HorizontalStack gap="1" blockAlign="center">
            {item.icon && <Icon symbol={item.icon} />}
            <MultiSelect.OptionText>{item.label}</MultiSelect.OptionText>
          </HorizontalStack>
        </MultiSelect.Option>
      )}
    </MultiSelect>
  );
}
```

### Anatomy

- **Pill Group**: Displays selected items as removable tags.
- **ComboBox Dropdown**: Contains selectable options.
- **ComboBox Option**: A single item in the dropdown.
- **ComboBox Input**: Allows filtering of dropdown options.
- **ComboBox Trigger**: Activates the dropdown.

### Behavior

#### Accessibility

- ARIA roles (`combobox`, `listbox`, `option`) are applied.
- Keyboard support:
  - Arrow keys to navigate options.
  - Enter/space to select an option.
  - Backspace to remove tags.
- Screen readers announce active options and selection states.

#### Interactions

- Selecting an option adds it to the selected items.
- Removing a tag removes the corresponding item from the selection.
- Input field supports filtering and keyboard interactions.

---

## Dependencies

- `react-aria`—`useFilter`, `ComboBox`, `ListBox`, `Popover`, `Button`
- `react-stately`—`useListData`
- `@easypost/easy-ui-icons`—Icons for visual elements
- `@easypost/easy-ui`—Supporting utilities (e.g., `PillGroup`, `Text`)
