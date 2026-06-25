---
"@easypost/easy-ui": minor
---

Add `childNestingBehavior` and `selfNestingBehavior` props to `Modal.Trigger` and `ModalContainer` to control how modals stack when nested. The connection between a parent and a nested child can resolve to `stack` (both keep their backdrops — the default), `stack-shared-backdrop` (the nested modal suppresses its backdrop so only the lowest backdrop shows), or `replace` (the nested modal hides the modal beneath it).

Configure it from either end: `childNestingBehavior` is set on the parent, applies to its children, and cascades down the tree; `selfNestingBehavior` is set on the child, applies only to its own connection to its parent, does not cascade, and overrides the parent's `childNestingBehavior` for that connection. `selfNestingBehavior` is useful for surgically changing one nested modal in a large tree without touching its parent.
