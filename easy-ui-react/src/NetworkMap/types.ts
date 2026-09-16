import type { Map as MapInstance, StyleSpecification } from "maplibre-gl";

/** Geographic position in longitude, latitude order (WGS84 degrees). */
export type MapCoordinate = readonly [number, number];

/** Caller-supplied model output. A facility cohort score is not a parcel score. */
export type MapRisk = {
  /** Probability between zero and one; null is unknown, never zero risk. */
  probability: number | null;
  /** Comparable baseline probability, or null when unavailable. */
  baseline: number | null;
  /** Event whose probability is being estimated. */
  event: string;
  /** Forecast horizon in hours after asOf. */
  horizonHours: number;
  /** Cohort to which the estimate applies. */
  cohort: string;
  /** ISO timestamp when this model output was produced. */
  asOf: string;
  /** Freshness/coverage supplied by the application. */
  status: "current" | "stale" | "unavailable";
};

/** Facility or destination shared by the map, event list and application data. */
export type MapFacility = {
  /** Stable application identifier. */
  id: string;
  /** Human-readable location name. */
  label: string;
  /** Geographic position; this does not imply a live parcel position. */
  coordinates: MapCoordinate;
  /** Marker shape and accessible role description. */
  kind: "warehouse" | "hub" | "delivery" | "destination";
  /** Smallest zoom at which an unselected label should appear; defaults to 0. */
  labelMinZoom?: number;
  /** Higher values receive label placement priority; defaults to 0. */
  priority?: number;
  /** Additional accessible location context, such as last-observation age. */
  detail?: string;
  /** Optional conditional risk for a stated facility cohort. */
  risk?: MapRisk;
};

/** A facility connection; only measured geometry establishes a traveled route. */
export type MapSegment = {
  /** Stable segment identifier. */
  id: string;
  /** Origin facility identifier. */
  from: string;
  /** Destination facility identifier. */
  to: string;
  /** Accessible transfer description, including time/coverage where relevant. */
  label: string;
  /** Evidence behind the connection. Transfer means endpoints only. */
  evidence: "transfer" | "measured" | "inferred" | "planned";
  /** Optional supported or explicitly inferred path geometry. Required for measured paths. */
  coordinates?: readonly MapCoordinate[];
  /** Nonnegative flow count used for relative width; applications own its window and denominator. */
  volume?: number;
  /** Optional caller-supplied line color (any valid MapLibre paint-property color, e.g. a hex string). Falls back to the evidence-based scheme when absent. */
  color?: string;
};

/** Weather/disruption polygon with source and time semantics. */
export type MapArea = {
  /** Stable area identifier. */
  id: string;
  /** Visible hazard description. */
  label: string;
  /** Polygon outer ring. The component closes an open ring. */
  coordinates: readonly MapCoordinate[];
  /** Whether the hazard is observed or forecast. */
  evidence: "observed" | "forecast";
  /** ISO start of the applicable interval. */
  validFrom: string;
  /** ISO end of the applicable interval. */
  validUntil: string;
  /** Observation provider or forecast issuer. */
  source: string;
};

/** One grid cell of a delivery-time field surface, roughly 150m on a side. */
export type MapSurfaceCell = {
  /** Southern latitude bound of the cell. */
  latMin: number;
  /** Northern latitude bound of the cell. */
  latMax: number;
  /** Western longitude bound of the cell. */
  lonMin: number;
  /** Eastern longitude bound of the cell. */
  lonMax: number;
  /** Median delivery time in minutes for this cell; null when unavailable, never zero. */
  medianMinutes: number | null;
  /** Interquartile range of delivery time in minutes for this cell; null when unavailable. */
  iqrMinutes: number | null;
  /** Observation count backing this cell. Also the confidence/insufficient-data signal. */
  n: number;
};

/** A delivery-time field snapshot: a grid of predicted or observed median minutes with per-cell confidence. */
export type MapSurface = {
  /** Grid cells composing this surface. */
  cells: readonly MapSurfaceCell[];
  /** ISO timestamp this surface was computed/valid as of. */
  asOf: string;
  /** Computation source or model identifier. */
  source: string;
};

/** Native MapLibre clustering configuration for dense facility groups. See `NetworkMapProps.clusterFacilities`. */
export type ClusterFacilitiesOptions = {
  /**
   * Maximum zoom at which facilities still cluster; above this zoom every facility renders
   * individually regardless of proximity. Passed through to MapLibre's `clusterMaxZoom`.
   * Defaults to 14.
   */
  maxZoom?: number;
  /**
   * Cluster radius in pixels, evaluated at zoom 0 (supercluster scales it at other zooms).
   * Passed through to MapLibre's `clusterRadius`. Defaults to 50.
   */
  radius?: number;
};

/** Explicit camera request; ordinary data updates never issue a camera request. */
export type MapFocus = {
  /** Change this value to repeat a request for the same locations. */
  revision: string | number;
  /** Facility identifiers whose bounds should be fitted. */
  facilityIds: readonly string[];
  /** Upper zoom bound for a fitted view; defaults to 12. */
  maxZoom?: number;
};

