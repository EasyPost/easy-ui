---
"@easypost/easy-ui": minor
---

Makes `<SplitToggleCard />` a compound component with `ToggleContainer`, `Toggle`, `Status`, `ContentContainer`, and `Title` parts, plus a `useSplitToggleCardState()` hook for building custom parts. `<SplitToggleCard.Status />` states the current state under the switch, with `on` and `off` labels or a custom component, in a panel sized to the wider status. `<SplitToggleCard.Title />` names the switch. Passing content alone still works as a shorthand.

The root's `variant` now sets the card surface (`outlined` or `solid`, for use inside another card) instead of the switch's color. Set the switch's color with `<SplitToggleCard.Toggle variant />`.
