const { parsePageNumber } = require("./parsePageNumber");

describe("parsePageNumber", () => {
  it("should parse page number when it exists", () => {
    let bookInfo =
      "- Your Highlight on page 98 | location 2052-2052 | Added on Tuesday, 28 March 2023 13:43:14  ";
    let pageNumber = parsePageNumber(bookInfo);
    expect(pageNumber).toEqual(98);
  });

  it("should return undefined when page number is not present", () => {
    const bookInfo =
      "- Your Highlight | location 2052-2052 | Added on Tuesday, 28 March 2023 13:43:14  ";
    let pageNumber = parsePageNumber(bookInfo);
    expect(pageNumber).toEqual("");
  });
});
