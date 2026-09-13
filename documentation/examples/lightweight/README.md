# Lightweight chart examples

Captured from source `e778635ffa77ae59c81c02a41f6a325c0a8cc82f` by [Chart examples run 34702811966](https://github.com/lanej/easy-ui/actions/runs/34702811966). [Runnable gallery artifact](https://github.com/lanej/easy-ui/actions/runs/34702811966/artifacts/10301041000).

- `lightweight-review.png`: 960px viewport, gallery cropped for PR reading.
- `lightweight-mobile.png`: 390px viewport.
- `validation.json`: both portfolios at desktop/mobile widths, analytical SVG/canvas and interaction checks, plus zero analytical requests on the lightweight-only page.
- `bundle-sizes.json`: reproducible Vite measurements excluding React and global styles; see the method in the file.

These are actual MetricCard, Sparkline, BarList, and BulletChart components with synthetic fixtures. The preview uses published tokens `1.0.0-alpha.17`. Full package/Storybook CI runs separately. Regeneration instructions are in `scripts/preview-metrics/README.md`.

Original KPI screenshots remain in `documentation/examples/metrics`; all nine analytical examples remain in `documentation/examples/analytics` and the current workflow artifact.
