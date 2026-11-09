---
"@easypost/easy-ui": patch
---

feat(TextField): move the password visibility toggle inside the input. The input and toggle used to split one border between them, so focusing either one outlined only half the field. The toggle now sits inside the input's border, the input's focus ring wraps the whole field, and the toggle shows its own inset ring when it has keyboard focus.
