// Generic pure pagination slice, extracted so page-size math is unit-testable independent
// of any particular list's rendering.
export interface PaginationResult<T> {
  items: T[];
  totalPages: number;
  page: number;
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginationResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const clampedPage = Math.min(Math.max(1, page), totalPages);
  const start = (clampedPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    totalPages,
    page: clampedPage,
  };
}
