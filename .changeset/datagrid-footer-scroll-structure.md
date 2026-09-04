---
"@easypost/easy-ui": patch
---

Restructures `<DataGrid />`'s footer to sit outside the grid's scroll container rather than sticking to the bottom of it, so the grid's scroll geometry belongs to the header and rows alone. The footer no longer measures itself in JavaScript, no longer holds a fixed height, and can no longer widen the table or add horizontal scroll the columns don't need. Per design, the grid also scrolls without drawing scrollbars
