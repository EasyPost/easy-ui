---
"@easypost/easy-ui": patch
---

Upgrades `react-syntax-highlighter` to v16, which moves to `refractor` v5, and removes the `window.Prism.manual` workaround in `CodeSnippet` that the older `refractor` needed to avoid hydration errors.
