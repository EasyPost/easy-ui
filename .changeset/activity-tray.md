---
"@easypost/easy-ui": minor
---

Adds `<ActivityTray />`, which reports on background work—buying labels, generating a report, importing a CSV—from a corner of the screen without blocking the page. Each `<ActivityTray.Task />` is a row that names the work, shows determinate or indeterminate progress, and ends in a `succeeded`, `partial`, `failed`, or `canceled` state, with up to two `<ActivityTray.Action />` elements for Cancel, Retry, or View. Succeeded and canceled rows retire themselves after `autoDismissDelay`, held while the pointer or focus is inside the tray; partial and failed rows stay until dismissed. Past one task the tray gains a collapsible summary header. Terminal outcomes are announced through a single live region, and the tray is a named landmark.

`NotificationOffset` is now an alias of a shared `Offset` type, which `ActivityTrayOffset` also aliases. Its shape is unchanged.
