# Chart review fixes

Validated source: `40517c79388a9858eda2c7622aa48b3236553017`.

- [Full package CI](https://github.com/lanej/easy-ui/actions/runs/34713261427): build, imports/SSR, lint, tests, and Storybook.
- [Browser checks and runnable gallery](https://github.com/lanej/easy-ui/actions/runs/34713261500/artifacts/10304595095): desktop/mobile galleries, interactions, rich-text waterfall tooltip, 18 SVG/canvas charts, and no analytical requests on the native-only page.
- `waterfall-tooltip.png`: visually reviewed capture of the corrected tooltip, including the signed delivery cost and running balance on separate lines. Synthetic data; 1440px viewport.
- `validation.json` and `bundle-sizes.json`: exact browser results and current production measurements.

Regression coverage includes real-engine zoom/legend preservation across data refreshes, changed application settings, removal of obsolete series/annotations/zoom controls, complete palette overrides, and global extrema with isolated observations. There are 55 focused tests across the visualization components.

Existing gallery captures retain their original provenance in the adjacent directories. Regeneration instructions: `scripts/preview-metrics/README.md`.
