---
"@easypost/easy-ui": minor
---

feat(FormLayout): add a `padding` prop and inherit text color

`FormLayout` takes a `padding` prop that accepts a space token. It defaults to `"3"`, matching the previous fixed padding, and accepts `"0"` for forms inside a surface that already pads them.

`FormLayout` no longer sets `color: primary.800`, so its text inherits from the surface it sits on. Pages that relied on that navy should set `color` on their own surface.
