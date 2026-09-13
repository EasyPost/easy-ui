# Network intelligence maps

Status: implemented in draft map PR #5, September 13, 2026. `NetworkMap` now uses optional MapLibre GL JS with OpenFreeMap/OSM example tiles. Three stories cover parcel, shipper and carrier investigations. The ECharts map prototypes have been removed; analytical charts and parcel event timelines remain in [chart PR #4](https://github.com/lanej/easy-ui/pull/4). This document distinguishes the initial implementation from later adoption requirements.

## Problem and boundary

Parcel tracking crosses very different geographic scales: a national transfer, several regional sort hubs, then nearby distribution and delivery events. Network intelligence also needs to explain facility risk, elevated volume, dwell and weather in the context of the shipments moving through those locations. A country outline with connected points cannot support these tasks adequately.

Build a dedicated optional mapping surface with shared facilities, segments, layers, camera state, selection and time controls. Reuse Easy UI tokens, controls, tables and event timelines. Keep chart and map rendering dependencies separate. The map displays caller-provided observations, aggregates and model outputs; it does not calculate exception probabilities, infer causal weather effects, plan routes or invent parcel positions.

## Audience and questions

| Audience             | Primary question                                                                                                  | Default scope and emphasis                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Shipper              | Where are my shipments flowing, which promises are at risk, and what needs attention?                             | Authorized shipments from selected warehouses, carrier/service filters, promise exposure and affected parcel lists |
| Carrier              | Where is flow accumulating, which facilities or lanes are under strain, and what is the downstream impact?        | Authorized network flow, facility throughput/capacity, dwell, backlog, lane transitions and affected shipments     |
| Parcel investigation | What has happened to this parcel, where was it last observed, and what evidence supports its expected next steps? | Ordered events, observed transfers, unknown gaps, predicted next locations/windows and promise deadline            |

Share the same map primitives, identifiers and selection model. Use different defaults, summaries and denominators for each audience. A carrier's total network volume and a shipper's visible shipment cohort are different measures. Data access and authorized aggregate scope are enforced by the serving application, not by client-side filters.

## Geographic scale and camera behavior

| View     | Primary marks                                                                            | Labels and actions                                                                              |
| -------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| National | Origin, destination, major hubs and long-distance legs                                   | Major hubs and selected journey; choose a transfer to fit that leg                              |
| Regional | Sort facilities, distribution centers, intermediate transfers                            | Expand nearby facilities and their events; expose flow, dwell and risk at the selected facility |
| Local    | Street basemap, observed scan locations, destination and any supported traveled geometry | Individual events, timestamps and local context; retain an overview of the full journey         |

Provide Entire journey, Selected leg and Latest events camera actions, plus manual pan/zoom. Animate between fitted bounds when reduced-motion preferences allow it. Reserve camera padding for the details panel and labels. A region or facility selection should reveal relevant detail while preserving the journey context.

Keep the selected location, last observed location, origin and destination identifiable at every scale. Use prioritized, collision-aware labels with enough space around markers. At very low zoom, coincident facilities may use a grouped label; details remain available through selection. Group repeated scans at one facility into one marker with an event count. Aggregating nearby unselected markers must not erase the selected parcel's event order or hide a critical alert.

Incoming data must not reset manual camera movement. Explicitly enabled follow mode may track the latest event; users can exit it. Keep the chosen viewport when updating risk or weather layers. A parcel or warehouse filter can offer Fit results rather than forcing every data refresh to recenter.

## Layers and visual hierarchy

| Layer                 | Encoding                                                                                     | Detail on selection                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Observed network flow | Direction and edge width for parcel volume in one stated window; selected journey emphasized | From/to facility, count, service/cohort, dwell or transit distribution, observation interval                  |
| Facilities            | Recognizable facility marker; restrained status halo or badge with a non-color cue           | Throughput versus baseline/capacity, backlog, dwell, exception risk and last update                           |
| Parcel journey        | Ordered observed transfers, explicit unknown intervals, distinct predicted/planned segments  | Scan events, timestamps, evidence source, last-observation age and arrival bounds                             |
| Weather or disruption | Optional area overlay with its own legend and valid-time range                               | Hazard, observed/forecast status, issuing source, time window and intersecting shipments                      |
| Delivery risk         | One selected risk metric with a stable scale and scope label                                 | Event definition, horizon, relevant cohort, baseline, probability or observed rate, uncertainty and freshness |

Use a quiet basemap and a small visible legend. Default to flow plus selected-entity status; risk and weather should be deliberate overlays. Do not stack several opaque heatmaps or reuse one color scale for volume, weather intensity and exception probability. When layers compete, prioritize the selected journey and surface secondary evidence in the details panel.

Selection links the map, parcel list and event timeline. Selecting a facility reveals the affected parcel cohort; selecting a parcel highlights its sequence and lets the user focus a leg. Selection should survive a change of geographic scale and update related panels without silently changing the cohort denominator.

## Risk and evidence semantics

An example label such as “18% exception risk” is insufficient on its own. Specify the event (for example, a newly reported exception), horizon (for example, the next 24 hours), applicable parcel cohort, model/as-of time and baseline. These example values are illustrative, not measured claims.

