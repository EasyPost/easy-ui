---
"@easypost/easy-ui": patch
---

fix global style leak from CustomerPortalLayout action buttons

`CustomerPortalLayoutActions` styled its hover and focus states with bare
`[data-hovered="true"]` and `[data-focus-visible="true"]` selectors. CSS Modules
only scope class names, so those rules shipped unscoped in `style.css` and
applied a grey background and focus ring to *any* React Aria element in the
document — most visibly the `MultiSelect` input and its dropdown options. The
selectors are now scoped to the component's own button, matching
`ForgeLayoutActions`.
