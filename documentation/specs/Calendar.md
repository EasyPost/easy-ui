# `Calendar` Component Specification

## Overview

Calendar displays a grid of days in one month and allow users to select a single date.

### Use Cases

- Can be used as a date picker on forms.

### Features

- Supports disabled state
- Supports readonly state
- Can be controlled or uncontrolled
- Can set date availability

### Prior Art

- [Aria's `useCalendar`](https://react-spectrum.adobe.com/react-aria/useCalendar.html)
- [Aria's `useCalendarGrid`](https://react-spectrum.adobe.com/react-aria/useCalendar.html#usecalendargrid)
- [Aria's `useCalendarCell`](https://react-spectrum.adobe.com/react-aria/useCalendar.html#usecalendarcell)

---

## Design

The design of the `Calendar` component will rely heavily on React Aria's `useCalendar`, `useCalendarGrid`, and `useCalendarCell` hook. As such, the properties that are exposed by the component are largely synonymous with the props required by `useCalendar`, `useCalendarGrid`, and `useCalendarCell`.

### API

```ts
type CalendarProps = {
  /**
   * The minimum allowed date that a user may select.
   */
  minValue?: DateValue | null;
  /**
   * The maximum allowed date that a user may select.
   */
  maxValue?: DateValue | null;
  /**
   * Whether the calendar is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether the calendar value is immutable.
   * @default false
   */
  isReadOnly?: boolean;
  /**
   * The current value (controlled).
   */
  value?: DateValue | null;
  /**
   * The default value (uncontrolled).
   */
  defaultValue?: DateValue | null;
  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: MappedDateValue<DateValue | null>) => void;
  /**
   * Callback that is called for each date of the calendar. If
   * it returns true, then the date is unavailable.
   */
  isDateUnavailable?: (date: DateValue) => boolean;
  /**
   * Whether the current selection is invalid according to application logic.
   */
  isInvalid?: boolean;
  /**
   * An error message to display when the selected value is invalid.
   */
  errorMessage?: ReactNode;
  /**
   * Display the days falling into the other months.
   * @default false
   */
  showDaysOutsideCurrentMonth?: boolean;
};
```

### Example Usage

```tsx
import { Calendar } from "@easypost/easy-ui/Calendar";

function Component() {
  return <Calendar />;
}
```

_Default value:_

```tsx
import { Calendar } from "@easypost/easy-ui/Calendar";
import { CalendarDate } from "@internationalized/date";

function Component() {
  return <Calendar defaultValue={new CalendarDate(2024, 7, 4)} />;
}
```

_Disabled:_

```tsx
import { Calendar } from "@easypost/easy-ui/Calendar";

function Component() {
  return <Calendar isDisabled />;
}
```

_Read-only:_

```tsx
import { Calendar } from "@easypost/easy-ui/Calendar";

function Component() {
  return <Calendar isReadOnly />;
}
```

_Set minimum and maximum allowed date:_

```tsx
import { Calendar } from "@easypost/easy-ui/Calendar";
import { today, getLocalTimeZone } from "@internationalized/date";

function Component() {
  return (
    <Calendar
      minValue={today(getLocalTimeZone())}
      maxValue={today(getLocalTimeZone()).add({ days: 10 })}
    />
  );
}
```

_Set date availability:_

```tsx
import { Calendar } from "@easypost/easy-ui/Calendar";
import { today, getLocalTimeZone } from "@internationalized/date";

function Component() {
  return (
    <Calendar
      isDateUnavailable={(date) => today(getLocalTimeZone()).compare(date) > 0}
    />
  );
}
```

_Show date outside current month:_

```tsx
import { Calendar } from "@easypost/easy-ui/Calendar";

function Component() {
  return <Calendar showDaysOutsideCurrentMonth />;
}
```

_Controlled selection:_

```tsx
import { Calendar } from "@easypost/easy-ui/Calendar";
import { today, getLocalTimeZone } from "@internationalized/date";

function Component() {
  const [date, setDate] = React.useState(today(getLocalTimeZone()));
  const handleChange = (v) => {
    setDate(v);
  };
  return <Calendar value={date} onChange={handleChange} />;
}
```

_Invalid selection:_

```tsx
import { Calendar } from "@easypost/easy-ui/Calendar";
import { today, getLocalTimeZone, isWeekend } from "@internationalized/date";
import { useLocale } from "react-aria";

function Component() {
  const [date, setDate] = React.useState(today(getLocalTimeZone()));
  const { locale } = useLocale();
  const handleChange = (v: DateValue) => {
    setDate(v);
  };
  const isInvalid = isWeekend(date, locale);

  return (
    <Calendar
      value={date}
      onChange={handleChange}
      isInvalid={isInvalid}
      errorMessage={isInvalid && "Weekend is not available"}
    />
  );
}
```

---

## Behavior

### Accessibility

Most accessibility issues will be handled with React Aria.

### Dependencies

- React Aria's `useCalendar`, `useCalendarGrid`, `useCalendarCell` and `useLocale `
- React Stately's `useCalendarState`
- `@internationalized/date`
