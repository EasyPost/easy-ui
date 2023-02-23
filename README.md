# Easy UI

> Resources, components, and design guidelines for shaping the shipper experience at EasyPost.

| Status | Owner            | Help                                                        |
| :----- | :--------------- | :---------------------------------------------------------- |
| Active | EasyPost/easy-ui | [New issue](https://github.com/EasyPost/easy-ui/issues/new) |

## About this repo

The EasyPost/easy-ui repository is a monorepo made up of NPM packages and websites.

```sh
easy-ui/
├── .storybook                  # Storybook website
├── documentation               # Documentation for working with Easy UI
├── easy-ui-icons               # Icons for Easy UI
├── easy-ui-react               # Components for @easypost/easy-ui package
├── easy-ui-tokens              # Design tokens for Easy UI
├── easy-ui-tsconfig            # TypeScript configuration for Easy UI
└── eslint-config-easy-ui       # ESLint rules for Easy UI
└── stylelint-easy-ui           # Style rules for Easy UI
```

## Commands

| Command                   | Runs                                     |
| :------------------------ | :--------------------------------------- |
| `npm i`                   | Installs project dependencies            |
| `npm run clean`           | Removes temp directories from workspaces |
| `npm run format`          | Formats files with prettier              |
| `npm run start:storybook` | Starts Storybook for dev                 |
| `npm run build:icons`     | Builds Easy UI Icons                     |
| `npm run build:storybook` | Builds Storybook for serving             |
| `npm run build:react`     | Builds Easy UI React                     |
| `npm run build:tokens`    | Builds Easy UI design tokens             |
| `npm run test`            | Tests Easy UI                            |

## Contribute to this repo

Pull requests are welcome. See the [contribution guidelines](https://github.com/EasyPost/easy-ui/blob/main/.github/CONTRIBUTING.md) for more information.

## Licenses

Source code is under an [MIT license](https://github.com/EasyPost/.github/blob/main/LICENSE).
