---
"@easypost/easy-ui": minor
---

feat!: publish ES modules only, with dependencies resolved from the app's `node_modules`

- The CommonJS build (`require`) is gone. Easy UI is now an ES module package (`"type": "module"`) with an `exports` map.
- React Aria, `@internationalized/date`, lodash, `react-syntax-highlighter` and Easy UI's other dependencies are no longer bundled into Easy UI. The app and Easy UI share one copy of each, so a `CalendarDate` from a date component is `instanceof` the app's `CalendarDate`, and the app's bundler picks each package's build for its environment (fixing server renders of `CodeSnippet` without a workaround).
- `@internationalized/date` is now a peer dependency (`^3.12.3`).

Jest consumers must let Jest transform Easy UI and its ES-only dependencies. See the README's "Testing with Jest" section.
