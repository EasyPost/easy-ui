# Documentation site

The site publishes Storybook, the TypeDoc API reference, and independent full
and modular ECharts galleries, and the NetworkMap gallery from the same source revision.

Use Node 20 and npm 10, matching the documentation workflow:

```sh
npm ci
npm ci --prefix scripts/preview-metrics
npm ci --prefix scripts/preview-maps
npm run build:docs
node scripts/check-docs-site.mjs
```

`build:docs` builds tokens and icons first, runs the locked local TypeDoc
installation with the repository's TypeScript, and produces `docs-site/`.
Generated subdirectories are ignored by Git. The link check verifies entry
pages, nested API navigation, static assets and the sparkline marker reference
under a project subpath.

To preview, serve the parent of `docs-site/` and open `/docs-site/`; relative URLs
also work at `/easy-ui/network-maps/` on GitHub Pages.

In the repository's **Settings → Pages**, select **GitHub Actions** as the build
source. The Documentation site workflow deploys pushes to `main`,
`experiment/modular-echarts`, and `feat/network-intelligence-maps`. Every deployment
builds both review branches and combines their outputs into one Pages artifact:

- Chart documentation: <https://lanej.io/easy-ui/>
- Map documentation: <https://lanej.io/easy-ui/network-maps/>
- Map gallery: <https://lanej.io/easy-ui/network-maps/maps/>

This keeps either branch's deployment from overwriting the other preview.
Each preview includes `revision.txt` identifying its source commit. Pull requests
build only their proposed changes and upload an `easy-ui-documentation-site`
artifact without deploying. Keep this workflow synchronized between the review
branches; retire the branch previews together when the proposals are adopted.
The `github-pages` environment must allow these deployment branches.

TypeDoc's non-fatal warnings about existing unexported helper types and older
comments remain visible in the build log. They do not prevent site generation.

After deployment, Chrome repeats the map interaction and accessibility audit
against the published `/network-maps/maps/` URL, using the exact deployed map
revision. The `network-maps-hosted-chrome` artifact contains captures and reports.
