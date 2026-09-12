# Data visualization proposal

Status: expanded implementation for review. Source audit: September 12, 2026, at commit `6a3a4c95dde6408cb38b4b2ae30d3904040757e8` (`@easypost/easy-ui` version `1.0.0-alpha.133`). This is a contribution proposal, not an approved roadmap.

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

## Analytical scope in this PR

The contribution includes a reusable `Chart` backed by Apache ECharts 6.1.0, plus complementary `MetricCard` and `Sparkline` components. KPI summaries alone do not address the analytical requirement.

| Implemented example                                             | Shipping question                                                             |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Sankey with responsive orientation and adjacency highlighting   | How do parcels flow from origins through carriers to delivery outcomes?       |
| Time series with elapsed-time axis, gaps, target line, and zoom | How does on-time performance change over time?                                |
| Stacked area                                                    | How does daily volume grow and split across carriers?                         |
| Grouped bars                                                    | How do rated costs compare with a benchmark by service?                       |
| Normalized stacked bars                                         | How do transit distributions differ across carriers?                          |
| Scatter/bubble                                                  | Which services balance cost and speed, and how much volume do they represent? |
| Matrix heatmap with exact sample counts in the table            | Where does performance vary across zone and weight?                           |
| Donut                                                           | What is the composition of exception reasons?                                 |
| Treemap                                                         | How does volume split across origins and their services?                      |

All fixtures are synthetic. Plots and their exact-value tables share source records. Sankey inflows and outflows balance at each carrier. Bubble area encodes count. The line example preserves gaps and true timestamp spacing. The heatmap leaves unavailable cells blank and includes their null values in the table.

## Integration choice and tradeoffs

Use one maintained analytical engine rather than implementing axes, layouts, tooltips, and Sankey geometry within Easy UI. Apache ECharts supports the standard and specialist families in the requested scope. The adapter deliberately exposes its typed `EChartsOption` API; applications can compose series and use the engine's other built-in charts without waiting for another Easy UI wrapper. Easy UI owns the surrounding presentation, lifecycle, and data access. Applications own data queries, aggregation, definitions, scales, coverage, formatting, and persisted filter state.

ECharts is an optional peer (`^6.1.0`) and a pinned development dependency. The package marks it external and dynamically imports it when a ready chart mounts. This preserves ordinary Easy UI imports and CommonJS/ESM compatibility without requiring the engine for KPI cards. The full analytical engine measured about 1.14 MB minified / 382 KB gzip in the isolated Vite production preview. This is a conscious bundle-cost tradeoff for broad chart support; analytical routes should remain lazy-loaded.

ECharts' [modular imports](https://echarts.apache.org/handbook/en/basics/import/) remain a future optimization if narrower installations justify managing per-family registrations. This PR uses the complete lazy engine so native option types accurately represent available capabilities. It does not ship a second chart engine. [SVG/canvas guidance](https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/) informs the SVG default and optional canvas renderer.

## Shared presentation and interaction

- A title, visible description, optional actions and coverage notice, reserved height, and responsive width.
- Easy UI typography and resolved theme colors; explicit stable series colors in examples. Automatic engine palettes are positional, so applications should assign colors by stable series ID when filtering or sorting.
- Loading, successful-empty, error/retry, and partial-data presentation. Non-ready states suppress stale charts and tables. Engine failures call `onRenderError` and render an error label.
- Hover/touch tooltips, graphical legend controls, Sankey flow highlighting, and pointer selection from ECharts. Series/datum information reaches `onSelect`.
- An exact-value HTML table, stable row IDs, and keyboard-accessible drill-down through `onRowSelect`. The plot has an accessible description. Time-series zoom also has keyboard-operable buttons.
- Reduced-motion handling, parent resize observation, renderer disposal, and cancellation when the component unmounts during an engine import.

Native graphical legends and individual marks are not keyboard-focusable. Reports needing keyboard filtering should provide controls through `actions`; the table provides exact values and drill-down. This is an explicit accessibility boundary, not a claim that an engine ARIA switch alone establishes compliance. See [ECharts accessibility guidance](https://echarts.apache.org/handbook/en/best-practices/aria/).

## Validation and contribution

Require the repository build, lint, tests, and Storybook gates. Additional checks exercise CommonJS/ESM imports and server rendering, engine lifecycle and failures, state suppression, keyboard controls, reduced motion, theme changes, real SVG rendering for each example, and flow conservation. Browser captures verify desktop and mobile layouts, actual pointer selection, keyboard selection and zoom, and absence of horizontal overflow or browser errors.

The Chart examples workflow publishes the runnable gallery and screenshots. Refresh the PR's embedded examples after component or fixture changes. `scripts/preview-metrics/README.md` documents regeneration; `easy-ui-react/src/Chart/Chart.mdx` documents the consumer API.
