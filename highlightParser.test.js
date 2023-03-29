const fs = require("fs");
const { parseFile } = require("./highlightParser");

const givenAHighlight = (highlight) => {
  jest.spyOn(fs, "readFileSync").mockImplementation(() => highlight);
  return { highlight };
};

describe("highlightParser", () => {
  it("should skip bookmarks", () => {
    const { highlight } = givenAHighlight(`Life Time (Foster, Russell)
- Your Bookmark on page 98 | location 2052-2052 | Added on Tuesday, 28 March 2023 13:43:14`);
    const parsedHighlight = parseFile("~/some/path");
    expect(parsedHighlight).toEqual([]);
  });

  it("should extract a note and associate it with a highlight", () => {
    const { highlight } = givenAHighlight(`Life Time (Foster, Russell)
- Your Highlight on page 98 | location 2052-2052 | Added on Tuesday, 28 March 2023 13:43:14

Roger Ekirch and detailed in his book At Day’s Close.
==========\r\n
Life Time (Foster, Russell)
- Your Note on page 98 | location 2052 | Added on Tuesday, 28 March 2023 13:43:23

Check this out`);

    const parsedHighlight = parseFile("~/some/path");

    expect(parsedHighlight).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          note: {
            content: "Check this out",
            date: "Tuesday, 28 March 2023 13:43:23",
          },
        }),
      ])
    );
  });

  it("should skip empty clippings", () => {
    const { highlight } = givenAHighlight(`==========\r\n`);

    const parsedHighlight = parseFile("~/some/path");

    expect(parsedHighlight).toEqual([]);
  });
});
