---
"@easypost/easy-ui": minor
---

Add `allowsThirdPartyOverlays` to `Modal.Trigger` and `ModalContainer`. When enabled, the modal stops trapping focus and stops applying `aria-hidden`/`inert` to the rest of the page, so third-party overlays that render outside the modal (e.g. Stripe Link/autofill, reCAPTCHA) remain focusable and clickable instead of locking up.
