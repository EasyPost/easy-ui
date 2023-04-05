---
"@easypost/easy-ui-icons": patch
"@easypost/easy-ui": patch
---

Disable minification on build output

Because Easy UI is intended to be included in bundlers outside of the library, the library itself shouldn't be minified due to double minification problems.
