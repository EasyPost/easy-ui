---
"@easypost/easy-ui": minor
---

Adds `maxRows="auto"` to `<DataGrid />`, which bounds the data grid by the height its container makes available and scrolls the rows within it rather than showing a set number of rows. It shrinks to its rows when they don't fill that space, and a container that stretches it instead turns the auto height into a fill that anchors the footer to the bottom of the layout. Sizing is handled entirely in CSS, so nothing is measured in JavaScript
