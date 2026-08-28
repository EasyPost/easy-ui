---
"@easypost/easy-ui": minor
---

`ForgeLayout` supports an icon-only nav rail with `navState="rail"`, toggled by the new `ForgeLayout.NavToggle`. `navState` can now be left uncontrolled with `defaultNavState`, and changes are reported through `onNavStateChange`. `ForgeLayout.Nav` accepts `renderLogo` for a per-state logo, and `ForgeLayout.NavLink` accepts `label` and `renderBadge` so railed links keep their tooltip and badge. Existing `expanded` and `collapsed` behavior is unchanged.
