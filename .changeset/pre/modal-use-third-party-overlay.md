---
"@easypost/easy-ui": minor
---

Add `useThirdPartyOverlay(isOpen)` to `Modal`. Called from inside a modal's content, it relaxes that modal's focus trap and background hiding (and every focus-trapping ancestor's) while `isOpen` is `true`, without remounting the content. Use it when a modal only hosts a third-party overlay, like Stripe's Financial Connections frame, for part of its lifetime; `allowsThirdPartyOverlays` stays the choice when a modal always hosts one.
