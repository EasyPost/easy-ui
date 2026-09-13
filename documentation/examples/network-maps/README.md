# Network intelligence maps

[Draft PR #5](https://github.com/lanej/easy-ui/pull/5) implements the optional MapLibre `NetworkMap` entry. [Chart PR #4](https://github.com/lanej/easy-ui/pull/4) retains 24 analytical recipes and six native components; maps have their own runtime, stories and review harness.

## Investigations

| Example            | What to try                                                                         | Evidence                                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Parcel journey     | Fit the national journey, select a regional leg, focus the latest distribution scan | Seven scans, five observed facilities, four observed transfers, a planned delivery leg, scan age and parcel promise risk |
| Shipper flow       | Filter by warehouse, inspect a sampled parcel, select a facility                    | Full-cohort daily flow and relative widths, separately scoped parcel sample, parcel promise risk                         |
| Carrier operations | Select a regional facility and toggle risk/weather                                  | Throughput against expected volume/capacity, dwell, backlog, facility-cohort exception risk, forecast interval/source    |

Real OpenFreeMap vector tiles provide national geography and local streets. Selected/last-observed labels receive priority; local facilities appear as the camera zooms in. Data and layer updates preserve manual camera movement. Repeated scans share facility identifiers and markers.

The examples use synthetic records as of September 13, 2026, 14:00 UTC. Risk is caller-supplied model output. Facility cohort risk is not an individual parcel's promise risk. Forecast weather indicates exposure, not the cause of a delay. The last scan is an observation; current parcel position between scans remains unknown. Endpoint links do not establish a traveled road route.

## Run and integrate

See the [independent harness](../../../scripts/preview-maps/README.md), [component documentation](../../../easy-ui-react/src/NetworkMap/NetworkMap.mdx), [public TSDoc types](../../../easy-ui-react/src/NetworkMap/types.ts) and [scope/specification](../../specs/NetworkMaps.md).

Install the optional `maplibre-gl` peer and import its CSS in the consuming map route. Use the application's normal Easy UI stylesheet and ThemeProvider. Applications supply their own MapLibre style, including provider attribution and service terms. The examples use a public keyless OpenFreeMap style; production availability and tile terms remain application choices.

The production harness measures lazy engine and complete consumer asset closures separately. It verifies that an independent native SVG entry loads no map code, CSS or basemap resources. Embedded worker code is counted in engine JavaScript; styles, tiles, sprites and glyphs are separate network requests. Cross-origin Resource Timing sizes can be unavailable, so missing sizes are recorded as null.

## Review limits

This is a UI component and fixture portfolio. Live event/model/weather feeds, time playback, server-side authorization and querying, high-density clustering, model uncertainty and target-hardware memory/latency budgets remain follow-on work. An approved Figma reference is still needed for design sign-off. Automated accessibility scans do not certify all screen-reader or WCAG behavior.

The previous ECharts map prototype is available in [its immutable documentation commit](https://github.com/lanej/easy-ui/blob/043a9332b3af26653e46e842951105866740e162/documentation/examples/logistics/README.md). Its 23.4 kB incremental figure does not describe this MapLibre implementation.
