import {
  TOP_LAYER_ATTR,
  bodyLevelAncestor,
  claimTopLayer,
  markElementAsTopLayer,
  releaseTopLayer,
  topLayerClaimCount,
  unmarkElementAsTopLayer,
} from "./topLayer";

describe("topLayer", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("markElementAsTopLayer", () => {
    test("tags the node and reports a change", () => {
      const el = document.createElement("div");
      expect(markElementAsTopLayer(el)).toBe(true);
      expect(el.getAttribute(TOP_LAYER_ATTR)).toBe("true");
    });

    test("clears react-aria's aria-hidden and inert", () => {
      const el = document.createElement("div");
      el.setAttribute("aria-hidden", "true");
      el.inert = true;

      expect(markElementAsTopLayer(el)).toBe(true);
      expect(el.hasAttribute("aria-hidden")).toBe(false);
      expect(el.inert).toBe(false);
    });

    test("is a no-op once the node is already exempt", () => {
      const el = document.createElement("div");
      markElementAsTopLayer(el);
      // a second pass must report no change so observers don't loop
      expect(markElementAsTopLayer(el)).toBe(false);
    });
  });

  describe("unmarkElementAsTopLayer", () => {
    test("removes the tag and reports a change", () => {
      const el = document.createElement("div");
      markElementAsTopLayer(el);

      expect(unmarkElementAsTopLayer(el)).toBe(true);
      expect(el.hasAttribute(TOP_LAYER_ATTR)).toBe(false);
    });

    test("is a no-op on an untagged node", () => {
      const el = document.createElement("div");
      expect(unmarkElementAsTopLayer(el)).toBe(false);
    });

    test("does not re-add inert / aria-hidden (react-aria owns those)", () => {
      const el = document.createElement("div");
      markElementAsTopLayer(el);
      unmarkElementAsTopLayer(el);

      expect(el.hasAttribute("aria-hidden")).toBe(false);
      expect(el.inert).toBeFalsy();
    });
  });

  describe("claimTopLayer / releaseTopLayer", () => {
    test("tags on the first claim", () => {
      const el = document.createElement("div");
      claimTopLayer(el);
      expect(el.getAttribute(TOP_LAYER_ATTR)).toBe("true");
      expect(topLayerClaimCount(el)).toBe(1);
    });

    test("reverts only when the last claimant releases", () => {
      const el = document.createElement("div");
      claimTopLayer(el);
      claimTopLayer(el);
      expect(topLayerClaimCount(el)).toBe(2);

      // first release: another claimant remains, so the tag stays
      expect(releaseTopLayer(el)).toBe(false);
      expect(el.getAttribute(TOP_LAYER_ATTR)).toBe("true");
      expect(topLayerClaimCount(el)).toBe(1);

      // last release: now it reverts
      expect(releaseTopLayer(el)).toBe(true);
      expect(el.hasAttribute(TOP_LAYER_ATTR)).toBe(false);
      expect(topLayerClaimCount(el)).toBe(0);
    });

    test("releasing an unclaimed node is a no-op", () => {
      const el = document.createElement("div");
      expect(releaseTopLayer(el)).toBe(false);
      expect(topLayerClaimCount(el)).toBe(0);
    });
  });

  describe("bodyLevelAncestor", () => {
    test("returns the direct child of <body> containing the element", () => {
      const container = document.createElement("div");
      const middle = document.createElement("div");
      const leaf = document.createElement("span");
      middle.appendChild(leaf);
      container.appendChild(middle);
      document.body.appendChild(container);

      expect(bodyLevelAncestor(leaf)).toBe(container);
    });

    test("returns the element itself when it is already a body child", () => {
      const el = document.createElement("div");
      document.body.appendChild(el);

      expect(bodyLevelAncestor(el)).toBe(el);
    });
  });
});
