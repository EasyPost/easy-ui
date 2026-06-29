import { renderHook } from "@testing-library/react-hooks";
import { TOP_LAYER_ATTR } from "./topLayer";
import { useThirdPartyOverlays } from "./useThirdPartyOverlays";

const STRIPE_SELECTOR = 'iframe[name^="__privateStripe"]';

describe("useThirdPartyOverlays lifecycle", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  const mountStripeOverlay = () => {
    const container = document.createElement("div");
    const iframe = document.createElement("iframe");
    iframe.setAttribute("name", "__privateStripeFrame123");
    container.appendChild(iframe);
    document.body.appendChild(container);
    return { container, iframe };
  };

  test("tags an escaped overlay on mount and reverts it on unmount", () => {
    const { container } = mountStripeOverlay();

    const { unmount } = renderHook(() =>
      useThirdPartyOverlays({ selector: STRIPE_SELECTOR }),
    );

    // the body-level ancestor of the Stripe iframe is exempted while mounted
    expect(container.getAttribute(TOP_LAYER_ATTR)).toBe("true");

    unmount();

    // and the tag must not linger once the modal is gone
    expect(container.hasAttribute(TOP_LAYER_ATTR)).toBe(false);
  });

  test("blurs focus stuck inside a tagged overlay on unmount", () => {
    const { container } = mountStripeOverlay();
    const input = document.createElement("input");
    container.appendChild(input);

    const { unmount } = renderHook(() =>
      useThirdPartyOverlays({ selector: STRIPE_SELECTOR }),
    );

    input.focus();
    expect(document.activeElement).toBe(input);

    unmount();

    // focus is released to <body> so react-aria can restore it cleanly
    expect(document.activeElement).not.toBe(input);
  });

  test("leaves overlays inside a dialog alone", () => {
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    const iframe = document.createElement("iframe");
    iframe.setAttribute("name", "__privateStripeFrame123");
    dialog.appendChild(iframe);
    document.body.appendChild(dialog);

    renderHook(() => useThirdPartyOverlays({ selector: STRIPE_SELECTOR }));

    // widgets inside the dialog are already interactive; nothing to tag
    expect(dialog.hasAttribute(TOP_LAYER_ATTR)).toBe(false);
  });
});
