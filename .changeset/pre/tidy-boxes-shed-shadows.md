---
"@easypost/easy-ui": patch
---

Fixes `<Box />` passing its own `boxShadow`, `borderColor`, `borderStyle`, `zIndex`, `opacity`, `objectFit`, and `overscrollBehavior` down to any `<Box />` nested inside it. The custom properties those props set are inherited, and unlike the responsive props they weren't being reset per element — so a shadowed card painted its shadow again on every box within it. Genuinely inherited CSS properties (`color`, `whiteSpace`, `cursor`, `pointerEvents`) still pass down, as they should.
