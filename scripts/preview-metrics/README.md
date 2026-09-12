# MetricCard review examples

This isolated harness renders the actual `ShippingOverview` Storybook example and MetricCard state examples using the exact published token version declared by Easy UI. It adds no production dependency to Easy UI and does not replace the monorepo's CI or full Storybook build.

```sh
cd scripts/preview-metrics
npm ci
npm run build
npx playwright install chromium
npm run capture
```

`dist/` contains the runnable preview. `screenshots/` contains desktop and mobile captures plus checks for horizontal overflow, expected trend graphics, and browser errors. The Metric examples workflow publishes both directories as an artifact. Refresh the PR's embedded images after intentional UI changes.
