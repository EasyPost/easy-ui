import type {
  MapArea,
  MapFacility,
  MapRisk,
  MapSegment,
  MapSurface,
  MapSurfaceCell,
} from "./types";

// Keyless OpenFreeMap vector style for examples; applications choose their own provider.
export const exampleBasemap = "https://tiles.openfreemap.org/styles/positron";
export const snapshot = "2026-09-13T14:00:00Z";
function risk(
  probability: number | null,
  status: MapRisk["status"] = "current",
): MapRisk {
  return {
    probability,
    baseline: 0.06,
    event: "New tracking exception",
    horizonHours: 24,
    cohort: "Ground parcels inducted here during the preceding 24 hours",
    asOf: status === "stale" ? "2026-09-12T14:00:00Z" : snapshot,
    status,
  };
}
export const networkFacilities: MapFacility[] = [
  {
    id: "oak",
    label: "Oakland warehouse",
    coordinates: [-122.24, 37.79],
    kind: "warehouse",
    priority: 50,
    risk: risk(0.04),
  },
  {
    id: "dal",
    label: "Dallas warehouse",
    coordinates: [-96.82, 32.81],
    kind: "warehouse",
    priority: 45,
    risk: risk(0.05),
  },
  {
    id: "ewr",
    label: "Newark warehouse",
    coordinates: [-74.16, 40.73],
    kind: "warehouse",
    priority: 45,
    risk: risk(0.03),
  },
  {
    id: "slc",
    label: "Salt Lake City hub",
    coordinates: [-111.96, 40.76],
    kind: "hub",
    labelMinZoom: 3,
    priority: 25,
    risk: risk(0.07),
  },
  {
    id: "chi",
    label: "Chicago sort hub",
    coordinates: [-87.66, 41.81],
    kind: "hub",
    priority: 40,
    risk: risk(0.12),
  },
  {
    id: "dtw",
    label: "Detroit regional sort",
    coordinates: [-83.18, 42.37],
    kind: "hub",
    labelMinZoom: 5,
    priority: 30,
    risk: risk(0.18),
    detail: "18% facility-cohort exception risk · next 24h",
  },
  {
    id: "dbn",
    label: "Dearborn distribution",
    coordinates: [-83.215, 42.307],
    kind: "delivery",
    labelMinZoom: 8,
    priority: 20,
    risk: risk(0.09),
    detail:
      "Last scan 10:30 UTC · 3h 30m ago. Current parcel position unknown.",
  },
  {
    id: "liv",
    label: "Livonia distribution",
    coordinates: [-83.376, 42.396],
    kind: "delivery",
    labelMinZoom: 8,
    priority: 15,
    risk: risk(0.11),
  },
  {
    id: "war",
    label: "Warren distribution",
    coordinates: [-83.06, 42.486],
    kind: "delivery",
    labelMinZoom: 8,
    priority: 15,
    risk: risk(null, "unavailable"),
    detail: "Risk unavailable · insufficient scan coverage",
  },
  {
    id: "ann",
    label: "Ann Arbor distribution",
    coordinates: [-83.72, 42.27],
    kind: "delivery",
    labelMinZoom: 7,
    priority: 15,
    risk: risk(0.08, "stale"),
    detail: "Risk estimate stale · awaiting refresh",
  },
  {
    id: "dst",
    label: "Delivery area",
    coordinates: [-83.276, 42.296],
    kind: "destination",
    labelMinZoom: 8,
    priority: 10,
    detail: "Expected 16:00–18:00 UTC · no delivery scan",
  },
];
export const parcelEvents = [
  {
    id: "accepted",
    facility: "oak",
    time: "Sep 10 · 16:00",
    event: "Accepted at origin",
    note: "Warehouse handoff recorded",
  },
  {
    id: "departed",
    facility: "oak",
    time: "Sep 10 · 17:10",
    event: "Departed Oakland",
    note: "Two events at the same facility",
  },
  {
    id: "slc",
    facility: "slc",
    time: "Sep 11 · 08:20",
    event: "Regional hub scan",
    note: "Transfer endpoints observed",
  },
  {
    id: "chi",
    facility: "chi",
    time: "Sep 12 · 01:45",
    event: "Sorted in Chicago",
    note: "Linehaul transfer recorded",
  },
  {
    id: "dtw",
    facility: "dtw",
    time: "Sep 13 · 06:15",
    event: "Detroit regional sort",
    note: "Inbound processing complete",
  },
  {
    id: "dbn-arrive",
    facility: "dbn",
    time: "Sep 13 · 09:00",
    event: "Arrived at distribution",
    note: "Dearborn delivery network",
  },
  {
    id: "dbn-depart",
    facility: "dbn",
    time: "Sep 13 · 10:30",
    event: "Departed distribution",
    note: "Last observed event · current position unknown",
  },
];
const route = ["oak", "slc", "chi", "dtw", "dbn", "dst"];
export const parcelSegments: MapSegment[] = route.slice(1).map((to, i) => ({
  id: `${route[i]}-${to}`,
  from: route[i],
  to,
  evidence: to === "dst" ? "planned" : "transfer",
  label: `${networkFacilities.find((f) => f.id === route[i])!.label} → ${networkFacilities.find((f) => f.id === to)!.label}`,
}));
export const parcelFacilities = networkFacilities.filter((f) =>
  route.includes(f.id),
);
export const networkSegments: MapSegment[] = [
  ...parcelSegments
    .filter((s) => s.to !== "dst")
    .map((s, i) => ({ ...s, volume: [840, 840, 1100, 520][i] })),
  {
    id: "dal-chi",
    from: "dal",
    to: "chi",
    evidence: "transfer",
    label: "Dallas → Chicago · 260 Ground parcels / 24h",
    volume: 260,
  },
  {
    id: "ewr-dtw",
    from: "ewr",
    to: "dtw",
    evidence: "transfer",
    label: "Newark → Detroit · 140 Ground parcels / 24h",
    volume: 140,
  },
  {
    id: "dtw-liv",
    from: "dtw",
    to: "liv",
    evidence: "transfer",
    label: "Detroit → Livonia · 240 Ground parcels / 24h",
    volume: 240,
  },
  {
    id: "dtw-war",
    from: "dtw",
    to: "war",
    evidence: "transfer",
    label: "Detroit → Warren · 180 Ground parcels / 24h",
    volume: 180,
  },
  {
    id: "dtw-ann",
    from: "dtw",
    to: "ann",
    evidence: "transfer",
    label: "Detroit → Ann Arbor · 300 Ground parcels / 24h",
    volume: 300,
  },
];
export const weatherAreas: MapArea[] = [
  {
    id: "rain",
    label: "Heavy rain · southeast Michigan",
    evidence: "forecast",
    validFrom: "2026-09-13T14:00Z",
    validUntil: "2026-09-13T20:00Z",
    source: "Synthetic weather fixture",
    coordinates: [
      [-83.66, 42.17],
      [-83.54, 42.56],
      [-83.22, 42.63],
      [-82.9, 42.42],
      [-83.05, 42.13],
    ],
  },
];
// Grid cells covering the same southeast Michigan area as the facilities/weather fixtures
// above, hand-picked (not a regular tiling) to show the fill layer's full encoding range:
// fast/well-sampled near the Detroit hub, slow/well-sampled toward the exurbs, and two
// low-`n` cells whose fill should read as barely-there regardless of their own median.
const deliveryTimeSurfaceCells: MapSurfaceCell[] = [
  {
    // Dearborn distribution core.
    latMin: 42.28,
    latMax: 42.34,
    lonMin: -83.26,
    lonMax: -83.16,
    medianMinutes: 26,
    iqrMinutes: 9,
    n: 240,
  },
  {
    // Detroit regional sort, just north.
    latMin: 42.34,
    latMax: 42.4,
    lonMin: -83.24,
    lonMax: -83.12,
    medianMinutes: 32,
    iqrMinutes: 11,
    n: 210,
  },
  {
    // Livonia, west of the sort hub.
    latMin: 42.36,
    latMax: 42.43,
    lonMin: -83.42,
    lonMax: -83.3,
    medianMinutes: 45,
    iqrMinutes: 14,
    n: 150,
  },
  {
    // Warren, north of the sort hub.
    latMin: 42.44,
    latMax: 42.53,
    lonMin: -83.12,
    lonMax: -83.0,
    medianMinutes: 51,
    iqrMinutes: 16,
    n: 130,
  },
  {
    // Ann Arbor distribution area, southwest.
    latMin: 42.22,
    latMax: 42.31,
    lonMin: -83.78,
    lonMax: -83.66,
    medianMinutes: 62,
    iqrMinutes: 20,
    n: 70,
  },
  {
    // Transitional cell between Ann Arbor and Livonia.
    latMin: 42.3,
    latMax: 42.38,
    lonMin: -83.6,
    lonMax: -83.48,
    medianMinutes: 74,
    iqrMinutes: 24,
    n: 40,
  },
  {
    // Northern exurb, slow and thinly sampled.
    latMin: 42.5,
    latMax: 42.6,
    lonMin: -83.66,
    lonMax: -83.52,
    medianMinutes: 98,
    iqrMinutes: 30,
    n: 16,
  },
  {
    // Sparse rural cell: high median, but n is too low to trust it — should render
    // near-transparent even though its color would otherwise be the most saturated red.
    latMin: 42.14,
    latMax: 42.22,
    lonMin: -83.7,
    lonMax: -83.56,
    medianMinutes: 118,
    iqrMinutes: 35,
    n: 3,
  },
  {
    // Second low-n cell, moderate median and no IQR yet (still null when unavailable).
    latMin: 42.16,
    latMax: 42.24,
    lonMin: -83.34,
    lonMax: -83.2,
    medianMinutes: 55,
    iqrMinutes: null,
    n: 2,
  },
];
export const deliveryTimeSurface: MapSurface = {
  cells: deliveryTimeSurfaceCells,
  asOf: snapshot,
  source: "Synthetic delivery-time field fixture",
};
export const parcelCohort = [
  {
    id: "EP-104",
    origin: "oak",
    facility: "dbn",
    destination: "Dearborn",
    status: "In transit",
    promiseRisk: 0.08,
    last: "10:30 UTC",
    promise: "18:00 UTC",
  },
  {
    id: "EP-105",
    origin: "oak",
    facility: "dtw",
    destination: "Livonia",
    status: "At regional sort",
    promiseRisk: 0.23,
    last: "07:10 UTC",
    promise: "18:00 UTC",
  },
  {
    id: "EP-201",
    origin: "dal",
    facility: "chi",
    destination: "Ann Arbor",
    status: "Scan overdue",
    promiseRisk: null,
    last: "Sep 12 · 21:40",
    promise: "Sep 14 · 18:00",
  },
  {
    id: "EP-202",
    origin: "dal",
    facility: "liv",
    destination: "Livonia",
    status: "Out for delivery",
    promiseRisk: 0.05,
    last: "11:05 UTC",
    promise: "18:00 UTC",
  },
  {
    id: "EP-301",
    origin: "ewr",
    facility: "dtw",
    destination: "Warren",
    status: "At regional sort",
    promiseRisk: 0.19,
    last: "08:20 UTC",
    promise: "18:00 UTC",
  },
];
export const facilityMetrics: Record<
  string,
  {
    volume: number;
    expected: number;
    capacity: number;
    dwell: number;
    baselineDwell: number;
    backlog: number;
  }
> = {
  dtw: {
    volume: 12400,
    expected: 9800,
    capacity: 11500,
    dwell: 6.8,
    baselineDwell: 3.1,
    backlog: 1640,
  },
  dbn: {
    volume: 5200,
    expected: 4800,
    capacity: 6000,
    dwell: 2.2,
    baselineDwell: 1.8,
    backlog: 160,
  },
  liv: {
    volume: 2400,
    expected: 2200,
    capacity: 3000,
    dwell: 2.8,
    baselineDwell: 2.1,
    backlog: 280,
  },
  war: {
    volume: 1800,
    expected: 1700,
    capacity: 2400,
    dwell: 2.4,
    baselineDwell: 2.1,
    backlog: 220,
  },
  ann: {
    volume: 3000,
    expected: 2900,
    capacity: 3600,
    dwell: 2.1,
    baselineDwell: 1.9,
    backlog: 150,
  },
};
