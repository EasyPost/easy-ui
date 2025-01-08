# `MultipleSelect` Component Specification

## Overview

The `MultipleSelect` component enables users to select multiple options from a list. It features filtering, tag-based displays for selected items, and accessibility compliance. The component is highly customizable, supporting dynamic item rendering, styling, and behavior for various use cases.

### Use Cases

- Used in forms requiring multi-selection fields.
- Applied in filtering interfaces to refine displayed data.
- Suitable for workflows needing multiple discrete selections.

### Features

- Dynamic filtering of options.
- Tag-based display of selected items with removable tags.
- Customizable rendering for items and tags.
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

```ts
export interface MultipleSelectProps<T extends object> {
  /** Placeholder text when no items are selected. */
  placeholder?: string;

  /** Array of available items. */
  items: Array<T>;

  /** ListData instance managing selected items. */
  selectedItems: ListData<T>;

  /** Callback triggered when an item is added. */
  onItemSelected?: (key: Key) => void;

  /** Callback triggered when an item is removed. */
  onItemRemoved?: (key: Key) => void;

  /** Render function for each selected pill. */
  renderPill: (item: T) => React.ReactNode;

  /** Children or render function for dropdown options. */
  children: React.ReactNode | ((item: T) => React.ReactNode);

  /** Maximum number of items visible before scrolling. */
  maxItemsUntilScroll?: number;
}
```

### Example Usage

```tsx
import { MultiSelect } from "@easypost/easy-ui/MultiSelect";
import { useListData } from "react-stately";

const items = [
  { id: "1", label: "Option 1" },
  { id: "2", label: "Option 2" },
  { id: "3", label: "Option 3" },
];

function App() {
  const selectedItems = useListData<SelectedKey>({
    initialItems: [items[0]],
  });
  return (
    <MultipleSelect
      items={items}
      maxItemsUntilScroll={10}
      onItemSelected={(key) => console.log(`Item added: ${key}`)}
      onItemRemoved={(key) => console.log(`Item removed: ${key}`)}
      placeholder="Select an item"
      renderPill={(item) => <MultipleSelect.Pill label={item.label} />}
      selectedItems={selectedItems}
    >
      {(item) => (
        <MultipleSelect.Option textValue={item.label}>
          <MultipleSelect.OptionText>{item.label}</MultipleSelect.OptionText>
        </MultipleSelect.Option>
      )}
    </MultipleSelect>
  );
}
```

### Anatomy

- **Popover**: Contains selectable options.
- **Option**: A single item in the dropdown.
- **PillGroup**: Displays selected items as removable tags.
- **ComboBox Trigger**: Activates the dropdown.
- **ComboBox Input**: Allows filtering of options.

### Behavior

#### Accessibility

- ARIA roles (`combobox`, `listbox`, `option`) are applied.
- Keyboard support:
  - Enter/space to select an option.
  - Backspace to remove tags.

#### Interactions

- Selecting an option adds it to the selected items.
- Removing a tag removes the corresponding item from the selection.
- Input field supports filtering and keyboard interactions.
- Dropdown closes on selection.

---

## Dependencies

- `react-aria`—`useFilter`, `ComboBox`, `ListBox`, `Popover`, `Button`
- `react-stately`—`useListData`
- `@easypost/easy-ui-icons`—Icons for visual elements
- `@easypost/easy-ui`—Supporting utilities (e.g., `PillGroup`, `Text`)
