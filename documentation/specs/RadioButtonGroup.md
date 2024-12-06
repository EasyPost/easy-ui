# `RadioButtonGroup` Component Specification

## Overview

A `RadioButtonGroup` is a group of connected buttons that act as a radio group.

### Use Cases

- Used `<RadioButtonGroup />` when you want to toggle between two or more values for a given attribute

### Features

- Supports labels
- Supports EasyUI colors

### Prior Art

- [Aria `<ToggleButtonGroup />`](https://react-spectrum.adobe.com/react-aria/ToggleButtonGroup.html)

---

## Design

A `<RadioButtonGroup />` is a compound component and the buttons will render via `<RadioButtonGroup.Button />`. It will make use of the `react-aria-components`, `ToggleButtonGroup` and `ToggleButton`.

### API

```ts
export type RadioButtonGroupProps = AriaLabelingProps & {
  /**
   * Color for the selected button in the group.
   * @default "primary"
   */
  color?: ThemeColorAliases;
  /**
   * Whether single or multiple selection is enabled.
   * @default "single"
   */
  selectionMode?: "single" | "multiple";
  /**
   * Whether the collection allows empty selection.
   * @default true
   */
  disallowEmptySelection?: boolean;
  /**
   * 	The currently selected keys in the collection (controlled).
   */
  selectedKeys?: string[];
  /**
   * The initial selected keys in the collection (uncontrolled).
   */
  defaultSelectedKeys?: string[];
  /**
   * Whether all items are disabled.
   */
  isDisabled?: boolean;
  /**
   * RadioButtonGroup Buttons
   */
  children: ReactNode;
  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange: () => void;
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
   * An identifier for the item in selectedKeys.
   */
  id: string;
};
```

### Example Usage

```tsx
import * as React from "react";
import { RadioButtonGroup } from "@easypost/easy-ui/RadioButtonGroup";
import SettingsIcon from "@easypost/easy-ui-icons/Settings";

function Component() {
  const [selected, setSelected] = React.useState(New Set(["in"]));
  return (
    <RadioButtonGroup selectedKeys={New Set(["in"])} onSelectionChange={setSelected}>
      <RadioButtonGroup.Button id="in">in</RadioButtonGroup.Button>
      <RadioButtonGroup.Button id="cm">cm</RadioButtonGroup.Button>
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
