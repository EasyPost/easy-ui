# @easypost/easy-ui

## 1.0.0-alpha.3

### Minor Changes

- 891be83: Add `<Menu />` component
- 6e715f9: Add `Tooltip` component
- dfee220: Add `<Badge />` component
- 118d4c7: Add `Banner` component
- 6f700a7: Add `UnstyledButton` component

### Patch Changes

- f413f81: Use `UnstyledButton` to carry core button logic for `Button`, `DropdownButton`, and `IconButton`
- 6baff22: Use theme-aware variables

  With theming setup, update CSS modules and relevant places in JS components with tokens that are theme-aware.

- Updated dependencies [6baff22]
- Updated dependencies [891be83]
- Updated dependencies [6e715f9]
- Updated dependencies [dfee220]
  - @easypost/easy-ui-tokens@1.0.0-alpha.2
  - @easypost/easy-ui-icons@1.0.0-alpha.3

## 1.0.0-alpha.2

### Patch Changes

- 36b8403: Disable minification on build output

  Because Easy UI is intended to be included in bundlers outside of the library, the library itself shouldn't be minified due to double minification problems.

- Updated dependencies [36b8403]
  - @easypost/easy-ui-icons@1.0.0-alpha.2

## 1.0.0-alpha.1

### Patch Changes

- cd5cdbb: Use older build target in publishing process, reorganize chunks, and include README and CHANGELOG for distribution
- Updated dependencies [cd5cdbb]
  - @easypost/easy-ui-tokens@1.0.0-alpha.1
  - @easypost/easy-ui-icons@1.0.0-alpha.1

## 1.0.0-alpha.0

### Major Changes

- 83d6255: Add versioning
