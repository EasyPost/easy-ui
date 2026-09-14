# Chart review contract

The initial run at `2cb1f2d` used Viewrule 0.3.1's unmodified baseline:
1,860 text-size errors across desktop (1440), mobile (320), and 4K (3840),
with no overflow or clipping findings. These are repeated text observations
across viewports, not 1,860 distinct layout defects. Evidence:
https://github.com/lanej/easy-ui/actions/runs/34761017304

## Explicit application calibration

The generic 14 px minimum is replaced by a 12 px floor for chart annotations,
legends, captions and exact tables, plus a separate 14 px floor for page prose
and headings. This matches the dense analytical roles in these examples;
it is not a human approval or a universal accessibility claim. Existing 9–11 px
ECharts annotations and preview table headers are increased to 12 px. Mobile
uses the same minimum. Before/after error counts therefore use different,
documented contracts and must not be presented as repairs alone.

Known native example headings and captions get maximum heights to detect
accidental flex stretching. This is a scoped spacing regression, not a global
empty-space score. Short range labels get bounded columns and reflow above
full-width tracks in narrow cards. Large screens show more charts within a
finite 2240 px content region, preserving comparison identities and type sizes.

The pinned Viewrule candidate adds `within-bounds` (lanej/viewrule#10) because
`no-clip` cannot detect SVG text beyond the SVG viewport. All ECharts SVG text
must fit its SVG; native HTML value/date labels must fit their declared axes
and remain non-overlapping. Canvas, masks, intermediate clipping ancestors,
occlusion, and semantic chart correctness still require separate review.

## Evidence and stress case

`layout.html` exposes 280/320/480/720 px cards with long service names, full CHF
amounts, complete dates, zero and missing observations, and expanded exact tables.
The existing Chrome/Firefox/Safari workflow checks a 280 px card and keyboard
horizontal scrolling in the intentional exact-table region. Viewrule measures
this route at desktop and 320 px, plus the complete gallery at desktop/mobile/4K.
The complete reports and native-scale detail captures are CI artifacts.
