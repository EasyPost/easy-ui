# Modular ECharts assessment

Retain ECharts and offer modular loading as an explicit optimization. This experiment removes unused modules while keeping the existing 18 analytical recipes, SVG and Canvas, Sankey adjacency emphasis, labels, targets, thresholds, and exact-value tables. All six native components remain unchanged.

The original Recharts comparison is [closed in #3](https://github.com/lanej/easy-ui/pull/3): its smaller bundle did not justify the specialized chart maintenance and feature gaps. This experiment is [PR #4](https://github.com/lanej/easy-ui/pull/4), based directly on [#1](https://github.com/lanej/easy-ui/pull/1).

## Measured transfer

| Production output | Full ECharts | Modular portfolio | Saving |
| --- | ---: | ---: | ---: |
| Complete gallery, gzip JavaScript | 502.6 kB | 375.2 kB | 127.4 kB (25.3%) |
| Gallery's lazy engine chunk, gzip | 382.2 kB | 254.7 kB | 127.4 kB (33.3%) |
| Gallery CSS, gzip | 10.4 kB | 10.4 kB | — |

A separate SVG time-series engine probe measures 203.1 kB gzip. It includes line charts, legends, tooltips, zoom, annotations, and label layout, but cannot render the complete portfolio. This is a size probe, not a tested replacement for the gallery.

[Exact asset sizes and measurement method](./bundle-sizes.json). Totals include React, Easy UI, tokens, fixtures, all native components, and all lazy analytical dependencies. Gzip is calculated per unique emitted asset. CSS is separate; fonts are excluded. The JSON also includes isolated `init`-only engine exports: the full export is 379.0 kB there because it retains fewer public exports than the gallery's dynamic namespace import. Do not mix those two measurements.

The original gallery contains different UI from the earlier Recharts comparison page; compare full and modular values from this build. These measurements establish a transfer saving, not faster rendering or dense-data performance. The six native components still measure 16.9 kB gzip with React, global styles, tokens, fonts, and application fixtures excluded.

## Rendered examples

These are actual modular-build captures of the original synthetic fixtures. The full build is checked against the same images.

![Modular analytical gallery: flows, trends, comparisons and matrices](./analytics-review.png)

![Modular analytical extensions: annotations, distributions, prediction bands and waterfall](./analytical-extensions-review.png)

<details>
<summary>Sankey emphasis and mobile flow</summary>

![Native Sankey adjacency emphasis](./sankey-emphasis-desktop.png)

![Mobile Sankey](./sankey-mobile.png)

</details>

## What is included

| Layer | Registered capabilities |
| --- | --- |
| Series | Line, bar, scatter, pie, Sankey, treemap, heatmap, boxplot |
| Compositions | Area, grouped/stacked bars, scenarios, histogram, cumulative distribution, supplied prediction band, contribution waterfall |
| Components | Cartesian grid, legends, tooltips, inside/slider zoom, mark lines/areas/points, continuous visual map |
| Rendering | SVG and Canvas, label layout, legacy grid `containLabel` support |
| Easy UI | Existing frame, statuses, exact tables, row selection and keyboard zoom; all six native components |

Registration follows the full engine’s order. The comparison exposed a three-pixel difference at an overlapping scenario marker when marker modules were registered in a different order.

A modular registry only supports what it registers. Geo/maps, radar, gauges, graphs, calendar, timeline, toolbox, dataset transforms, piecewise visual maps, ARIA decals, and universal transitions require additional modules. Those omissions do not affect these fixtures, but matter for applications using the unrestricted `ChartOption` API.

## Recommended API direction

Prefer one broad analytical preset initially: narrowing it to the time-series probe saves only about another 52 kB and loses much of the portfolio.

Keep the full entry available and add an explicit modular entry or an application-supplied loader, with a narrower `ComposeOption` type. Verify a consumer production build excludes the default full engine when that entry is selected. Registry modules are global to an ECharts runtime; importing the full engine anywhere in the same page removes the expected size benefit and can conceal missing registrations.

This draft substitutes the loader only inside the preview build. It does not change the published package, silently narrow the existing API, or remove any examples. The two known zoom-refresh edge cases in #1 remain wrapper bugs under both loading strategies and need a separate fix before adoption.

## Validation and reproduction

**All 74 PNG comparisons passed**, and both builds passed the original interaction checks with no browser errors. [Browser workflow](https://github.com/lanej/easy-ui/actions/runs/34725140558) · [Full package CI](https://github.com/lanej/easy-ui/actions/runs/34725140547) · [Runnable builds and all captures](https://github.com/lanej/easy-ui/actions/runs/34725140558/artifacts/10307158426).

Validated source head: `ace641224085d005d14ea885169fc68738b3180e`. GitHub’s validation merge commit is `fba0907885212f0a7d441df6b9d4fc986a308304`. This documentation commit only publishes the results and captures.

Validation results and source provenance are recorded in [validation.json](./validation.json). The comparison uses independent builds and fresh browser processes, exercises the existing desktop/mobile pointer, keyboard, overflow and lightweight-isolation checks, and compares exact PNG bytes for the original galleries, all 18 plots in desktop/mobile SVG and desktop Canvas, signed waterfall tooltips, exact-table selection, and Sankey emphasis.

Run `npm ci`, `npm run measure:modular`, and `npm run capture:modular` from `scripts/preview-metrics` after installing Playwright Chromium. Outputs are `dist/modular/full/`, `dist/modular/portfolio/`, `dist/modular/bundle-sizes.json`, and `screenshots/modular/`. Both sites retain the original gallery, `?renderer=canvas`, and `?portfolio=lightweight`.

[Registry and detailed reproduction notes](../../../scripts/preview-metrics/modular/README.md).
