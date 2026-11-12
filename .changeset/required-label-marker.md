---
"@easypost/easy-ui": minor
---

feat: mark a field's label when `isRequired` is set. `TextField`, `Textarea`, `Select`, `ComboBox`, `DatePicker`, `DateRangePicker`, and `ColorPickerInputField` now show a trailing `*` on the label of a required field. The `*` is hidden from assistive technology, so the accessible name stays the label text and the required state comes from the input. A new `necessityIndicator` prop, modeled on React Spectrum's, takes `"icon"` (the default `*`) or `"label"`, which shows "(required)" or "(optional)". `DatePicker` and `DateRangePicker` now accept `isRequired`. Remove any `*` typed into a `label` and set `isRequired` instead.
