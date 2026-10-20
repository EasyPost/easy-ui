---
"@easypost/easy-ui": minor
---

Adds `<ComboBox />`, a text input with a list of suggestions under it, built on React Aria's `ComboBox`. It takes `TextField`'s `label`, `helperText`, `errorText`, `validationState`, `isRequired`, and `size`; filters `defaultItems` as the user types or shows fetched `items` with an `isLoading` indicator; keeps free text with `allowsCustomValue`; and renders an optional `footer`, such as a "Powered by Google" attribution, below the options. `<ComboBox.Option />` and `<ComboBox.Section />` mirror `Select`'s, including an option `description`.
