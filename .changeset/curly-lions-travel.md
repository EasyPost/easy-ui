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

This is backwards compatible. Without a `navigate` function React Aria's router
context reports itself as native and the new click handling is a noop, so links
behave exactly as before. Links to other origins, links with `target="_blank"`,
download links, and modifier-clicked links continue to load normally even when a
`navigate` function is configured. The `as`/`hrefComponent` props remain
supported for components that need a specific link component, and take
precedence over the provider's router.
