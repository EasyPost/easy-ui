---
"@easypost/easy-ui": minor
---

update React Aria packages to latest

React Aria consolidated its individual `@react-aria/*` and `@react-stately/*`
packages into the `react-aria` and `react-stately` monopackages, so imports now
come from those directly. `RangeCalendar`'s `isDateUnavailable` now receives the
in-progress range's anchor date as a second argument.
