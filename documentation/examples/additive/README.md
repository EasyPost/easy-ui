# Additive native and analytical examples

Captured from source `87989fcf76c84231587ae0481cd9e90fe5c76274` by [Chart examples run 34705561865](https://github.com/lanej/easy-ui/actions/runs/34705561865). Full package validation: [CI run 34705561891](https://github.com/lanej/easy-ui/actions/runs/34705561891).

- `native-extensions-review.png`: compact time series, range plots, shared-scale regions, and sparkline marker modes at a 960px viewport.
- `native-extensions-mobile.png`: the same native examples at a 390px viewport.
- `analytical-extensions-review.png`: nine additional analytical patterns at a 960px viewport.
- `analytical-extensions-mobile.png`: the same analytical examples at a 390px viewport.
- `validation.json`: desktop/mobile rendering and interaction results, 18 SVG and canvas charts, and zero analytical chunk requests on the native-only page.
- `bundle-sizes.json`: exact production measurements and exclusions for the native component portfolios.

All fixtures are synthetic. Descriptive percentile ranges, prediction intervals, targets, and scenario settings have explicit meanings in the examples. No private product screenshots or data are included.

These captures were visually reviewed for mobile layout, label collisions, and heatmap label contrast. They render actual components and Storybook fixtures using published tokens `1.0.0-alpha.17`; full package/Storybook builds run separately. Regenerate with `scripts/preview-metrics/README.md`.

Existing KPI, lightweight, and analytical screenshots retain their original provenance in the adjacent directories. The current workflow artifact contains all four galleries and a runnable production build.
