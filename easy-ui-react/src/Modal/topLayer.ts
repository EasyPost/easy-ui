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

/** Climb to the element that is a direct child of `<body>`. */
export const bodyLevelAncestor = (el: HTMLElement): HTMLElement => {
  let node = el;
  while (node.parentElement && node.parentElement !== document.body) {
    node = node.parentElement;
  }
  return node;
};
