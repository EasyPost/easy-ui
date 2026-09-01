---
"@easypost/easy-ui": minor
---

Honor `<Provider navigate />` in components that render links

`<Provider navigate useHref />` populates React Aria's router context, but most
Easy UI components built their anchors with `useButton()` or by hand, neither of
which reads that context. Those components did a full page load even when a
`navigate` function was configured.

`<Button />`, `<IconButton />`, `<DropdownButton />`, `<KebabButton />`,
`<TabNav.Item />`, `<VerticalNav.Item />`, `<VerticalNav.Subnav.Item />`,
`<VerticalNav.SupplementaryAction as="a" />`, and everything else built on
`<UnstyledButton />` (`<PlanCard.Button />`, `<SearchNav />` CTAs,
`<Pagination />`, `<ForgeLayout.BackButton />`) now navigate through the
provider's `navigate` function and resolve their `href` through its `useHref`.
`<Menu.Item href />` already navigated client-side, but rendered the unresolved
`href`; it now respects `useHref` as well.

These components also accept `routerOptions` for passing router-specific options
through to `navigate`.

Separately, `onClick` on `<Button />` and everything else built on
`<UnstyledButton />` fired twice per click, because React Aria's `useButton()`
already calls it and the original handler was spread onto the element alongside
it. It now fires once.

Apps that don't pass `navigate` are unaffected. React Aria's router context
reports itself as native, the new click handling is a noop, and links behave
exactly as before.

Apps that already pass `navigate` keep working, but the links listed above stop
doing a full page load. Same-origin links, including hash-only ones, are handed
to `navigate`, so a link that has to reach the server—a download, a sign out, a
path served by another app on the same origin—needs to say so. Links to other
origins, links with `target="_blank"` or `download`, modifier-clicked links, and
links whose `onClick` calls `preventDefault()` continue to load natively. So do
disabled links, which render without an `href`. The `as`/`hrefComponent` props
remain supported for components that need a specific link component, and take
precedence over the provider's router.
