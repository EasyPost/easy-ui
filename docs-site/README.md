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

The Documentation site workflow builds the chart review branch and the map review
branch together, publishing charts at <https://lanej.io/easy-ui/> and maps at
<https://lanej.io/easy-ui/network-maps/>. Both previews include `revision.txt`
identifying their source commit. Combining both outputs in one Pages artifact
keeps either branch from overwriting the other preview.

In **Settings → Pages**, select **GitHub Actions**. The `github-pages` environment
must allow `main`, `experiment/modular-echarts`, and `feat/network-intelligence-maps`.
Pull requests upload an `easy-ui-documentation-site` artifact without deploying.
Keep the workflow synchronized between the review branches and retire the branch
previews together when the proposals are adopted.

TypeDoc's non-fatal warnings about existing unexported helper types and older
comments remain visible in the build log. They do not prevent site generation.
