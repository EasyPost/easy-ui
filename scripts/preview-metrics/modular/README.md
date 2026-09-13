# Modular ECharts experiment

This branch starts from #1, after closing the Recharts comparison in #3. It measures ECharts 6.1.0 with an explicit module registry while retaining the original 18 analytical examples and adding eight logistics/tracking recipes, all six lightweight components, SVG, and Canvas.

The published `Chart` API and full-engine loader are unchanged. A Vite plugin replaces only the private preview's loader when building the modular gallery. No Recharts code or dependency is included.

## Registrations

`portfolio.mjs` registers eight series: line, bar, scatter, pie, Sankey, treemap, heatmap, and boxplot. Areas, scenarios, histograms, cumulative distributions, prediction bands, and waterfalls compose those series using the existing fixtures.

It also registers Cartesian grids, plain/scroll legends, tooltips, inside/slider zoom, mark lines/areas/points, continuous visual maps, label layout, legacy `containLabel` support, and both renderers. Titles and exact tables remain in the Easy UI wrapper. The preset retains ECharts' native Sankey adjacency emphasis and Canvas support.

Other series and components are intentionally absent: for example, radar, gauge, graph, calendar, timeline, toolbox, dataset transforms, piecewise visual maps, ARIA decals, and universal transitions. Register them when the application needs them. Our exact-table accessibility path remains unchanged; this experiment adds no graphical accessibility claims.

The two map recipes dynamically register `GeoComponent` and `LinesChart` only after **Show logistics maps**. The 24 non-geographic recipes use the eight-series base preset; a module-inventory assertion keeps geographic engine modules outside its dependency closure. Maps use a local public-domain Natural Earth outline and synthetic scan/facility data, without tile requests.

`trend.mjs` is a separate engine-only size probe for an SVG time-series screen with labels, annotations, and zoom. It is not used for the gallery or claimed to support the full portfolio.

## Reproduce

From `scripts/preview-metrics`:

```sh
npm ci
npm run measure:modular
npx playwright install chromium
npm run capture:modular
```

The measurement writes independent applications to `dist/modular/full/` and `dist/modular/portfolio/`, plus `dist/modular/bundle-sizes.json`. Serve either folder as the site root. For example:

```sh
EASY_UI_CHART_ENGINE=portfolio EASY_UI_PREVIEW_OUT_DIR=dist/modular/portfolio npx vite preview
```

Both keep the original gallery, `?renderer=canvas`, and `?portfolio=lightweight`. Separate builds and browsers prevent ECharts' process-global module registry from masking missing registrations. The build assertion also checks that unused chart implementations and the full ECharts entry are absent.

The capture script runs the existing desktop/mobile gallery checks against each build. It adds individual captures of all 26 charts at desktop/mobile SVG and desktop Canvas, plus Sankey emphasis and warehouse filtering. It verifies that the map recipe is not requested before opening the maps. It compares the resulting PNG files byte for byte and writes `screenshots/modular/validation.json`. The Actions artifact includes both runnable builds and their captures.

Bundle totals include the original gallery's React, Easy UI, tokens, fixtures, all native components, and analytical engine. Gzip is calculated per unique emitted asset, including lazy dependencies. CSS is separate and fonts are excluded. The report also separates the dependency closure without geography from incremental map assets. The engine-only probes export `init` with their registrations retained and exclude the rest of the application. These are transfer measurements, not runtime benchmarks; totals differ from the earlier Recharts comparison page because the page contents differ.

## Adoption boundary

The current public `ChartOption` accepts the full ECharts option surface. Silently replacing its loader with this registry would make some valid configurations stop working. For production, prefer an explicit opt-in modular entry or an application-supplied loader with a narrowed `ComposeOption` type; keep the full entry available. Confirm in a consumer production build that selecting the modular entry does not also pull in the default engine. Avoid importing both runtimes on the same page, since their module registration is shared.

The two known zoom-refresh edge cases in #1 remain wrapper bugs with either import strategy. This experiment isolates modularization and does not claim to fix them. No screenshots, examples, public exports, or native components are removed.
