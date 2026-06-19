// Lightweight client-side logging stub. Stands in for a real telemetry sink (Sentry,
// Datadog, etc.) — swap the bodies below for real exporter calls when one is wired up.
type LogLevel = "info" | "warn" | "error";

interface LogEvent {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

function emit(event: LogEvent): void {
  const payload = `[orbitflow:${event.level}] ${event.message}`;
  if (event.level === "error") {
    console.error(payload, event.context ?? {});
  } else if (event.level === "warn") {
    console.warn(payload, event.context ?? {});
  } else {
    console.info(payload, event.context ?? {});
  }
}

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    emit({ level: "info", message, context, timestamp: new Date().toISOString() });
  },
  warn(message: string, context?: Record<string, unknown>) {
    emit({ level: "warn", message, context, timestamp: new Date().toISOString() });
  },
  error(message: string, context?: Record<string, unknown>) {
    emit({ level: "error", message, context, timestamp: new Date().toISOString() });
  },
};
