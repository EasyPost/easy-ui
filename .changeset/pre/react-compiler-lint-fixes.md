---
"@easypost/easy-ui": patch
---

fix(ProductLayout): portal the collapsed sidebar into the layout container on every render. The sidebar read the container from a ref during render, so it fell back to `document.body` if it rendered before the container mounted; the container is now held in state.
