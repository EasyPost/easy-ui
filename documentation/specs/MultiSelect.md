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
  children: ReactNode | ((item: T) => ReactNode);

  /** Placeholder text when no input value is entered. */
  placeholder?: string;

  /** Array of available items. */
  items: Array<T>;

  /** Maximum number of items visible in dropdown before scrolling. */
  maxItemsUntilScroll?: number;

  /** The currently selected keys in the collection (controlled). */
  selectedKeys: Iterable<Key>;

  /** Handler that is called when the selection changes. */
  onSelectionChange: (keys: Iterable<Key>) => void;

  /** Render function for each selected pill. Extends Pill component. */
  renderPill: (item: T) => ReactNode;
};
```

### Example Usage

```tsx
import { Item, MultipleSelect, Key } from "./MultiSelect";

function App() {
  const [selectedKeys, setSelectedKeys] = useState<Iterable<Key>>(["1", "2"]);
  return (
    <MultiSelect
      items={[
        { key: "1", label: "Option 1" },
        { key: "2", label: "Option 2" },
        { key: "3", label: "Option 3" },
      ]}
      onSelectionChange={setSelectedKeys}
      placeholder="Select an item"
      renderPill={(item) => <MultipleSelect.Pill label={item.label} />}
      selectedKeys={selectedKeys}
    >
      {(item) => (
        <MultipleSelect.Option textValue={item.label}>
          <MultipleSelect.OptionText>{item.label}</MultipleSelect.OptionText>
        </MultipleSelect.Option>
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
