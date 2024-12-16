# `DatePicker` Component Specification

## Overview

DatePicker combine a date field and a calendar popver to allow users to enter or select a date.

### Use Cases

- Use a DatePciker when you want to provide a view that allows the users to select a date.

### Features

- Supports setting dates availability
- Supports being controlled

### Prior Art

- [Aria's `useDatePicker`](https://react-spectrum.adobe.com/react-aria/useDatePicker.html)
- [Aria's `useDateRangePicker`](https://react-spectrum.adobe.com/react-aria/useDateRangePicker.html)
- [Paste `Date Picker`](https://paste.twilio.design/components/date-picker)

---

## Design

`DatePicker` will use `useDatePicker` and `useDateRangePicker` from `React Aria` to helps achieve accessible date picker.

A `DatePicker` composes several other components to product a composite element that can be used to enter dates with keyboard, or select them on a calendar. The component consist of `DatePicker` wrapper, `DatePicker.Trigger` to open a `DatePicker.Overlay` containing a `Calendar` and `DateField` for selecting and inputing dates.

### API

```ts
type DatePickerProps = {
  /**
   * The content to display as the label.
   */
  label: ReactNode;
  /**
   * The minimum allowed date that a user may select.
   */
  minValue: DateValue;
  /**
   * The maximum allowed date that a user may select.
   */
  maxValue: DateValue;
  /**
   * Callback that is called for each date of the calendar. If it returns
   * true, then the date is unavailable.
   */
  isDateUnavailable: (date: DateValue) => boolean;
  /**
   * A placeholder date that influences the format of the placeholder shown
   * when no value is selected. Defaults to today's date at midnight.
   */
  placeholderValue: DateValue;
  /**
   * Whether the input is disabled.
   */
  isDisabled: boolean;
  /**
   * Whether the input can be selected but not changed by the user.
   */
  isReadOnly: boolean;
  /**
   * Whether user input is required on the input before form submission.
   */
  isRequired: boolean;
  /**
   * Whether the input value is invalid.
   */
  isInvalid: boolean;
  /**
   * An error message for the field.
   */
  errorMessage: ReactNode;
};
```

### Example Usage

_Standalone_:

```tsx
import { DatePicker } from "@easypost/easy-ui/DatePicker";
import { Calendar } from "@easypost/easy-ui/Calendar";
import { DateField } from "@easypost/easy-ui/DateField";

function PageWithDatePicker() {
  return (
    <DatePicker>
      <DatePicker.Trigger>
        <Button>01/01/2024 - 02/01/2024</Button>
      </DatePicker.Trigger>
      <DatePicker.Overlay>
        <DateField />
        <Calendar />
      </DatePicker.Overlay>
    </DatePicker>
  );
}
```

## Behavior

### Accessibility

- Accessibility are handle by `useDatePicker` and `useDateRangePicker` from `Reat Aria`.

### Dependencies

- `useDatePicker` and `useDateRangePicker` from `Reat Aria`
