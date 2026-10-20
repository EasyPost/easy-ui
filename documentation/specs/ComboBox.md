# `ComboBox` Component Specification

## Overview

A `ComboBox` is a text input with a list of suggestions under it. The user types, the list narrows or is fetched, and the user either picks a suggestion or—when allowed—keeps what they typed.

### Use Cases

- Address autocomplete, where suggestions come from a service such as Google Places and the typed text is a valid value on its own.
- Picking one value from a list too long to scan, such as a country or a carrier.

### Features

- Reads as a `TextField`: `label`, `helperText`, `errorText`, `validationState`, `isRequired`, `size`, `iconAtStart`.
- Filters `defaultItems` as the user types, or shows `items` fetched by the consumer.
- `isLoading` shows an indicator at the end of the input while a request is in flight.
- `allowsCustomValue` keeps text that doesn't match a suggestion.
- Options take a secondary `description` and can be grouped with `<ComboBox.Section />`, as in `Select`.
- `footer` renders content below the suggestions, such as an attribution, that can't be focused or selected.

### Risks and Challenges

- **Fetched suggestions arrive after the input changes.** React Aria opens the list on an input change only if there's something to show, so suggestions that arrive after a debounce would stay hidden until the next keystroke. `ComboBox` opens the list when they arrive, as long as the user has typed since the list last opened or closed—so suggestions refetched for the text a selection filled in don't reopen it, and neither do results that land after Escape.
- **Not `Popover`.** Easy UI's `Popover` is a dialog that takes focus. Focus has to stay in the input, so the list uses React Aria's non-modal `Popover`, as `MultiSelect` does.
- **Not `MultiSelect`.** `MultiSelect` is built on the same React Aria `ComboBox`, but clears its input after each pick and holds its value as pills.
- **Matching `Select`.** The field reuses `InputField`'s `Label`, `InputCaption`, `InputIcon`, and mixins, and the list reuses `Menu`'s mixins and overlay constants—the pieces `Select` is built from—so the two read as one family.

### Prior Art

- [React Aria `ComboBox`](https://react-spectrum.adobe.com/react-aria/ComboBox.html)
- [WAI-ARIA Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [MUI `Autocomplete`](https://mui.com/material-ui/react-autocomplete/)
- `GooglePlacesPredictionsField` in the EasyPost web app, a reactstrap `Dropdown` around a `TextField`, which this replaces.

---

## Design

### API

`ComboBox` passes React Aria `ComboBox`'s props through—`items`, `defaultItems`, `inputValue`, `onInputChange`, `selectedKey`, `onSelectionChange`, `allowsCustomValue`, `menuTrigger`, `disabledKeys`, `name`, and so on—except the ones it owns: `selectionMode` (always single), `isInvalid` and validation (replaced by `validationState`), and `allowsEmptyCollection`.

```ts
type ComboBoxProps<T extends object> = AriaComboBoxProps<T> & {
  children: ReactNode | ((item: T) => ReactNode);
  label?: ReactNode;
  isLabelEmphasized?: boolean;
  helperText?: ReactNode;
  errorText?: ReactNode;
  validationState?: "valid" | "invalid";
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  iconAtStart?: IconSymbol;
  isLoading?: boolean;
  footer?: ReactNode;
  maxItemsUntilScroll?: number;
};

// Mirrors `Select.Option`, plus `id` and `isDisabled`. Children are truncated
// to one line; string children double as `textValue`, the text the input takes
// when the option is selected.
type ComboBoxOptionProps = {
  id?: Key;
  "aria-label"?: string;
  children: ReactNode;
  description?: ReactNode;
  textValue?: string;
  isDisabled?: boolean;
};

// Mirrors `Select.Section`. Sections are divided by a separator.
type ComboBoxSectionProps = {
  children: ReactNode;
  "aria-label"?: string;
};
```

### Example Usage

_Filtering a fixed list:_

```tsx
<ComboBox label="Fruit" defaultItems={fruits}>
  {(item) => <ComboBox.Option id={item.id}>{item.name}</ComboBox.Option>}
</ComboBox>
```

_Address autocomplete:_

```tsx
<ComboBox
  aria-label="Street address"
  allowsCustomValue
  isRequired
  validationState={showValidation ? validation.street1 : "valid"}
  errorText="Please enter a valid street address"
  inputValue={street1}
  onInputChange={onStreet1Change}
  items={predictions}
  isLoading={isFetching}
  onSelectionChange={(key) => key && selectPrediction(key)}
  footer="Powered by Google"
>
  {(item) => (
    <ComboBox.Option
      id={item.place_id}
      textValue={item.structured_formatting.main_text}
      description={item.structured_formatting.secondary_text}
    >
      {item.structured_formatting.main_text}
    </ComboBox.Option>
  )}
</ComboBox>
```

### Anatomy

```tsx
<AriaComboBox>
  <Label />
  <Group>
    <InputIcon />
    <Input />
    <Spinner />
  </Group>
  <InputCaption /> {/* through the description or errorMessage slot */}
  <Popover>
    <ScrollContainer>
      <ListBox>{sections and options}</ListBox>
    </ScrollContainer>
    <footer />
  </Popover>
</AriaComboBox>
```

### DOM Structure

```html
<div class="root">
  <label id="label" for="input">Street address</label>
  <div role="presentation">
    <input
      id="input"
      role="combobox"
      aria-labelledby="label"
      aria-describedby="caption"
      aria-autocomplete="list"
      aria-expanded="true"
      aria-controls="listbox"
      aria-activedescendant="option-1"
    />
    <div role="status" aria-label="Loading"></div>
  </div>
  <div id="caption">Helper or error text</div>
</div>

<!-- portaled -->
<div class="popover">
  <div class="scrollContainer">
    <div role="listbox" id="listbox">
      <div role="option" id="option-1">417 Montgomery St, …</div>
    </div>
  </div>
  <div class="footer">Powered by Google</div>
</div>
```

---

## Behavior

### States and Interactions

- Typing opens the list when there are suggestions, and closes it when there are none.
- Fetched `items` that arrive after typing open the list.
- Selecting a suggestion fills the input with its `textValue`, closes the list, and calls `onSelectionChange` with its key. A controlled `inputValue` receives the text through `onInputChange`.
- Leaving the field reverts unmatched text to the selection, unless `allowsCustomValue` is set.
- Pressing the footer keeps focus in the input.

### Accessibility

- The input is a `combobox` with `aria-autocomplete="list"`, labelled by `label` or `aria-label`. A console warning fires when neither is set.
- Helper and error text describe the input. `validationState="invalid"` sets `aria-invalid`.
- The footer sits outside the `listbox`, so it isn't announced as an option.

#### Keyboard Navigation and Focus

- Focus stays in the input. Arrow keys move a virtual focus through the options (`aria-activedescendant`).
- Enter selects the focused option. Escape closes the list.
- ArrowDown opens a closed list.

### Performance

Options aren't virtualized. Fetched suggestion lists are short; for long fixed lists, prefer a filtered `defaultItems` and keep `maxItemsUntilScroll` small.

## Dependencies

- `react-aria-components`'s `ComboBox`, `Group`, `Input`, `ListBox`, `Popover`, `Text`
- Easy UI's `InputField` `Label`, `InputIcon`, and mixins; `Spinner`; `Text`
