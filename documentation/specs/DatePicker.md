# `DatePicker` Component Specification

## Overview

DatePicker combine a date field and a calendar popver to allow users to enter or select a date.

### Use Cases

- Use a DatePciker when you want to provide a view that allows the users to select a date.

### Features

- Supports setting dates availability
- Support minimum and maximum allowed dates
- Supports being controlled

### Prior Art

- [Aria's `useDatePicker`](https://react-spectrum.adobe.com/react-aria/useDatePicker.html)
- [Aria's `useDateRangePicker`](https://react-spectrum.adobe.com/react-aria/useDateRangePicker.html)
- [Paste `Date Picker`](https://paste.twilio.design/components/date-picker)

---

## Design

The `DatePicker` will utilize `useDatePicker` and `useDateRangePicker` from `React Aria` to ensure an accessible date picker experience.

The component includes a `DatePickerBase` that determines whether it's a `DatePicker` or a `DateRangePicker`, depending on the state is passed into.

`DatePickerTiger` features a `DateField` that enables users to input dates, along with a calendar icon that opens the `DatePickerOverlay`, allowing users to select dates from the calendar component.

### API

```ts
export type DatePickerProps = {
  /**
   * Accessibility label for input field.
   */
  "aria-label"?: string;
  /**
   * The content to display as the label.
   */
  label?: string;
  /**
   * The default value (uncontrolled).
   */
  defaultValue?: DateValue | null;
  /**
   * The current value (controlled).
   */
  value?: DateValue | null;
  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: MappedDateValue<DateValue> | null) => void;
  // onChange?: (value: DateValue | null) => void;
  /**
   * The minimum allowed date that a user may select.
   */
  minValue?: DateValue;
  /**
   * The maximum allowed date that a user may select.
   */
  maxValue?: DateValue;
  /**
   * Whether the input is disabled.
   */
  isDisabled?: boolean;
  /**
   * Whether the input value is invalid.
   */
  isInvalid?: boolean;
  /**
   * An error message to display when the selected value is invalid.
   */
  errorMessage?: ReactNode;
  /**
   * Callback that is called for each date of the calendar. If
   * it returns true, then the date is unavailable.
   */
  isDateUnavailable?: (date: DateValue) => boolean;
  /**
   * The size of the DatePicker.
   * @default md
   */
  size?: "sm" | "md";
};
```

```ts
export type DateRangePickerProps = {
  /**
   * Accessibility label for input field.
   */
  "aria-label"?: string;
  /**
   * The content to display as the label.
   */
  label?: string;
  /**
   * The default value (uncontrolled).
   */
  defaultValue?: RangeValue<DateValue> | null;
  /**
   * The current value (controlled).
   */
  value?: RangeValue<DateValue> | null;
  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: RangeValue<MappedDateValue<DateValue>> | null) => void;
  /**
   * The minimum allowed date that a user may select.
   */
  minValue?: DateValue;
  /**
   * The maximum allowed date that a user may select.
   */
  maxValue?: DateValue;
  /**
   * Whether the input is disabled.
   */
  isDisabled?: boolean;
  /**
   * Whether the input value is invalid.
   */
  isInvalid?: boolean;
  /**
   * An error message to display when the selected value is invalid.
   */
  errorMessage?: ReactNode;
  /**
   * Callback that is called for each date of the calendar. If
   * it returns true, then the date is unavailable.
   */
  isDateUnavailable?: (date: DateValue) => boolean;
  /**
   * The size of the DateRangePicker.
   * @default md
   */
  size?: "sm" | "md";
};
```

### Example Usage

_Standalone_:

```tsx
import { DatePicker } from "@easypost/easy-ui/DatePicker";

function PageWithDatePicker() {
  return <DatePicker />;
}
```

_Default value:_

```tsx
import { DatePicker } from "@easypost/easy-ui/DatePicker";

function PageWithDatePicker() {
  return <DatePicker defaultValue={today(getLocalTimeZone())} />;
}
```

_Disabled:_

```tsx
import { DatePicker } from "@easypost/easy-ui/DatePicker";

function PageWithDatePicker() {
  return <DatePicker isDisabled />;
}
```

_Minimum and maximum allowed dates:_

```tsx
import { DatePicker } from "@easypost/easy-ui/DatePicker";

function PageWithDatePicker() {
  return (
    <DatePicker
      minValue={today(getLocalTimeZone()).subtract({ days: 10 })}
      maxValue={today(getLocalTimeZone())}
    />
  );
}
```

_Dates availabilty:_

```tsx
import { DatePicker } from "@easypost/easy-ui/DatePicker";

function PageWithDatePicker() {
  return (
    <DatePicker
      isDateUnavailable={(date) => today(getLocalTimeZone()).compare(date) > 0}
    />
  );
}
```

_Controlled:_

```tsx
import { DatePicker } from "@easypost/easy-ui/DatePicker";

function PageWithDatePicker() {
  const [date, setDate] = React.useState<MappedDateValue<DateValue> | null>(
    null,
  );

  return <DatePicker value={date} onChange={setDate} />;
}
```

_Invalid:_

```tsx
import { DatePicker } from "@easypost/easy-ui/DatePicker";

function PageWithDatePicker() {
  const { locale } = useLocale();
  const [date, setDate] = React.useState<MappedDateValue<DateValue> | null>(
    endOfWeek(today(getLocalTimeZone()), locale),
  );

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      isInvalid={isInvalid}
      errorMessage={isInvalid && "Weekend is not available"}
    />
  );
}
```

## Behavior

### Accessibility

- Accessibility are handle by `useDatePicker` and `useDateRangePicker` from `Reat Aria`.

### Dependencies

- `useDatePicker` and `useDateRangePicker` from `Reat Aria`
