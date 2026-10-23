---
"@easypost/easy-ui": patch
---

fix(DatePicker): drop the padding around literal segments like `/` and lighten them to `color.neutral.400` so `DatePicker` and `DateRangePicker` render dates as `9/24/2026` instead of `9 / 24 / 2026`
