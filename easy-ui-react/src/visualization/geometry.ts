export type MarkerMode = "none" | "all" | "endpoints" | "extrema";
export type PlotPoint = [number, number];

export function isDomain(domain: readonly [number, number]) {
  return domain.every(Number.isFinite) && domain[1] > domain[0];
}

/** Normalize before subtraction so large finite domains cannot overflow. */
export function position(value: number, domain: readonly [number, number]) {
  const scale = Math.max(Math.abs(domain[0]), Math.abs(domain[1])) || 1;
  const extent = domain[1] / scale - domain[0] / scale;
  return extent ? (value / scale - domain[0] / scale) / extent : 0.5;
}

export function markerPoints(segments: PlotPoint[][], mode: MarkerMode) {
  if (mode === "none") return [];
  if (mode === "all") return segments.flat();
  if (mode === "endpoints")
    return segments.flatMap((points) =>
      points.length > 1 ? [points[0], points[points.length - 1]] : points,
    );
  const points = segments.flat();
  if (!points.length) return [];
  let min = points[0];
  let max = points[0];
  for (const point of points) {
    if (point[1] < min[1]) min = point;
    if (point[1] > max[1]) max = point;
  }
  return min === max ? [min] : [min, max];
}
