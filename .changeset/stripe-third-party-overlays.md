---
"@easypost/easy-ui": minor
---

Add `Modal.ThirdPartyOverlayBoundary` for hosting third-party overlays that render outside the modal (e.g. Stripe Link/autofill, reCAPTCHA). Wrap a `Modal` with it and pass a `selector` matching the overlay nodes the widget appends to `document.body`; the boundary exempts those nodes from the modal's focus trap and `aria-hidden`/`inert` so they stay focusable and clickable instead of locking up. The modal stays mounted and keeps its focus containment for everything else.
