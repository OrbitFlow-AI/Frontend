// Root error boundary: catches uncaught render/runtime errors anywhere under the app tree.
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { logger } from "@/lib/observability/logger";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    logger.error("Unhandled application error", { message: error.message });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-xl font-semibold text-slate-100">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted">
        An unexpected error interrupted this view. You can try again, or navigate back to the
        dashboard.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
