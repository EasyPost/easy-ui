# Contributing

Please read EasyPost's general [contribution guidelines](https://github.com/EasyPost/.github/blob/main/CONTRIBUTING.md).

## Code of conduct

Please read EasyPost's [code of conduct](https://github.com/EasyPost/.github/blob/main/CODE_OF_CONDUCT.md).

## Component API best practices

If your pull request involves changes to any component APIs, please read over our list of best practices below.

### One-offs

We define a one-off as a deviation from best practices. We understand that one-offs are virtually inevitable, so when we create them, we should have a good reason for doing so as creating one-offs adds additional context for contributors and users as well as introduces the possibility of creating inconsistent UX.

### Intuitive naming

Property names should be descriptive and intuitive of what they do. Intuitive names are preferred over descriptive names. For example, for a button, `urlLinkDestination` is a descriptive name, but `href` is intuitive.

### Consistent naming

Properties that have identical purposes across different components should share the same name. Similarly, properties that have identical purposes should also share the same type. If one component has a boolean `isValid`, other components that intend to control validity should do the same.

### Property dependency

Although unavoidable at times, we should do our best to not create properties that are dependent upon another. This helps avoid configurations that lead to invalid states. If a component has multiple dependent properties, take a closer look at the overall structure of the component.

### Booleans

- Booleans should be prefixed with simple verbs. For a button, the property name `isActive` is preferred to `active`.
- By default booleans should be false. This makes the notation a bit cleaner for when the boolean is active:

```JSX
  // avoid
  <Button isNotDisabled={false} />
```

```JSX
// preferred
<Button isDisabled />
```

- Avoid creating booleans with hierarchical structure. If an icon component can have more than two possible placements, avoid `isIconStart`, `isIconMiddle`, and `isIconEnd` since we’d have to decide which variant takes precedence. Instead use an enum.

### Events

- For components that process multiple events with the same verb, they should be named with a descriptive noun in between. For a table component that needs to respond to changes to its column and row, use `onRowChange` and `onColumnChange`.

### Abstractions

- Abstractions are really difficult to get right and reason about. No abstraction is preferred to clunky abstractions. Ideally we want our components to be as composable as possible.
- For components that need to render a subcomponent, use the slot paradigm of cloning the React element.

### Styling

- Components should not expose the classname name property as we run the risk of creating inconsistent UX.
