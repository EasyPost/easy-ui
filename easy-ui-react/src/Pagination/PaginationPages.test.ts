import { getPaginationRange } from "./PaginationPages";

describe("getPaginationRange()", () => {
  const defaults = { siblingCount: 2, boundaryCount: 0 };

  it("should return nothing without any pages", () => {
    expect(getPaginationRange({ page: 1, count: 0, ...defaults })).toEqual([]);
  });

  it("should return every page when they all fit", () => {
    expect(getPaginationRange({ page: 1, count: 1, ...defaults })).toEqual([1]);
    expect(getPaginationRange({ page: 1, count: 3, ...defaults })).toEqual([
      1, 2, 3,
    ]);
  });

  it("should truncate the end when the current page is near the start", () => {
    expect(getPaginationRange({ page: 1, count: 10, ...defaults })).toEqual([
      1,
      2,
      3,
      4,
      5,
      6,
      "ellipsis",
    ]);
  });

  it("should truncate the start when the current page is near the end", () => {
    expect(getPaginationRange({ page: 10, count: 10, ...defaults })).toEqual([
      "ellipsis",
      5,
      6,
      7,
      8,
      9,
      10,
    ]);
  });

  it("should truncate both ends when the current page is in the middle", () => {
    expect(getPaginationRange({ page: 5, count: 10, ...defaults })).toEqual([
      "ellipsis",
      3,
      4,
      5,
      6,
      7,
      "ellipsis",
    ]);
  });

  it("should pin the boundaries when a boundary count is given", () => {
    expect(
      getPaginationRange({
        page: 1,
        count: 10,
        siblingCount: 1,
        boundaryCount: 1,
      }),
    ).toEqual([1, 2, 3, 4, 5, "ellipsis", 10]);
  });

  it("should show a lone hidden page rather than truncate it", () => {
    const range = getPaginationRange({
      page: 4,
      count: 8,
      siblingCount: 1,
      boundaryCount: 1,
    });
    // Only page 2 sits between the start boundary and the siblings, so showing
    // it costs no more room than an ellipsis would. Pages 6 and 7 are both
    // hidden on the other side, so that side still truncates
    expect(range).toEqual([1, 2, 3, 4, 5, "ellipsis", 8]);
  });

  it("should not repeat a page", () => {
    for (let count = 1; count <= 12; count++) {
      for (let page = 1; page <= count; page++) {
        const range = getPaginationRange({ page, count, ...defaults });
        const pages = range.filter((item) => item !== "ellipsis");
        expect(new Set(pages).size).toBe(pages.length);
      }
    }
  });

  it("should keep pages in ascending order", () => {
    for (let count = 1; count <= 12; count++) {
      for (let page = 1; page <= count; page++) {
        const range = getPaginationRange({ page, count, ...defaults });
        const pages = range.filter(
          (item): item is number => item !== "ellipsis",
        );
        expect(pages).toEqual([...pages].sort((a, b) => a - b));
      }
    }
  });

  it("should always include the current page", () => {
    for (let count = 1; count <= 12; count++) {
      for (let page = 1; page <= count; page++) {
        expect(getPaginationRange({ page, count, ...defaults })).toContain(
          page,
        );
      }
    }
  });
});
