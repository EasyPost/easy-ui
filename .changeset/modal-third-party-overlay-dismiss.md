---
"@easypost/easy-ui": patch
---

Fix react-aria overlays (e.g. `Select`, `Menu`) not closing on outside click when rendered inside a `Modal` that uses `allowsThirdPartyOverlays`. The modal box was tagged `data-react-aria-top-layer`, which made react-aria treat every click inside the modal as "not outside" for all overlays. Modals now keep nested overlays dismissable while preserving the third-party overlay behavior: the modal stays visible under a surrounding modal, clicking a nested modal no longer dismisses the one beneath it, and genuine third-party overlays (e.g. Stripe) still don't dismiss the modal.
