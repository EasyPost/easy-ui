# `RadioButtonGroup` Component Specification

## Overview

A `RadioButtonGroup` is a group of connected buttons that act as a radio group.

### Use Cases

- Used `<RadioButtonGroup />` when you want to toggle between two or more values for a given attribute

### Features

- Supports lables
- Supports EasyUI colors

### Prior Art

- [Aria `<ToggleButtonGroup />`](https://react-spectrum.adobe.com/react-aria/ToggleButtonGroup.html)

---

## Design

A `<RadioButtonGroup />` is a compound component and the buttons will render via `<RadioButtonGroup.Button />`. It will make use of the `react-aria-components`, `ToggleButtonGroup` and `ToggleButton`.

### API

```ts
export type RadioButtonGroupProps = {
  /**
   * Color for the selected button in the group.
   * @default "primary"
   */
  color?: ThemeColorAliases;
  /** Label for the radio group. */
  label?: ReactNode;
  /**
   * The name of the radio group, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name_and_radio_buttons).
   */
  name?: string;
  /** Handler that is called when the value changes. */
  onChange?: (value: string) => void;
  /** The current value (controlled). */
  value?: string;
};
export type RadioButtonGroupButtonProps = {
  /**
   * The label for the radio button.
   */
  children: ReactNode;
  /**
   * Whether the radio button is disabled or not.
   */
  isDisabled?: boolean;
  /**
   * The value of the radio button, used when submitting an HTML form.
   */
  value: String;
};
```

### Example Usage

```tsx
import { RadioButtonGroup } from "@easypost/easy-ui/RadioButtonGroup";
import SettingsIcon from "@easypost/easy-ui-icons/Settings";

function Component() {
  return (
    <RadioButtonGroup>
      <RadioButtonGroup.Button value="in">in</RadioButtonGroup.Button>
      <RadioButtonGroup.Button value="cm">cm</RadioButtonGroup.Button>
    </RadioButtonGroup>
  );
}
```

---

## Behavior

### Accessibility

- A radio group must have a label that is in close proximity to the control. The label should be visible unless the grouping is visually implicit.
- Ensure the radio label text includes wording that successfully describes the requirement to the user that they should select the radio
- When in an error state, display an error tooltip describing the error.
- Radio groups act as a single tab stop. When focused on a radio, use the arrow keys to navigate to the other radios.

### Best Practices

- Should include at least two or more options.
- List options in a rational order that makes logical sense.

## Dependencies

- [React Aria](https://react-spectrum.adobe.com/react-aria/)
