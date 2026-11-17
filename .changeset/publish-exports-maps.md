---
"@easypost/easy-ui-icons": patch
"@easypost/easy-ui-tokens": patch
---

fix: keep the `exports` map in the published `package.json`, so Node's ES module resolver can load icons and tokens without a bundler
