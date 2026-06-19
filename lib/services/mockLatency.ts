// Shared artificial delay so every mock service resolves asynchronously like a real API would,
// letting components exercise real loading states instead of synchronous mock returns.
export function mockDelay<T>(value: T): Promise<T> {
  const ms = Number(process.env.NEXT_PUBLIC_MOCK_LATENCY_MS ?? 400);
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
