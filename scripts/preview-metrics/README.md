# Chart review examples

This isolated harness renders actual components and Storybook fixtures with synthetic shipping data and the published Easy UI token version declared by the library.

The original first gallery shows MetricCard KPIs, Sparkline report rows, BarList category comparisons, and BulletChart targets. The analytical gallery retains Sankey, time series, stacked area, grouped and stacked bars, scatter/bubble, heatmap, donut, and treemap. Open `?portfolio=lightweight` to load only the lightweight portfolio; `?renderer=canvas` exercises the analytical canvas renderer.

```sh
cd scripts/preview-metrics
npm ci
npm run build
npm run measure
npx playwright install chromium
npm run capture
```

`dist/` contains the runnable preview, manifest, lazy analytical chunks, and `bundle-sizes.json`. The measurement retains component exports and includes transitive Easy UI primitives; React, global styles, tokens, fonts, and application data are excluded. Sizes are decimal bytes with gzip per emitted asset, not a device performance benchmark.

`screenshots/` contains all four galleries at desktop, mobile, and PR widths, Sankey details, a table example, and `validation.json`. Browser checks cover all 18 analytical charts, pointer selection, keyboard zoom and row selection, overflow, runtime errors, and the lightweight page making zero requests for analytical dynamic entries identified by the build manifest. The Chart examples workflow publishes both directories as an artifact.

The preview does not replace monorepo CI or the full Storybook build. Refresh affected galleries in the PR after intentional UI changes. Original KPI-only captures remain in `documentation/examples/metrics`; analytical captures are in `documentation/examples/analytics`; the expanded lightweight gallery is in `documentation/examples/lightweight`; additive native and analytical captures are in `documentation/examples/additive`.

## Additive galleries

`NativeExtensions` adds CompactTimeSeries comparisons/steps, RangePlot benchmarks/percentiles, shared-scale small multiples, and marker variants. `AnalyticalExtensions` adds nine analytical task examples. Both original galleries stay visible. The lightweight-only URL includes all six native components and still makes zero analytical chunk requests.

The screenshot artifact adds `native-extensions-{desktop,mobile,review}.png` and `analytical-extensions-{desktop,mobile,review}.png`. Browser capture now checks 18 SVG charts and 18 canvas charts, the compact chart's keyboard data disclosure, and both original and additional galleries. Public PR examples should remain additive and use immutable image URLs with source provenance.

## Modular ECharts comparison

`npm run measure:modular` builds the complete gallery with full and modular ECharts in separate output folders. `npm run capture:modular` checks both and compares their rendered PNGs, including desktop/mobile SVG, Canvas, and Sankey emphasis. See [the experiment notes](./modular/README.md) for registrations, measurement boundaries, and the opt-in API needed before production adoption.
