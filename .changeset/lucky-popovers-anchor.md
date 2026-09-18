---
"@easypost/easy-ui": minor
---

Adds `<Popover />`, which displays arbitrary content in a dialog anchored to a trigger — a form, a summary, a list of rich rows. `<Popover.Trigger />` clones any focusable child, so every Easy UI button works as the trigger, as does a consumer's own component. Content can be passed to `<Popover.Overlay />` directly or split across `<Popover.Header />`, `<Popover.Body />`, and `<Popover.Footer />`, in which case the header and footer stay pinned and only the body scrolls. `<Popover.Title />` supplies the overlay's accessible name, and `usePopoverTrigger()` lets content inside the overlay close it. The surface is a `<Box />`, so `<Popover.Overlay />` also accepts every `<Box />` style prop for a popover that needs to look different.

Also adds `<SelectButton />`, exported from `Select`. It's the field visual `<Select />` renders for its own trigger, made available on its own so an overlay that isn't a listbox can be attached to a field-shaped trigger. `<Select />`'s own API is unchanged.

Fixes a `<Select />` placeholder longer than a narrow field wrapping to a second line, which made the field taller than its neighbors. Placeholders now truncate, the way a selected value already did.
