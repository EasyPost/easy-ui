# Logistics intelligence and parcel progress

Six additive analytical recipes bring the chart portfolio to 24. Native capacity bullets also demonstrate observed volume and forecast overload without an analytical engine. All parcel, facility, rate and forecast records are synthetic.

Mapping is now [draft PR #5](https://github.com/lanej/easy-ui/pull/5). The earlier lane and transit maps are preserved there as a reference prototype, pending replacement with a dedicated mapping experience. [Network mapping scope](https://github.com/lanej/easy-ui/blob/feat/network-intelligence-maps/documentation/specs/NetworkMaps.md).

| Recipe                       | Decision or task                                   | Evidence shown                                                                                                 |
| ---------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Delivery promise reliability | Compare carriers against a delivery promise        | Fully aged acceptance cohort, unresolved denominator, cumulative delivered counts, promise and service targets |
| Rate competitiveness         | Find expensive or competitive zone/weight cohorts  | Signed price difference centered on parity, matched rates, sample counts, suppressed low-coverage cell         |
| Price–volume response        | Compare price candidates and their contribution    | Supplied low/base/high volume scenarios, variable-cost assumption, proposed-price marker                       |
| Capacity planning            | Identify overload and its timing                   | Observed versus forecast daily volume, advisory/limit bands, exact over-capacity counts                        |
| Single-parcel timeline       | Explain dwell, movement and gaps                   | Scan-bounded intervals, unknown scan gap, observation cutoff, predicted arrival window and promise deadline    |
| Multi-warehouse progress     | Compare the state of multiple parcels on one clock | Acceptance-to-last-event spans, delivered state, stale scan gap, forecast windows and source warehouse         |

## Actual browser captures

These captures show the six logistics recipes and native portfolio. They are byte-identical to the validated chart-only build below; extracting maps leaves their fixtures and rendering unchanged.

![Logistics decisions and parcel event progress](./logistics-review.png)

![Native capacity snapshots and compact chart portfolio](./native-extensions-review.png)

## Data meaning

Unresolved parcels stay in reliability denominators. Suppressed rate cohorts stay missing. Pricing bands are supplied scenarios, not confidence intervals or measured causal lift. Forecast arrival windows are separate from observed events. Elapsed time is not percent complete. Missing scan intervals stay unknown.

The modular registry uses eight series types for all 24 recipes. Timeline recipes use ordinary bar series. A build assertion excludes geographic chart modules and the full ECharts entry from the modular build. The published full-engine loader and ChartOption API are unchanged; modular loading remains a preview experiment.

[Fixture semantics and Storybook examples](../../../easy-ui-react/src/Chart/Chart.logistics.mdx). The two previously documented zoom-refresh edge cases remain outside this addition. Figma matching still requires an approved design reference.

## Measured transfer

| Production output, gzip             |  Full ECharts | Modular portfolio |
| ----------------------------------- | ------------: | ----------------: |
| JavaScript for all 24 chart recipes | 509,765 bytes |     382,340 bytes |
| CSS                                 |  10,761 bytes |      10,761 bytes |

The modular gallery saves **127.4 kB gzip (25.0%)**. Maps, basemap data and map controls are absent from this gallery. Native capacity examples reuse BulletChart and add no analytical engine to the lightweight page.

Totals include React, Easy UI, tokens, fixtures, native components, lazy analytical dependencies and the preview console recorder. Gzip is calculated per unique emitted asset; CSS is separate; fonts and state-only entry assets are excluded. The JSON's isolated engine probes use a different boundary. These results measure transfer, not rendering speed. [Exact sizes and method](./bundle-sizes.json).

## Validation

Validated source: `2055d1775d7976526bab01a23c9e842e359c21a5`. GitHub validation merge: `d281b173e2aa8b48d5ea6166a4a206e17d776f64`. The subsequent documentation commit publishes these results.

- [Browser workflow](https://github.com/lanej/easy-ui/actions/runs/34733125185): **95 exact PNG comparisons pass**, including all 24 plots at desktop/mobile SVG and desktop Canvas, original galleries, Sankey emphasis and exact tables. Pointer/keyboard, overflow and lightweight isolation checks pass.
- **30 axe scans report zero violations**, with zero runtime warnings/errors across Chrome 153.0.8010.36, Firefox 155.0 and actual Apple Safari 26.6 on macOS. Each browser runs five scans against each engine: gallery, expanded tables, Canvas, state fixtures and retry recovery.
- [Package CI passed](https://github.com/lanej/easy-ui/actions/runs/34733125290): build, lint, Storybook, package import/server rendering and **654 tests passed, 2 skipped**. The chart-only source retains ten logistics regressions; the three map-specific cases move with the map prototype.

Raw reports retain axe's incomplete SVG-background findings; no rules are disabled. Passing scans do not certify all WCAG criteria, screen-reader behavior or arbitrary consumer options. The table capture aligns its viewport after keyboard focus to avoid fractional clipping differences; exact PNG equality remains the comparison gate.

[Comparison results](./validation.json) · [Audit summary and limits](./audit-summary.json) · [Runnable builds and all captures](https://github.com/lanej/easy-ui/actions/runs/34733125185/artifacts/10309653628) · [Chrome reports](https://github.com/lanej/easy-ui/actions/runs/34733125185/artifacts/10309394003) · [Firefox reports](https://github.com/lanej/easy-ui/actions/runs/34733125185/artifacts/10309618661) · [Safari reports](https://github.com/lanej/easy-ui/actions/runs/34733125185/artifacts/10310241707).

The earlier combined map/chart prototype and its measurement history remain available in [the original documentation commit](https://github.com/lanej/easy-ui/blob/043a9332b3af26653e46e842951105866740e162/documentation/examples/logistics/README.md). Those 26-recipe figures must not be mixed with this extracted 24-recipe gallery.

[Build/capture commands](../../../scripts/preview-metrics/modular/README.md) · [Browser audit commands](../../../scripts/preview-metrics/audit/README.md).
