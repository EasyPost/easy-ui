---
"@easypost/easy-ui": patch
---

fix(DatePicker): drop the padding around literal segments like `/` so `DatePicker` and `DateRangePicker` render dates as `9/24/2026` instead of `9 / 24 / 2026`
