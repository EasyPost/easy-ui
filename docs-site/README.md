# Documentation site

The site publishes Storybook, the TypeDoc API reference, and independent full
and modular ECharts galleries from the same source revision.

Use Node 20 and npm 10, matching the documentation workflow:

```sh
npm ci
npm ci --prefix scripts/preview-metrics
npm run build:docs
node scripts/check-docs-site.mjs
```

`build:docs` builds tokens and icons first, runs the locked local TypeDoc
installation with the repository's TypeScript, and produces `docs-site/`.
Generated subdirectories are ignored by Git. The link check verifies entry
pages, nested API navigation, static assets and the sparkline marker reference
under a project subpath.

To preview, serve the parent of `docs-site/` and open `/docs-site/`; relative URLs
also work at `/easy-ui/` on GitHub Pages.

In the repository's **Settings → Pages**, select **GitHub Actions** as the build
source. The Documentation site workflow publishes pushes to `main` and the
`experiment/modular-echarts` review branch; pull requests upload a downloadable
`easy-ui-documentation-site` artifact without deploying. The review branch is
published so this proposal can be browsed before merging it. Remove that push
trigger when the proposal is adopted. The existing Pages setting must be enabled
before deployment can succeed.

TypeDoc's non-fatal warnings about existing unexported helper types and older
comments remain visible in the build log. They do not prevent site generation.
