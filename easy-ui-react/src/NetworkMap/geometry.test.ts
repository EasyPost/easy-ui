import {
  areaData,
  geographicBounds,
  placeLabels,
  segmentData,
} from "./geometry";
import type { MapArea, MapFacility, MapSegment } from "./types";
import { networkSegments, facilityMetrics } from "./NetworkMap.fixtures";

it("fits dateline and ordinary journeys using the shortest longitude interval", () => {
  expect(
    geographicBounds([
      [179, 10],
      [-179, 20],
    ]),
  ).toEqual([
    [179, 10],
    [181, 20],
  ]);
  expect(
    geographicBounds([
      [-122, 38],
      [-74, 41],
    ]),
  ).toEqual([
    [-122, 38],
    [-74, 41],
  ]);
  expect(
    geographicBounds([
      [NaN, 20],
      [0, 90],
    ]),
  ).toBeNull();
});
it("prioritizes selection, avoids overlapping labels and drops offscreen locations", () => {
  const result = placeLabels(
    [
      { id: "other", x: 200, y: 100, width: 120, priority: 1 },
      { id: "selected", x: 200, y: 100, width: 120, priority: 1000 },
      { id: "offscreen", x: -100, y: 100, width: 120, priority: 1 },
    ],
    400,
    240,
  );
  expect(result.get("selected")).toEqual({ left: 16, top: -13 });
  expect(result.get("other")).not.toEqual(result.get("selected"));
  expect(result.has("offscreen")).toBe(false);
});
it("does not invent measured routes or draw invalid geographic records", () => {
  const facilities: MapFacility[] = [
    { id: "a", label: "A", kind: "hub", coordinates: [0, 0] },
    { id: "b", label: "B", kind: "hub", coordinates: [1, 1] },
  ];
  const base: MapSegment = {
    id: "one",
    from: "a",
    to: "b",
    label: "A to B",
    evidence: "transfer",
  };
  const data = segmentData(facilities, [
    base,
    { ...base, id: "missing", to: "absent" },
    { ...base, id: "unmeasured", evidence: "measured" },
    {
      ...base,
      id: "invalid",
      coordinates: [
        [0, 0],
        [NaN, 2],
      ],
    },
  ]);
  expect(data.features.map((f) => f.id)).toEqual(["one"]);
  expect(data.features[0].geometry).toEqual({
    type: "LineString",
    coordinates: [
      [0, 0],
      [1, 1],
    ],
  });
});
it("closes weather rings without inventing geometry for invalid areas", () => {
  const area: MapArea = {
    id: "rain",
    label: "Rain",
    coordinates: [
      [0, 0],
      [1, 0],
      [0, 1],
    ],
    evidence: "forecast",
    validFrom: "2026-09-13T14:00:00Z",
    validUntil: "2026-09-13T20:00:00Z",
    source: "Synthetic",
  };
  expect(areaData([area]).features[0].geometry).toEqual({
    type: "Polygon",
    coordinates: [
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [0, 0],
      ],
    ],
  });
  expect(
    areaData([
      {
        ...area,
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      },
    ]).features,
  ).toHaveLength(0);
});
it("network examples conserve flow at the hubs and reconcile to carrier throughput", () => {
  for (const id of ["slc", "chi", "dtw"]) {
    const incoming = networkSegments
      .filter((s) => s.to === id)
      .reduce((n, s) => n + (s.volume ?? 0), 0);
    const outgoing = networkSegments
      .filter((s) => s.from === id)
      .reduce((n, s) => n + (s.volume ?? 0), 0);
    expect(incoming).toBe(outgoing);
  }
  for (const s of networkSegments.filter((s) => s.from === "dtw"))
    expect(facilityMetrics[s.to].volume).toBe((s.volume ?? 0) * 10);
});
