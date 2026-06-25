---
"@easypost/easy-ui": patch
---

Fix third-party overlays (e.g. Stripe Link/autofill) locking up when their modal (`allowsThirdPartyOverlays`) is nested inside another modal. A surrounding focus-trapping modal kept hiding the page (`inert`) and containing focus, which re-broke the injected overlay. A modal now automatically relaxes its focus trap and background hiding while it has an open `allowsThirdPartyOverlays` descendant, then restores them when that descendant closes. Modals without such a descendant are unaffected.
