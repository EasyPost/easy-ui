---
"@easypost/easy-ui": patch
---

Keeps `useNotification()`'s value the same across renders, so effects and callbacks keyed on it no longer rerun after every notification
