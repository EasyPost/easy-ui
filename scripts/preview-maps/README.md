# Network intelligence examples

Independent production harness for the optional `NetworkMap` entry. It uses synthetic records and OpenFreeMap vector tiles; no customer data, private imagery or account credentials are required.

```sh
cd scripts/preview-maps
npm ci
npm run build
npm run measure
```

The gallery has parcel, shipper and carrier views. `lightweight.html` is a separate native SVG consumer. Its complete dependency closure must contain no map engine or stylesheet. `dist/bundle-report.json` reports raw and gzipped production assets, including the separately emitted module worker; fonts and basemap tiles are separate. Browser reports include requested tile URLs and available Resource Timing bytes (null means cross-origin size is unavailable, not zero).

Browser checks run in GitHub Actions, not in the local workspace. `.github/workflows/network-map-examples.yml` exercises actual Chrome, Firefox and Safari. Chrome uses software WebGL; Firefox uses Mesa and Xvfb; Safari uses Apple's installed browser and safaridriver. Artifacts include production files, ten map screenshots, accessibility reports, console records, interaction checks and source commit metadata. Safari screenshots show its actual viewport; its minimum window size may exceed a requested mobile width. Chrome and Firefox exercise 390px layouts.

Checks cover national/regional/local camera actions, keyboard event/parcel/facility selection, camera preservation across layer/cohort changes, missing risk, equivalent data tables, weather evidence, responsive overflow and optional loading. Automated scans do not replace visual review or assistive-technology testing. The screenshots are real browser renders, not image-generation mockups.

Refreshing dependencies also exposed a pre-existing token-build mismatch: the manifest requested Style Dictionary 5 while the old lockfile contained 4.3.3. Both 5.1.1 and 5.5.3 failed with 64 unresolved token references in a clean install. The token workspace is pinned to the previously locked 4.3.3 so the monorepo builds reproducibly; this does not migrate token formats.
