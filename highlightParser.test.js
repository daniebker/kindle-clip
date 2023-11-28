const fs = require("fs");
const { parseFile } = require("./highlightParser");

const givenAHighlight = (highlight) => {
  jest.spyOn(fs, "readFileSync").mockImplementation(() => highlight);
  return { highlight };
};

describe("highlightParser for txt", () => {
  it("should skip bookmarks", async () => {
    givenAHighlight(`Life Time (Foster, Russell)
- Your Bookmark on page 98 | location 2052-2052 | Added on Tuesday, 28 March 2023 13:43:14`);
    const parsedHighlight = await parseFile("~/some/path");
    expect(parsedHighlight).toEqual([]);
  });

  it("should extract a note and associate it with a highlight", async () => {
    givenAHighlight(`Life Time (Foster, Russell)
- Your Highlight on page 98 | location 2052-2052 | Added on Tuesday, 28 March 2023 13:43:14

Roger Ekirch and detailed in his book At Day’s Close.
==========\r\n
Life Time (Foster, Russell)
- Your Note on page 98 | location 2052 | Added on Tuesday, 28 March 2023 13:43:23

Check this out`);

    const parsedHighlight = await parseFile("~/some/path/to/file.txt");

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

  it("should skip empty clippings", async () => {
    givenAHighlight(`==========\r\n`);

    const parsedHighlight = await parseFile("~/some/path/to/file.txt");

    expect(parsedHighlight).toEqual([]);
  });
});

describe("highlightParser for html", () => {
  it("should extract a book title", async () => {
    // const current working directory is the root of the project
    const workingDirectory = process.cwd();
    const parsedHighlight = await parseFile(
      `${workingDirectory}/fixtures/daily_stoic.html`
    );
    expect(parsedHighlight).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title:
            "The Daily Stoic: 366 Meditations on Wisdom, Perseverance, and the Art of Living: Featuring new translations of Seneca, Epictetus, and Marcus Aurelius",
        }),
      ])
    );
  });

  it("should extract a book author", async () => {
    const workingDirectory = process.cwd();
    const parsedHighlight = await parseFile(
      `${workingDirectory}/fixtures/daily_stoic.html`
    );
    expect(parsedHighlight).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: expect.objectContaining({
            firstName: "Ryan",
            surname: "Holiday",
          }),
        }),
      ])
    );
  });
});