Facility risk, historical facility exception rate and a particular parcel's conditional risk are separate values. Do not copy a facility-wide score onto every parcel or add the probabilities at successive hubs. Parcel and downstream-network risk must come from an appropriate model or aggregation supplied by the application.

Elevated volume needs an expected baseline for the same facility, service, calendar/time bucket and unit. Show observation coverage and sample counts where they affect interpretation. Weather overlap is evidence of exposure; it does not by itself establish that weather caused delays. Show missing, stale, suppressed and unavailable risk separately from zero risk.

Keep observed, inferred, predicted and planned geometry distinct. A transfer observed through endpoint scans is a known facility-to-facility connection, not proof of the intervening road route. Draw traveled road geometry only when supported by telemetry or another explicit source. An inferred path or location must carry its evidence class and uncertainty.

## Data and time contract

Use stable facility, parcel, event and segment identifiers so maps, tables and charts refer to the same entities. The proposed contract needs:

- Facilities: coordinates, role, label, observation time and independently sourced metrics.
- Events: parcel/facility or coordinate, event type, event time, received time and source.
- Segments: endpoint identifiers, sequence, optional geometry, evidence class, observed/valid interval and aggregate cohort where applicable.
- Risk and signals: entity/cohort, metric/event definition, horizon, value and unit, baseline, coverage, uncertainty, as-of/valid times and source/model version.
- View state: selected entities, filters, time window, enabled layers and camera; controlled selection callbacks coordinate other Easy UI views.

An as-of view or playback must use information available at that time. Do not mix historical parcel events with today's facility score or a weather forecast issued later. Distinguish event time from ingestion time when late scans arrive. New risk calculations need an explicit freshness indication; loading or failure must not present stale values as current.

For multiple warehouses and large cohorts, the application queries and aggregates by viewport, zoom, time and authorized cohort. Stable IDs and request cancellation prevent late responses from replacing a newer selection. The map component should not own business-specific analytics endpoints, carrier credentials or model execution.

## Engine and packaging

Use MapLibre GL JS for basemap rendering, camera controls, zoom-dependent layers and label placement. Choose a basemap style and tile source separately, with suitable coverage, attribution and availability. Preserve attribution in examples and supported application integrations. Account for CSS, workers and tile/style loading in the integration contract.

Start with MapLibre sources and layers. Add deck.gl only if a measured density or rendering requirement justifies another engine dependency. Keep MapLibre behind an explicit optional package entry and lazy load it for map consumers; importing charts or native KPI components must not load map code, workers or tiles. Keep server rendering safe and provide a useful loading/error state and a non-map table/list alternative.

The old ECharts map extension's 23.4 kB gzip figure measures the reference prototype only. It is not a budget or estimate for MapLibre. Measure JavaScript, CSS, worker assets, initial style/tile requests, memory and interaction latency separately on agreed parcel/facility workloads and mobile hardware. Report engine and basemap costs separately.

## First reviewable implementation

Create three examples with consistent synthetic records: a parcel journey spanning national, regional and local scales; a shipper's multi-warehouse flow with promise-risk drilldown; and a carrier facility bottleneck with volume/dwell and optional weather exposure. Include both dense and sparse label situations, nearby hubs, repeated facility scans, stale or missing events, and an undelivered parcel whose current position is unknown.

The first implementation must support the camera actions, prioritized labels, selection-linked panels, observed-versus-predicted styling, one risk overlay and one weather overlay with clear time/scope labels. Risk and weather values can be supplied fixtures; no live intelligence service is required to review the interface.

## Acceptance before adoption

- [ ] MapLibre integration and tile/style choice produce a useful street-to-national basemap.
- [ ] All three audience examples make their primary question answerable at desktop and mobile sizes.
- [ ] Zooming and selecting a leg preserve labels, event order and geographic context, including nearby hubs and repeated scans.
- [ ] Risk, volume and weather have distinct meanings, denominators, time windows and missing/stale states.
- [ ] Known transfers, measured routes, inferred geometry and planned destinations remain distinguishable.
- [ ] Keyboard-accessible lists and controls coordinate selection; focus, reduced motion, attribution and loading/error behavior are checked.
- [ ] Import/SSR and consumer-build checks establish optional loading; representative interaction and transfer measurements are reported.
- [ ] Actual screenshots and interaction evidence accompany review in Chrome, Firefox and Safari. Pixel equality alone is not a design-quality gate.

The implementation includes the three fixture-based investigations, optional MapLibre entry, camera actions, directional observed transfers, progressive collision-managed labels, shared selection, exact data, risk and weather layers. See the PR description and `scripts/preview-maps` for the validation evidence.

Follow-on capabilities remain separate: live model/data services, time playback, carrier/service query controls, automatic follow mode, viewport queries and high-density clustering, grouping labels with counts, model uncertainty intervals, explicit affected-cohort tables beyond the small example sample, and measured memory/latency budgets on target mobile hardware. They are not implied by the initial examples. Production tile choice and Figma approval remain adoption decisions.
