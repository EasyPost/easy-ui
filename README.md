# Easy UI

> Resources, components, and design guidelines for shaping the shipper experience at EasyPost.

| Status | Owner            | Help                                                        |
| :----- | :--------------- | :---------------------------------------------------------- |
| Active | EasyPost/easy-ui | [New issue](https://github.com/EasyPost/easy-ui/issues/new) |

## About this repo

The EasyPost/easy-ui repository is a monorepo made up of NPM packages and websites.

```sh
easy-ui/
├── .changeset                  # Versioning changesets
├── .storybook                  # Public Storybook
├── documentation               # Internal decisions and specifications
├── easy-ui-icons               # SVG icons and React icon components
├── easy-ui-react               # React Components
├── easy-ui-tokens              # Design Tokens
├── easy-ui-tsconfig            # TypeScript Configuration
└── eslint-config-easy-ui       # Internal ESLint rules
└── scripts                     # Utility scripts
└── stylelint-easy-ui           # Internal Stylelint rules
```

## Commands

| Command                    | Runs                                         |
| :------------------------- | :------------------------------------------- |
| `npm i`                    | Installs project dependencies                |
| `npm run build`            | Builds Easy UI                               |
| `npm run build:icons`      | Builds Easy UI Icons                         |
| `npm run build:storybook`  | Builds Storybook for serving                 |
| `npm run build:react`      | Builds Easy UI React                         |
| `npm run build:tokens`     | Builds Easy UI design tokens                 |
| `npm run changes:add`      | Adds a changeset                             |
| `npm run changes:publish`  | Publishes the currently versioned changesets |
| `npm run changes:status`   | Retrieves status of changesets               |
| `npm run changes:version`  | Versions the current changesets              |
| `npm run clean`            | Removes temp directories from workspaces     |
| `npm run dev`              | Builds Easy UI on file changes               |
| `npm run lint`             | Lints Easy UI                                |
| `npm run format`           | Formats files with prettier                  |
| `npm run start:storybook`  | Starts Storybook for dev                     |
| `npm run test`             | Tests Easy UI                                |
| `npm run test:watch:react` | Tests Easy UI React in watch mode            |

## Contribute to this repo

Pull requests are welcome. See the [contribution guidelines](https://github.com/EasyPost/easy-ui/blob/main/.github/CONTRIBUTING.md) for more information.

## Licenses

Source code is under an [MIT license](https://github.com/EasyPost/.github/blob/main/LICENSE).

## Getting Started

Easy UI can be seamlessly integrated into React projects.

Run the following command using [npm](https://www.npmjs.com/) to get started:

```bash
npm install @easypost/easy-ui --save
```

See Easy UI's React [documentation](easy-ui-react/README.md) for detailed usage information.

Detailed documentation Easy UI components can be found on Easy UI's [Storybook](https://main--63f50c7c86f6514d2e0ef4be.chromatic.com/).