/** Presentation and controlled selection contract for an optional geographic map. */
export type NetworkMapProps = {
  /** Visible heading and accessible region name. `null` renders no heading block at all -- use
   *  when the caller already frames this map with its own adjacent heading; the region and
   *  toolbar fall back to a generic accessible name ("Map"/"Map camera and layers") so they stay
   *  nameable without a visible heading. When `null`, `description` must also be `null`. */
  title: string | null;
  /** Coverage, observation window and main geographic question. Must be `null` when `title` is
   *  `null` -- a heading-less map has no description to show either. */
  description: string | null;
  /** Caller-chosen MapLibre style URL or object, including source attribution. Keep object identity stable. */
  mapStyle: string | StyleSpecification;
  /** URL of the bundled MapLibre module worker matching the installed version. Keep stable across all maps in one application. */
  workerUrl: string;
  /** Locations in the current authorized cohort. */
  facilities: readonly MapFacility[];
  /** Ordered connections in that cohort. */
  segments: readonly MapSegment[];
  /** Optional time-filtered weather/disruption polygons. */
  areas?: readonly MapArea[];
  /** Optional delivery-time field surface, rendered as a data-driven fill layer. */
  surface?: MapSurface;
  /** Controlled location selection. */
  selectedFacilityId?: string;
  /** Receives marker, equivalent table, Selected leg destination or Latest events selection. */
  onFacilitySelect?: (id: string) => void;
  /** Controlled segment emphasis and Selected leg camera target. */
  selectedSegmentId?: string;
  /** Facility of the last observed event, never an interpolated current position. */
  latestFacilityId?: string;
  /** Location labels to prioritize alongside selection and last observation. */
  primaryFacilityIds?: readonly string[];
  /** Explicit camera command issued by application selection controls. */
  focus?: MapFocus;
  /** Initial view only; omit to fit all facilities once on mount. */
  initialView?: { center: MapCoordinate; zoom: number };
  /** Map height in CSS pixels; defaults to 560, minimum 280. */
  height?: number;
  /** Receives initialization, tile or rendering errors. The data table remains available. */
  onRenderError?: (error: unknown) => void;
  /**
   * Escape hatch for custom styling and overlays this component's own typed props cannot express
   * (e.g. a custom `line-width` expression, a continuous facility-severity radius, or a highlight
   * mechanism that survives a fully-populated `MapSegment.color`). Fires exactly once per mount,
   * after this component's own initial sources/layers have been added on `"load"` AND its own
   * first data/paint-property pass has already run — so a consumer's own `addSource`/`addLayer`/
   * `setPaintProperty`/`Marker` calls are guaranteed to layer on top of, never race, this
   * component's own baseline styling.
   *
   * This component's own layer ids, useful for a consumer calling `map.setPaintProperty(...)`
   * against them directly: `"easy-ui-observed"` (transfer/measured evidence line layer) and
   * `"easy-ui-unobserved"` (planned/inferred evidence line layer). Its own sources are
   * `"easy-ui-transfers"` and `"easy-ui-weather"`.
   *
   * Does NOT re-fire on `facilities`/`segments`/other data updates — this component holds one
   * stable `Map` instance across those updates (a new instance is only created when `mapStyle` or
   * `workerUrl` change, remounting the map). A consumer that wants its own custom layers/markers
   * to react to ongoing data changes must retain the `map` instance itself (e.g. in a ref) and
   * manage its own update logic independently; this component's internal update effect never
   * calls back into `onMapReady`.
   */
  onMapReady?: (map: MapInstance) => void;
  /**
   * Opt-in native MapLibre clustering (via the `supercluster` library MapLibre bundles
   * internally) for dense facility groups — e.g. metro-scale co-located zip3s. Undefined (the
   * default) preserves today's exact behavior: every facility renders as its own always-visible,
   * always-interactive `Marker`, with click-to-select, severity risk styling and an accessible
   * role, regardless of how many facilities share a location.
   *
   * When set, facilities MapLibre's clustering currently merges together render as a `circle`
   * layer (radius/color bucketed by member count) plus a count label, drawn from a clustered
   * GeoJSON source — NOT as individual `Marker`s. This is captured once at mount, like `mapStyle`/
   * `workerUrl`: toggling it on an already-mounted map has no effect until the map remounts.
   *
   * Real tradeoff, stated plainly: while a facility is inside a cluster, it cannot be
   * individually selected, does not show its own severity risk badge, and is not reachable via
   * `selectedFacilityId`/`onFacilitySelect` — the same UX cost any clustering system pays.
   * Clicking a cluster flies the camera to that cluster's natural expansion zoom (MapLibre's
   * `getClusterExpansionZoom`), and supercluster's own zoom-based declustering splits it apart at
   * that point — each member facility then renders as its usual fully-interactive `Marker`, with
   * severity/selection/labels working exactly as when this prop is omitted.
   * `primaryFacilityIds`/`latestFacilityId`/`selectedFacilityId` are not currently forced out of a
   * cluster into their own marker — a caller that needs a specific facility to always stay
   * individually selectable alongside dense clustering should pick a `radius`/`maxZoom` that keeps
   * it separated at the zoom levels that matter, or leave this prop unset for that cohort.
   */
  clusterFacilities?: ClusterFacilitiesOptions;
};
