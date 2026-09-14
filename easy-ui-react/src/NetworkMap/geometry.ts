import type { FeatureCollection, Geometry } from "geojson";
import type { MapArea, MapCoordinate, MapFacility, MapSegment } from "./types";

export function validCoordinate(p: MapCoordinate) {
  return (
    Number.isFinite(p[0]) &&
    Number.isFinite(p[1]) &&
    Math.abs(p[0]) <= 180 &&
    Math.abs(p[1]) <= 85
  );
}

export function segmentData(
  facilities: readonly MapFacility[],
  segments: readonly MapSegment[],
): FeatureCollection<Geometry> {
  const byId = new Map(facilities.map((f) => [f.id, f]));
  const maxVolume = Math.max(
    1,
    ...segments.map((s) =>
      Number.isFinite(s.volume) ? Math.max(0, s.volume ?? 0) : 0,
    ),
  );
  return {
    type: "FeatureCollection",
    features: segments.flatMap((s) => {
      const from = byId.get(s.from),
        to = byId.get(s.to);
      if (!from || !to || (s.evidence === "measured" && !s.coordinates))
        return [];
      const points = s.coordinates ?? [from.coordinates, to.coordinates];
      if (points.length < 2 || !points.every(validCoordinate)) return [];
      return [
        {
          type: "Feature" as const,
          id: s.id,
          properties: {
            id: s.id,
            evidence: s.evidence,
            width:
              s.volume === undefined
                ? 4
                : 2 +
                  Math.sqrt(
                    Math.max(0, Number.isFinite(s.volume) ? s.volume : 0) /
                      maxVolume,
                  ) *
                    5,
            ...(s.color === undefined ? {} : { color: s.color }),
          },
          geometry: {
            type: "LineString" as const,
            coordinates: points.map((p) => [...p]),
          },
        },
      ];
    }),
  };
}

/**
 * One GeoJSON Point feature per valid-coordinate facility, carrying only its `id` as a property —
 * the minimum a clustered MapLibre source needs. Feeds `NetworkMap`'s optional `clusterFacilities`
 * source; MapLibre's own supercluster integration computes `cluster`/`cluster_id`/`point_count` on
 * top of this at render time, so they are never set here.
 */
export function facilityPointData(
  facilities: readonly MapFacility[],
): FeatureCollection<Geometry> {
  return {
    type: "FeatureCollection",
    features: facilities
      .filter((f) => validCoordinate(f.coordinates))
      .map(
        (f) =>
          ({
            type: "Feature" as const,
            properties: { id: f.id },
            geometry: {
              type: "Point" as const,
              coordinates: [...f.coordinates],
            },
          }) as const,
      ),
  };
}

export function areaData(
  areas: readonly MapArea[],
): FeatureCollection<Geometry> {
  return {
    type: "FeatureCollection",
    features: areas.flatMap((a) => {
      if (a.coordinates.length < 3 || !a.coordinates.every(validCoordinate))
        return [];
      const ring = a.coordinates.map((p) => [...p]);
      if (
        ring[0][0] !== ring[ring.length - 1][0] ||
        ring[0][1] !== ring[ring.length - 1][1]
      )
        ring.push([...ring[0]]);
      return [
        {
          type: "Feature" as const,
          properties: { id: a.id },
          geometry: { type: "Polygon" as const, coordinates: [ring] },
        },
      ];
    }),
  };
}

// Choose the shorter wrapped longitude interval, including dateline journeys.
export function geographicBounds(
  points: readonly MapCoordinate[],
): [[number, number], [number, number]] | null {
  const valid = points.filter(validCoordinate);
  if (!valid.length) return null;
  const longitudes = valid.map(([x]) => (x + 360) % 360).sort((a, b) => a - b);
  let gap = -1,
    index = 0;
  longitudes.forEach((x, i) => {
    const next =
      i + 1 < longitudes.length ? longitudes[i + 1] : longitudes[0] + 360;
    if (next - x > gap) {
      gap = next - x;
      index = i;
    }
  });
  let west = longitudes[(index + 1) % longitudes.length],
    east = longitudes[index];
  if (east < west) east += 360;
  if (west > 180) {
    west -= 360;
    east -= 360;
  }
  return [
    [west, Math.min(...valid.map((p) => p[1]))],
    [east, Math.max(...valid.map((p) => p[1]))],
  ];
}

export type LabelCandidate = {
  id: string;
  x: number;
  y: number;
  width: number;
  priority: number;
};
export function placeLabels(
  candidates: LabelCandidate[],
  width: number,
  height: number,
) {
  const occupied: { x: number; y: number; w: number; h: number }[] = [];
  const positions = new Map<string, { left: number; top: number }>();
  for (const c of [...candidates].sort(
    (a, b) => b.priority - a.priority || a.id.localeCompare(b.id),
  )) {
    if (c.x < 0 || c.y < 0 || c.x > width || c.y > height) continue;
    for (const [dx, dy] of [
      [16, -13],
      [16, 15],
      [-c.width - 16, -13],
      [-c.width - 16, 15],
      [-c.width / 2, -44],
    ]) {
      const box = { x: c.x + dx, y: c.y + dy, w: c.width, h: 27 };
      if (
        box.x < 5 ||
        box.y < 5 ||
        box.x + box.w > width - 5 ||
        box.y + box.h > height - 35
      )
        continue;
      if (
        occupied.some(
          (b) =>
            box.x < b.x + b.w + 8 &&
            box.x + box.w + 8 > b.x &&
            box.y < b.y + b.h + 5 &&
            box.y + box.h + 5 > b.y,
        )
      )
        continue;
      occupied.push(box);
      positions.set(c.id, { left: dx, top: dy });
      break;
    }
  }
  return positions;
}
