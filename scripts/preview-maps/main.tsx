import "./console.mjs";
import React, { lazy, Suspense, useState } from "react";
import { createRoot } from "react-dom/client";
import "../../.storybook/public/poppins.css";
import "../../easy-ui-react/src/styles/global.scss";
import "./preview.css";
import { ThemeProvider } from "../../easy-ui-react/src/Theme";
import type { MapAudience } from "../../easy-ui-react/src/NetworkMap/NetworkMap.examples";
const Example = lazy(() =>
  import("../../easy-ui-react/src/NetworkMap/NetworkMap.examples").then(
    (m) => ({ default: m.NetworkMapExample }),
  ),
);
function App() {
  const query = new URLSearchParams(location.search).get("audience");
  const [audience, setAudience] = useState<MapAudience>(
    query === "shipper" || query === "carrier" ? query : "parcel",
  );
  return (
    <>
      <nav aria-label="Network intelligence examples">
        <span className="wordmark">
          Easy UI <span>/ Network intelligence</span>
        </span>
        <div>
          {(
            [
              ["parcel", "Parcel journey"],
              ["shipper", "Shipper flow"],
              ["carrier", "Carrier operations"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={audience === id}
              onClick={() => setAudience(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <a href="lightweight.html">Lightweight control</a>
      </nav>
      <main>
        <Suspense fallback={<p role="status">Loading example…</p>}>
          <Example key={audience} audience={audience} />
        </Suspense>
      </main>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <ThemeProvider colorScheme="light">
    <App />
  </ThemeProvider>,
);
