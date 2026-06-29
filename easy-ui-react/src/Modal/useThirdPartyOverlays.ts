import * as React from "react";
import {
  bodyLevelAncestor,
  claimTopLayer,
  markElementAsTopLayer,
  releaseTopLayer,
  topLayerClaimCount,
} from "./topLayer";

type IgnoreRefs = React.RefObject<HTMLElement> | React.RefObject<HTMLElement>[];

export type UseThirdPartyOverlaysOptions = {
  /**
   * CSS selector matching the overlay node(s) the widget appends to
   * `document.body` (e.g. Stripe iframes, reCAPTCHA challenge iframes).
   */
  selector: string;
  /**
   * Optional ref(s) whose subtrees should be left untouched. Nodes inside a
   * `[role="dialog"]` are already excluded automatically, so this is only needed
   * for extra precision (e.g. an inline widget rendered outside any dialog).
   */
  ignoreWithin?: IgnoreRefs;
  /**
   * Optional extra predicate applied to each matched element, for cases a CSS
   * selector can't express (size, attributes, etc.).
   */
  filter?: (element: HTMLElement) => boolean;
  /**
   * Minimum width/height (px) a matched node (or its body-level container) must
   * have to count as a visible/open overlay for `isOverlayOpen`. Defaults to
   * 100, which filters out the 0x0 controller iframes some widgets keep mounted.
   */
  minVisibleSizePx?: number;
};

const DEFAULT_MIN_VISIBLE_SIZE_PX = 100;

// A matched node inside a dialog is already interactive — only nodes that
// escaped the modal into `document.body` need rescuing. This lets the hook work
// without a ref even when the modal's content is portalled away.
const DIALOG_SELECTOR = '[role="dialog"], [role="alertdialog"]';

const toArray = (refs?: IgnoreRefs): React.RefObject<HTMLElement>[] => {
  if (!refs) {
    return [];
  }
  return Array.isArray(refs) ? refs : [refs];
};

const hasSize = (el: HTMLElement, min: number) => {
  const rect = el.getBoundingClientRect();
  return rect.width >= min && rect.height >= min;
};

/**
 * Watches `document.body` for third-party overlay nodes matching `selector` and
 * tags them so they escape an Easy UI / react-aria modal's focus trap, `inert`,
 * and `aria-hidden`. The modal stays mounted — nothing is closed or re-opened.
 *
 * @returns `isOverlayOpen` — true while a visibly-sized matched overlay exists,
 *   for callers that want to react (e.g. dim the modal). Tagging happens
 *   regardless of this value.
 */
export const useThirdPartyOverlays = ({
  selector,
  ignoreWithin,
  filter,
  minVisibleSizePx = DEFAULT_MIN_VISIBLE_SIZE_PX,
}: UseThirdPartyOverlaysOptions) => {
  const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);

  // Read the latest non-primitive options at scan time so the observer doesn't
  // need to re-subscribe when callers pass inline refs/arrays/closures.
  const optionsRef = React.useRef({ ignoreWithin, filter });
  optionsRef.current = { ignoreWithin, filter };

  // Every body-level node we've tagged, so we can revert them when the modal
  // unmounts. Without this, stale `data-react-aria-top-layer` nodes linger in
  // the body and react-aria keeps treating them as part of the destroyed focus
  // scope — which is what locked the page up when the modal closed.
  const taggedNodesRef = React.useRef<Set<HTMLElement>>(new Set());

  React.useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    // Capture the (stable) Set so the cleanup closure references the same
    // instance the effect used, not whatever the ref points to at teardown.
    const taggedNodes = taggedNodesRef.current;

    const scan = () => {
      const ignoreRefs = toArray(optionsRef.current.ignoreWithin);
      const { filter: filterFn } = optionsRef.current;
      const matches = Array.from(
        document.body.querySelectorAll<HTMLElement>(selector),
      );

      const containers = new Set<HTMLElement>();
      let overlayVisible = false;

      matches.forEach((element) => {
        // widgets rendered inside the dialog are already interactive; only
        // overlays that escaped into the body need rescuing
        if (element.closest(DIALOG_SELECTOR)) {
          return;
        }
        // leave inline widgets that live inside an ignored subtree alone
        if (ignoreRefs.some((ref) => ref.current?.contains(element))) {
          return;
        }
        if (filterFn && !filterFn(element)) {
          return;
        }
        const container = bodyLevelAncestor(element);
        // never tag a subtree we were told to ignore (e.g. the modal's portal)
        if (
          ignoreRefs.some(
            (ref) => ref.current && container.contains(ref.current),
          )
        ) {
          return;
        }
        containers.add(container);
        if (
          hasSize(element, minVisibleSizePx) ||
          hasSize(container, minVisibleSizePx)
        ) {
          overlayVisible = true;
        }
      });

      containers.forEach((container) => {
        if (taggedNodes.has(container)) {
          // already our claim — re-assert the tag in case react-aria re-applied
          // inert/aria-hidden since the last scan
          markElementAsTopLayer(container);
        } else {
          taggedNodes.add(container);
          claimTopLayer(container);
        }
      });
      setIsOverlayOpen(overlayVisible);
    };

    scan();

    // Coalesce mutation bursts into a single scan per frame. react-aria toggles
    // `inert`/`aria-hidden` across the whole page when a modal opens/closes, so
    // we deliberately do NOT observe attributes (that storm caused a hang) — we
    // only watch childList. react-aria re-applies `inert` from its own childList
    // observer, so a node addition is the only event we need to react to.
    let frame = 0;
    const schedule = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        scan();
      });
    };

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      observer.disconnect();

      // Release every node we claimed. Refcounting means a node shared with
      // another mounted boundary keeps its tag until that boundary releases too
      // — only the final claimant actually reverts it. If focus is inside a node
      // we're truly reverting (e.g. the user closed the modal while a Stripe
      // Link/OTP iframe was focused), blur it first: leaving focus in a
      // top-layer subtree as the scope unmounts is exactly what sends
      // react-aria's focus restore into a loop. Blurring drops focus to <body>,
      // from which react-aria restores to the trigger cleanly. We skip the blur
      // while another boundary still claims the node, since it stays live.
      const active = document.activeElement;
      taggedNodes.forEach((node) => {
        const isLastClaim = topLayerClaimCount(node) <= 1;
        if (
          isLastClaim &&
          active instanceof HTMLElement &&
          node.contains(active)
        ) {
          active.blur();
        }
        releaseTopLayer(node);
      });
      taggedNodes.clear();
    };
  }, [selector, minVisibleSizePx]);

  return { isOverlayOpen };
};
