---
"@easypost/easy-ui": patch
---

feat(Chart): add `variant="bare"` to render Chart's heading, description, plot, and data-table disclosure without its own Card wrapper, for a consumer that already supplies a surrounding Card. Defaults to `"card"`, the existing behavior, so this is additive and non-breaking.
