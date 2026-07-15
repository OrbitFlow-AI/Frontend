// Unit tests for the generic pagination slice helper.
import { describe, expect, it } from "vitest";
import { paginate } from "@/lib/utils/paginate";

const items = Array.from({ length: 25 }, (_, i) => i + 1);

describe("paginate", () => {
  it("returns the first page by default page size math", () => {
    const result = paginate(items, 1, 10);
    expect(result.items).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result.totalPages).toBe(3);
    expect(result.page).toBe(1);
  });

  it("returns the last, partially-filled page", () => {
    const result = paginate(items, 3, 10);
    expect(result.items).toEqual([21, 22, 23, 24, 25]);
  });

  it("clamps a page number below 1 up to 1", () => {
    const result = paginate(items, -5, 10);
    expect(result.page).toBe(1);
  });

  it("clamps a page number above the last page down to the last page", () => {
    const result = paginate(items, 99, 10);
    expect(result.page).toBe(3);
  });

  it("reports a single total page for an empty list", () => {
    const result = paginate([], 1, 10);
    expect(result.items).toEqual([]);
    expect(result.totalPages).toBe(1);
  });
});
