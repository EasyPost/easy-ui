# Chart review examples

This isolated harness renders actual components and Storybook fixtures with synthetic shipping data and the published Easy UI token version declared by the library.

The first gallery shows MetricCard KPIs, Sparkline report rows, BarList category comparisons, and BulletChart targets. The analytical gallery retains Sankey, time series, stacked area, grouped and stacked bars, scatter/bubble, heatmap, donut, and treemap. Open `?portfolio=lightweight` to load only the lightweight portfolio; `?renderer=canvas` exercises the analytical canvas renderer.

```sh
cd scripts/preview-metrics
npm ci
npm run build
npm run measure
npx playwright install chromium
npm run capture
```

`dist/` contains the runnable preview, manifest, lazy analytical chunks, and `bundle-sizes.json`. The measurement retains component exports and includes transitive Easy UI primitives; React, global styles, tokens, fonts, and application data are excluded. Sizes are decimal bytes with gzip per emitted asset, not a device performance benchmark.

`screenshots/` contains both desktop/mobile galleries, a PR-width capture for each portfolio, Sankey details, a table example, and `validation.json`. Browser checks cover all nine analytical charts, pointer selection, keyboard zoom and row selection, overflow, runtime errors, and the lightweight page making zero requests for analytical dynamic entries identified by the build manifest. The Chart examples workflow publishes both directories as an artifact.

The preview does not replace monorepo CI or the full Storybook build. Refresh both galleries in the PR after intentional UI changes. Original KPI-only captures remain in `documentation/examples/metrics`; analytical captures are in `documentation/examples/analytics`; the expanded lightweight gallery is in `documentation/examples/lightweight`.
