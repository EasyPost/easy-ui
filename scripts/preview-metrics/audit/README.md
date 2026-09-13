# Browser and accessibility audit

The Chart examples workflow runs the same assertions against two independent
production builds (full ECharts and the modular portfolio) in Google Chrome,
Firefox, and Apple Safari. Safari uses Selenium and the macOS `safaridriver`,
not Playwright WebKit. Browser names and versions are recorded in each report.

The audit covers the complete gallery, every expanded exact-value table, the
Canvas gallery, loading/empty/error/partial states, and recovery through the
retry button. It exercises zoom, row selection, table disclosure, and retry
using keyboard input. The existing capture job separately checks mobile
layout, pointer interactions, lightweight engine isolation, and 74 full versus
modular image comparisons.

`axe-core` runs all applicable WCAG 2.0/2.1/2.2 A/AA and best-practice rules.
No rules or violations are suppressed. Every scan records both `violations`
and `incomplete` results in `audit.json`; a reported violation fails the job.
The preview records every runtime `console.warn`, `console.error`, uncaught
exception, and unhandled rejection. Any recorded diagnostic also fails the
job. These checks concern the rendered application; build-tool advisories are
outside the runtime-console assertion.

## SVG text review

Axe reports many SVG labels as `incomplete` because it cannot determine their
background. Those results remain in the downloadable audit reports. The
heatmap examples have a separate unit regression that checks every labeled
cell with ECharts' actual scale-color interpolation and the WCAG relative
luminance formula. General axes use the Easy UI neutral text tokens; treemap
labels use white on the blue, purple, and teal series colors. Visual review
also remains necessary for overlapping labels, non-text marks, and application
options outside these fixtures.

Passing this audit means no violations were reported within these scans. It
does not certify all WCAG criteria, arbitrary consumer configurations, screen
reader behavior, or agreement with an approved Figma design. Native graphical
legends and chart marks remain outside the keyboard tab order; the documented
HTML tables and controls provide exact values and supported interactions.

## Reproduce

From `scripts/preview-metrics`, install dependencies and build:

```sh
npm ci
npm run build
npx playwright install --with-deps chrome firefox
EASY_UI_AUDIT_BROWSER=chrome npm run audit:browsers
EASY_UI_AUDIT_BROWSER=firefox npm run audit:browsers
```

On macOS, enable Safari's remote automation before running the native audit:

```sh
sudo safaridriver --enable
npm run audit:safari
```

For the modular build, set `EASY_UI_CHART_ENGINE=portfolio` for both the build
and audit commands. The workflow uses separate output directories, configured
with `EASY_UI_PREVIEW_OUT_DIR`, so the engines cannot contaminate one another.
Reports and actual browser screenshots are written to
`screenshots/audit/<browser>-<engine>/`. The workflow uploads these directories
even when an assertion fails.
