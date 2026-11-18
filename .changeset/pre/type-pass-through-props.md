---
"@easypost/easy-ui": minor
---

feat: type props the components already handle at runtime. `VerticalNav.Item` accepts a node `label` with a plain-text `textValue`. `TextField` accepts `type="url"` and `type="number"`. `CodeSnippet` accepts `language="text"`, and `language` is now optional, defaulting to plain text. `Menu.Item` accepts `textValue` and `isDisabled`. `PillGroup.Pill` accepts `id`, which `onRemove` receives. `Checkbox` and `RadioGroup` accept `id`. `Stepper.Step` no longer requires `children`. `UnstyledButton` takes `onMouseEnter` and `onMouseLeave`, and `UnstyledButton` and `UnstyledPressButton` forward refs typed to the elements they render.
