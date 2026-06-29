/**
 * Top-layer DOM primitives
 * ------------------------
 * Low-level helpers for exempting a body-level node from react-aria's modal
 * hiding/containment via the `data-react-aria-top-layer` opt-out. See the module
 * overview in `index.ts` for the why.
 */

export const TOP_LAYER_ATTR = "data-react-aria-top-layer";

/**
 * Exempt a node from react-aria's modal hiding/containment. Returns whether
 * anything actually changed — the no-op-when-clean result lets observers
 * re-apply it on every mutation without looping.
 */
export const markElementAsTopLayer = (node: HTMLElement): boolean => {
  let changed = false;
  if (node.getAttribute(TOP_LAYER_ATTR) !== "true") {
    node.setAttribute(TOP_LAYER_ATTR, "true");
    changed = true;
  }
  if (node.hasAttribute("aria-hidden")) {
    node.removeAttribute("aria-hidden");
    changed = true;
  }
  // react-aria sets `inert` as a property (not only an attribute) when
  // `shouldUseInert` is on, so release the property too.
  if (node.inert) {
    node.inert = false;
    changed = true;
  }
  return changed;
};

/**
 * Revert {@link markElementAsTopLayer}. Returns whether anything changed.
 *
 * We only strip the top-layer tag — we deliberately do NOT re-add `inert` /
 * `aria-hidden`. This runs as the modal unmounts, when the whole page is
 * becoming interactive again; react-aria owns those attributes and clears them
 * on its own teardown. The tag, however, is ours, and if it lingers on a
 * body-level node after the modal is gone, react-aria's `isElementInChildScope`
 * keeps treating that subtree as part of a (now-destroyed) focus scope — which
 * derails focus restore on close and corrupts the next modal that opens.
 */
export const unmarkElementAsTopLayer = (node: HTMLElement): boolean => {
  if (node.getAttribute(TOP_LAYER_ATTR) === "true") {
    node.removeAttribute(TOP_LAYER_ATTR);
    return true;
  }
  return false;
};

/**
 * Refcounted ownership of the top-layer tag.
 *
 * The overlay scan is page-wide (`document.body.querySelectorAll`), so two
 * boundaries with the same selector both match — and both tag — the same
 * body-level node. Each tracks the node in its own set, so without coordination
 * the first one to unmount would strip a tag the other still needs, letting
 * react-aria re-`inert` the node and re-lock the overlay. Refcounting fixes
 * that: the tag is applied on the first claim and reverted only when the last
 * claimant releases. A `WeakMap` keeps no detached nodes alive — entries vanish
 * with the node.
 */
const topLayerClaims = new WeakMap<HTMLElement, number>();

/**
 * Claim the top-layer exemption for a node, applying the tag on the first claim.
 * Re-asserts the tag on every claim (react-aria may have re-applied `inert`
 * since); returns whether the tag actually changed.
 */
export const claimTopLayer = (node: HTMLElement): boolean => {
  topLayerClaims.set(node, (topLayerClaims.get(node) ?? 0) + 1);
  return markElementAsTopLayer(node);
};

/**
 * Release one claim on a node. Reverts the node (and returns `true`) only when
 * the last claimant releases; while other claimants remain, the tag is left in
 * place and this returns `false`.
 */
export const releaseTopLayer = (node: HTMLElement): boolean => {
  const count = topLayerClaims.get(node) ?? 0;
  if (count <= 1) {
    topLayerClaims.delete(node);
    return unmarkElementAsTopLayer(node);
  }
  topLayerClaims.set(node, count - 1);
  return false;
};

/** Current number of live claims on a node (`0` if none). */
export const topLayerClaimCount = (node: HTMLElement): number =>
  topLayerClaims.get(node) ?? 0;

/** Climb to the element that is a direct child of `<body>`. */
export const bodyLevelAncestor = (el: HTMLElement): HTMLElement => {
  let node = el;
  while (node.parentElement && node.parentElement !== document.body) {
    node = node.parentElement;
  }
  return node;
};
