import { useEffect, useState } from "react";
import { fetchHealth } from "../api/health";

type BannerState =
  | { kind: "loading" }
  | { kind: "ok"; message: string }
  | { kind: "error"; detail: string };

export function BackendHealthBanner() {
  const [state, setState] = useState<BannerState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchHealth()
      .then((data) => {
        if (!cancelled) {
          setState({ kind: "ok", message: data.message });
        }
      })
      .catch((err: unknown) => {
        const detail =
          err instanceof Error ? err.message : "Could not reach the API.";
        if (!cancelled) {
          setState({ kind: "error", detail });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === "loading") {
    return (
      <div className="api-health-banner api-health-banner-loading" role="status">
        API: checking…
      </div>
    );
  }

  if (state.kind === "ok") {
    return (
      <div className="api-health-banner api-health-banner-ok" role="status">
        API: {state.message}
      </div>
    );
  }

  return (
    <div className="api-health-banner api-health-banner-error" role="alert">
      API: {state.detail} (is the backend running, e.g. on port 9000?)
    </div>
  );
}
