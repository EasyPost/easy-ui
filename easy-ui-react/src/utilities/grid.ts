import { ResponsiveProp } from "./css";

/**
 * Fraction aliases for a grid track, so a two-thirds/one-third split can be
 * named rather than written as `minmax(0, 2fr) minmax(0, 1fr)`.
 */
export type GridTrackAlias =
  "oneFourth" | "oneThird" | "oneHalf" | "twoThirds" | "threeFourths";

/**
 * A grid track list. A number produces that many equal tracks, an array names
 * each track in turn, and a string passes through as raw CSS so forms like
 * `repeat(auto-fit, minmax(275px, 1fr))` remain available.
 */
export type GridTracksType = number | string | (string | GridTrackAlias)[];

export type GridTracks = ResponsiveProp<GridTracksType>;

/** Resolves a grid track list, preserving any breakpoint structure. */
export function formatGridTracks(
  tracks?: GridTracks,
): ResponsiveProp<string | undefined> {
  if (typeof tracks === "object" && tracks !== null && !Array.isArray(tracks)) {
    return Object.fromEntries(
      Object.entries(tracks).map(([breakpointAlias, breakpointTracks]) => [
        breakpointAlias,
        getTrackValue(breakpointTracks),
      ]),
    );
  }

  return getTrackValue(tracks);
}

function getTrackValue(tracks?: GridTracksType) {
  if (!tracks) return undefined;

  if (typeof tracks === "number" || !isNaN(Number(tracks))) {
    return `repeat(${Number(tracks)}, minmax(0, 1fr))`;
  }

  if (typeof tracks === "string") return tracks;

  return tracks
    .map((track) => {
      switch (track) {
        case "oneFourth":
        case "oneThird":
        case "oneHalf":
          return "minmax(0, 1fr)";
        case "twoThirds":
          return "minmax(0, 2fr)";
        case "threeFourths":
          return "minmax(0, 3fr)";
        default:
          return track;
      }
    })
    .join(" ");
}
