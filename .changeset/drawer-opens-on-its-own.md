---
"@easypost/easy-ui": patch
---

fix(Drawer): finish opening on the drawer's own transition; until some transition inside it happened to end, an opened `Drawer` stayed transparent and shifted right by a quarter of the window, with controls near its right edge off-screen
