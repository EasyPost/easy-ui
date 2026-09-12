# Data visualization proposal

Status: proposed. Source audit: September 12, 2026, at commit `6a3a4c95dde6408cb38b4b2ae30d3904040757e8` (`@easypost/easy-ui` version `1.0.0-alpha.133`). This is a contribution proposal, not an approved roadmap.

## Problem and evidence

Easy UI provides the structure for analytical applications but no reusable visualization layer. The audited React source tree and package dependencies contain no line, area, bar, scatter, sparkline, or heatmap implementation. `BarChart` and `PieChart` in the icons package are icons. Existing `Card`, `SectionCard`, `DataGrid`, `DateRangePicker`, and selection controls supply much of the surrounding interface.

The [public repository](https://github.com/EasyPost/easy-ui) describes Easy UI as MIT licensed. This finding concerns the public design system. It does not establish which chart engines individual EasyPost applications use, or whether internal components already exist elsewhere. Before adopting an engine, inventory those applications and reuse a proven implementation where practical.

Public product references establish concrete demand:

| Reference inspected                                                                                                                                                                                                   | Visible pattern                                                                                   | Implication for Easy UI                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [Analytics support screenshot](https://support.easypost.com/hc/article_attachments/30797776550797), linked from [EasyPost Analytics](https://support.easypost.com/hc/en-us/articles/4407880833037-EasyPost-Analytics) | Four KPI tiles; line charts; carrier split; service table; shared filters                         | Standardize metric cards, time series, categorical comparison, and consistent chart controls |
| [Delivery Performance screenshot](https://support.easypost.com/hc/article_attachments/34063416880013), linked from [Luma Insights](https://support.easypost.com/hc/en-us/articles/33478774806413-Luma-Insights)       | KPI strip, carrier comparison bars, transit distribution, time series with dashed benchmark lines | Support distributions as binned bars and benchmarks as reference series                      |
| [Spend Analytics screenshot](https://support.easypost.com/hc/article_attachments/34063432064781), linked from the same Luma article                                                                                   | Cost KPI strip; comparisons by carrier and service; weight/zone breakdowns; benchmark time series | Reuse the same chart families across financial and operational questions                     |
| [2024 Analytics announcement](https://www.easypost.com/blog/2024-10-01-reveal-cost-saving-strategies-with-in-depth-shipping-data-through-the-easypost-dashboard/)                                                     | Product marketing ties spend, volume, cost, and transit metrics to shipping decisions             | Preserve these familiar metric names and composition patterns                                |

The recurring visual language is restrained: white cards, blue/navy marks, light gridlines, compact headings, filter rows, and exact tables underneath. Use Easy UI's current tokens rather than copying screenshot hex values or embedded BI chrome. Screenshots are evidence of product needs, not evidence of reusable components. All new example values are synthetic.

## Minimum useful scope

Start with four component families and one shared chart presentation layer:

| Family                       | Minimum capability                                                                                                                  | Shipping question it answers                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `MetricCard` and `Sparkline` | Formatted value, explicit comparison baseline, independently chosen sentiment, accessible trend summary, loading and no-data states | What changed, by how much, and over what period?                                                           |
| `TimeSeriesChart`            | Multiple lines; optional area fill; true elapsed-time axis; reference line/series; selectable observations                          | How are cost, volume, and delivery performance changing relative to a baseline?                            |
| `BarChart`                   | Horizontal/vertical; grouped/stacked; optional normalized stacks; caller-supplied histogram bins                                    | Which carrier/service differs, what is the mix, and where does transit time concentrate?                   |
| `ScatterChart`               | Numeric x/y axes; named series; optional bubble area; reference thresholds; point selection                                         | Which services or cohorts offer the best cost/performance tradeoff, and how much volume do they represent? |

Scatter is a proposed extension for comparing tradeoffs; it was not observed in the inspected screenshots. Bubble **area**, not radius, must encode volume. Distributions need explicit bin boundaries and labels; do not quietly turn arbitrary categories into a histogram.

Add a matrix `Heatmap` next for comparisons across two categorical dimensions, such as zone × weight or carrier × service. This is especially useful for a logistics data product, but can be a separate, bounded contribution. Include cell values, sample counts, missing-data treatment, and a legend. A geographic map is a separate problem.

Defer Sankey/network flow diagrams, geographic maps, gauges, treemaps, candlesticks, and a dashboard builder until a specific decision requires them. Carrier share can use sorted bars or a normalized stacked bar, so a donut does not need to block the first release. If exact parity with an existing carrier-split view is required, add a donut recipe separately.

## Shared presentation contract

Compose a chart frame from `SectionCard`, with slots for title, description, existing filters, actions, chart, and data access. Avoid another page layout or chart-specific date picker. The shared layer should own:

- A stable categorical series palette, separate from positive/negative status colors; series IDs retain colors when filters or sort order change. Benchmarks use a distinct dashed stroke and an explicit label.
- Consistent axis typography, units, number/date formatting, legend and tooltip styles, gridlines, and reserved responsive height. Use the active Easy UI theme; evaluate contrast in each supported scheme.
- An accessible chart name and summary, keyboard-operable tooltips/selection, touch interaction, visible focus, and an equivalent exact-value table. Do not rely on hover or color alone. A chart engine's accessibility switch is a starting point, not proof of compliance.
- Loading, successful-empty, error/retry, and partial/stale data states. A failed query must not look like zero shipments. Missing samples are gaps. Suppressed or unavailable cells need a different treatment from low values.
- Explicit time zone and bucket semantics. Full time series use timestamps; sparse observations retain elapsed spacing. KPI sparklines accept equal buckets with explicit null gaps. No implicit interpolation or smoothing.
- Clear scale policy: zero baselines for magnitude bars/areas; explicit bounds for percentage axes; labelled line-chart domains; baseline/target values included in the visible domain. Avoid dual axes by default.
- Selection callbacks carrying stable series and datum IDs so applications can drill into an existing report. Applications own queries, filters, pagination, aggregation, metric definitions, comparison math, and business interpretation.

No client-side shipment ingestion, forecasting, or aggregation framework is part of this design-system change. Report denominators/coverage where they affect interpretation, and distinguish observed, benchmark, and modeled values.

## Implementation choice

Use a maintained chart engine for scales, axes, interaction, and rendering, behind thin, typed Easy UI components. Keep the public props narrow; do not create a universal chart configuration language or expose an unbounded engine options object.

Recharts is the first candidate to evaluate for the initial Cartesian charts. Its [current manifest](https://github.com/recharts/recharts/blob/main/package.json) declares React 16–19 peer compatibility and ESM support. This is a compatibility lead, not a completed integration test or a version pin. Select and test a stable release against Easy UI's supported consumers, including transitive React dependencies.

If canvas scale or specialist charts become immediate requirements, evaluate modular [Apache ECharts imports](https://echarts.apache.org/handbook/en/basics/import/). Its explicit chart/component/renderer registration permits bounded imports, but still needs a React lifecycle adapter and accessibility evaluation. Do not ship two engines in the initial release.

Before selecting the engine, measure a production consumer build: compare no-chart imports against one time-series import; inspect ESM/CJS output and shared chunks; exercise resize, SSR/hydration, and intended point counts. Set a bundle and performance budget using those measurements. Easy UI's current Vite build bundles non-React dependencies, so simply adding an import does not guarantee the engine stays out of unrelated consumers. Prefer an opt-in charts package if that isolation cannot be demonstrated.

The included `MetricCard`/`Sparkline` first slice requires no new dependencies. The small SVG sparkline has no axes or interactive inspection and is intentionally separate from the future full chart engine.

## Contribution sequence and acceptance

1. Open the accompanying proposal issue, as requested by EasyPost's contribution guidelines; confirm existing internal implementations and the minimum chart contract.
2. Review the included `MetricCard`/`Sparkline` contribution: component source, Storybook docs, synthetic shipping example, edge-case tests, and minor changeset. It preserves observed zeros, null gaps, constant and isolated observations, explicit comparison baselines, and loading suppression of stale values. Consumers supply an accessible summary and exact data elsewhere. Error/retry is composed with the existing `Banner`.
3. Add the chosen engine adapter, shared chart frame/palette, time series, and bars. Exercise keyboard/touch access, data-table equivalence, benchmarks, gap handling, resize, and import isolation before release.
4. Add scatter/bubble and then matrix heatmaps against concrete product examples. Include reference lines, stable selection IDs, numeric scales, and low-sample/missing-data examples.

For each code contribution, require the repository's build, lint, tests, and Storybook gates; inspect desktop and narrow layouts; include screenshots in the PR. No full chart family is claimed implemented by the first slice.
