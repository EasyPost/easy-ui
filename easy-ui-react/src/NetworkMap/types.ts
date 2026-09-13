import type { StyleSpecification } from "maplibre-gl";

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
  /** Visible heading and accessible region name. */
  title: string;
  /** Coverage, observation window and main geographic question. */
  description: string;
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
  /** Controlled location selection. */
  selectedFacilityId?: string;
  /** Receives marker or equivalent table selection. */
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
};
