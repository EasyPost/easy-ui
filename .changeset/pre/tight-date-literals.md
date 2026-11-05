---
"@easypost/easy-ui": patch
---

fix(DatePicker): drop the padding around literal segments like `/`, halve it on the editable segments, and lighten the literals to `color.neutral.400` so `DatePicker` and `DateRangePicker` render dates as `9/24/2026` instead of `9 / 24 / 2026`
