---
"@easypost/easy-ui": patch
---

fix(Menu): "Select all" skips items disabled with `Menu.Item`'s `isDisabled`, as it does items in `disabledKeys`. Before, such an item still counted as selectable, so selecting every enabled item left "Select all" indeterminate, and clicking it selected all rather than clearing the selection.
