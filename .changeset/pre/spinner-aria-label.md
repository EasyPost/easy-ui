---
"@easypost/easy-ui": patch
---

fix(Spinner): name a `<Spinner />` by its `aria-label` or `aria-labelledby`. It used to point `aria-labelledby` at its hidden "Loading" fallback even when one was passed, and `aria-labelledby` outranks `aria-label`, so a spinner without `children` always announced "Loading". The fallback now renders only when nothing else names the spinner.
