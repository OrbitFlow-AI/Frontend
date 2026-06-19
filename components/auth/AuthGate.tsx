// Mock single-session auth gate. Per the PRD, multi-tenant auth is explicitly out of scope —
// this only blocks unauthenticated access to the dashboard behind one local mock session.
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const SESSION_KEY = "orbitflow_mock_session";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthenticated(window.localStorage.getItem(SESSION_KEY) === "active");
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-semibold text-slate-100">OrbitFlow</h1>
        <p className="max-w-sm text-sm text-muted">
          Sign in to manage agent treasuries. This is a single mock operator session — there is
          no real authentication in this scaffold.
        </p>
        <Button
          onClick={() => {
            window.localStorage.setItem(SESSION_KEY, "active");
            setIsAuthenticated(true);
          }}
        >
          Sign in as Operator
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
