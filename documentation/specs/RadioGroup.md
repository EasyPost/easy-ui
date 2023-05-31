# `RadioGroup` Component Specification

## Overview

A Radio Group is a form element that lets users select a single choice from a list of at least two options.

### Use Cases

- Use a radio group to select a single choice from a list of at least two options. The user can only select one radio option at a time.

### Features

- Supports labels
- Supports invalid state and custom error message in a tooltip
- Supports disabled state
- Supports readonly state
- Can be controlled or uncontrolled

### Prior Art

- [Aria's `useRadioGroup`](https://react-spectrum.adobe.com/react-aria/useRadioGroup.html)
- [Paste `<RadioGroup />`](https://paste.twilio.design/components/radio-group)

---

## Design

The design of the `RadioGroup` component will rely heavily on React Aria's `useRadioGroup` hook. As such, the properties that are exposed by the component are largely synonymous with the props required by `useRadioGroup`.

_Note that radios are only made meaningful as a part of a broader group. Due to this, a standalone radio component doesn't exist._

### API

```ts
type RadioGroupProps = {
  /** Radio buttons to render inside the radio group. */
  children?: ReactNode;

  /** The default value (uncontrolled). */
  defaultValue?: string;

  /** Whether the radio is disabled. */
  isDisabled?: boolean;

  /** Whether or not the radio group label is visually hidden. Only recommended for when the grouping is visually implicit. */
  isLabelVisuallyHidden?: boolean;

  /** Whether the radio group can be selected but not changed by the user. */
  isReadOnly?: boolean;

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

type RadioGroupItemProps = {
  /**
   * The label for the radio.
   */
  children: ReactNode;

  /**
   * Error text that appears in a tooltip.
   */
  errorText?: ReactNode;

  /**
   * Whether the radio button is disabled or not.
   */
  isDisabled?: boolean;

  /**
   * Whether the radio should display its "valid" or "invalid" visual styling
   * @default valid
   */
  validationState?: ValidationState;

  /**
   * The value of the radio button, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#Value).
   */
  value: string;
};
```

### Example Usage

```tsx
import { RadioGroup } from "@easypost/easy-ui/RadioGroup";

function Component() {
  return (
    <RadioGroup label="Favorite pet">
      <Radio value="dogs">Dogs</Radio>
      <Radio value="cats">Cats</Radio>
    </RadioGroup>
  );
}
```

_Default value:_

```tsx
import { RadioGroup } from "@easypost/easy-ui/RadioGroup";

function Component() {
  return (
    <RadioGroup label="Favorite pet" defaultValue="dogs">
      <RadioGroup.Item value="dogs">Dogs</RadioGroup.Item>
      <RadioGroup.Item value="cats">Cats</RadioGroup.Item>
    </RadioGroup>
  );
}
```

_Controlled:_

```tsx
import { RadioGroup } from "@easypost/easy-ui/RadioGroup";

function Component() {
  const [selected, setSelected] = useState("dogs");
  return (
    <RadioGroup label="Favorite pet" value={selected} onChange={setSelected}>
      <RadioGroup.Item value="dogs">Dogs</RadioGroup.Item>
      <RadioGroup.Item value="cats">Cats</RadioGroup.Item>
    </RadioGroup>
  );
}
```

_Disabled group:_

```tsx
import { RadioGroup } from "@easypost/easy-ui/RadioGroup";

function Component() {
  return (
    <RadioGroup label="Favorite pet" isDisabled>
      <RadioGroup.Item value="dogs">Dogs</RadioGroup.Item>
      <RadioGroup.Item value="cats">Cats</RadioGroup.Item>
    </RadioGroup>
  );
}
```

_Disabled item:_

```tsx
import { RadioGroup } from "@easypost/easy-ui/RadioGroup";

function Component() {
  return (
    <RadioGroup label="Favorite pet">
      <RadioGroup.Item value="dogs" isDisabled>
        Dogs
      </RadioGroup.Item>
      <RadioGroup.Item value="cats">Cats</RadioGroup.Item>
    </RadioGroup>
  );
}
```

_Read-only:_

```tsx
import { RadioGroup } from "@easypost/easy-ui/RadioGroup";

function Component() {
  return (
    <RadioGroup label="Favorite pet" isReadOnly>
      <RadioGroup.Item value="dogs">Dogs</RadioGroup.Item>
      <RadioGroup.Item value="cats">Cats</RadioGroup.Item>
    </RadioGroup>
  );
}
```

_Form submission data:_

```tsx
import { RadioGroup } from "@easypost/easy-ui/RadioGroup";

function Component() {
  return (
    <RadioGroup label="Favorite pet" name="pets">
      <RadioGroup.Item value="dogs">Dogs</RadioGroup.Item>
      <RadioGroup.Item value="cats">Cats</RadioGroup.Item>
    </RadioGroup>
  );
}
```

_Error:_

```tsx
import { RadioGroup } from "@easypost/easy-ui/RadioGroup";

function Component() {
  return (
    <RadioGroup label="Favorite pet" isReadOnly>
      <RadioGroup.Item value="dogs">Dogs</RadioGroup.Item>
      <RadioGroup.Item
        value="cats"
        validationState="invalid"
        errorText="Required value"
      >
        Cats
      </RadioGroup.Item>
    </RadioGroup>
  );
}
```

### Anatomy

The `RadioGroup.Item` component will render a visually hidden `input` and defer styling to custom elements. The component will be wrapped in a `label`.

```tsx
const RadioGroupContext = React.createContext(null);

export function RadioGroup() {
  const { radioGroupProps, labelProps, state } = useAriaRadioGroup();
  return (
    <div {...radioGroupProps}>
      <span {...labelProps}>{label}</span>
      <RadioContext.Provider value={state}>{children}</RadioContext.Provider>
    </div>
  );
}

function RadioGroupItem(props) {
  return (
    <label>
      <VisuallyHidden>
        <input {...inputProps} />
      </VisuallyHidden>
      <span>
        <RadioIcon />
        <RadioLabel />
      </span>
    </label>
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
- Allow users to select only one option.
- If a radio group includes more than 6 options, consider using a Select.
- List options in a rational order that makes logical sense.

### Dependencies

- React Aria's `useRadioGroup`, `useRadio`, `VisuallyHidden`, `useRadioGroupState`, and `ValidationState`
