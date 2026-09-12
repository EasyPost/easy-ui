# Analytical chart review examples

This isolated harness renders the actual analytical Storybook gallery and KPI examples with synthetic shipping data. It uses the exact published Easy UI token version declared by the library. The chart gallery includes Sankey, time series, stacked area, grouped and stacked bars, scatter/bubble, heatmap, donut, and treemap.

```sh
cd scripts/preview-metrics
npm ci
npm run build
npx playwright install chromium
npm run capture
```

`dist/` contains the runnable preview, including the lazy-loaded ECharts chunk. `screenshots/` contains desktop/mobile galleries, Sankey details, a table example, and `validation.json`. Browser checks cover all nine charts, pointer selection, keyboard zoom and row selection, overflow, and runtime errors. The Chart examples workflow publishes both directories as an artifact.

The preview does not replace the monorepo CI or full Storybook build. Refresh the PR's embedded images after intentional UI changes. Older KPI-only captures live in `documentation/examples/metrics`; the expanded gallery belongs in `documentation/examples/analytics`.
