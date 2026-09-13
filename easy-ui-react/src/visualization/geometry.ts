/**
 * Optional markers: none, every observation, endpoints of each continuous
 * segment, or the global minimum/maximum. Isolated observations are always
 * drawn, and coincident extrema are not duplicated.
 */
export type MarkerMode = "none" | "all" | "endpoints" | "extrema";
/** A point in plot coordinates, ordered as horizontal and vertical position. */
export type PlotPoint = [number, number];

/** Whether both scale bounds are finite and the upper bound exceeds the lower. */
export function isDomain(domain: readonly [number, number]) {
  return domain.every(Number.isFinite) && domain[1] > domain[0];
}

/** Normalize before subtraction so large finite domains cannot overflow. */
export function position(value: number, domain: readonly [number, number]) {
  const scale = Math.max(Math.abs(domain[0]), Math.abs(domain[1])) || 1;
  const extent = domain[1] / scale - domain[0] / scale;
  return extent ? (value / scale - domain[0] / scale) / extent : 0.5;
}

/** Select optional markers across segments, excluding separately drawn isolated points. */
export function markerPoints(segments: PlotPoint[][], mode: MarkerMode) {
  if (mode === "none") return [];
  // Isolated observations are always drawn separately, but still count as extrema.
  const isolated = new Set(
    segments.filter((points) => points.length === 1).flat(),
  );
  const optional = (points: PlotPoint[]) =>
    points.filter((point) => !isolated.has(point));
  if (mode === "all") return optional(segments.flat());
  if (mode === "endpoints")
    return optional(
      segments.flatMap((points) =>
        points.length > 1 ? [points[0], points[points.length - 1]] : points,
      ),
    );
  const points = segments.flat();
  if (!points.length) return [];
  let min = points[0];
  let max = points[0];
  for (const point of points) {
    if (point[1] < min[1]) min = point;
    if (point[1] > max[1]) max = point;
  }
  return optional(min === max ? [min] : [min, max]);
}
