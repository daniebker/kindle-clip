const { writeFile } = require("./file-writer");
const fs = require("fs");

jest.mock("./utils/dir", () => ({
  findFileInDirectory: jest.fn(),
  createOutputDirIfNotExists: jest.fn(),
}));

jest.spyOn(fs, "createWriteStream").mockImplementation(() => {
  return { write: jest.fn(), end: jest.fn() };
});

// Serve the real templates from disk; anything else (an existing output
// file) is treated as empty.
const realReadFileSync = fs.readFileSync;
jest.spyOn(fs, "readFileSync").mockImplementation((path, ...args) => {
  if (String(path).startsWith("./templates/")) {
    return realReadFileSync(path, ...args);
  }
  return "";
});
const dir = require("./utils/dir");

beforeEach(() => {
  jest.clearAllMocks();
});

const givenABookWithHighlights = () => {
  return {
    "The Book of Why": {
      id: "123",
      author: { firstName: "some-first-name", surname: "some-surname" },
      highlights: [],
    },
  };
};

describe("file-writer", () => {
  describe("writeFile", () => {
    it("should create dir if non exists", async () => {
      const groupedHighlights = givenABookWithHighlights();

      await writeFile(groupedHighlights, "/some/path", "org-roam");

      expect(dir.createOutputDirIfNotExists).toHaveBeenCalledWith("/some/path");
    });

    it("should write to file", async () => {
      const groupedHighlights = givenABookWithHighlights();

      await writeFile(groupedHighlights, "~/some/path", "org-roam");

      expect(fs.createWriteStream).toHaveBeenCalledWith(
        expect.stringContaining(
          "somesurname_somefirstname_The_Book_of_Why.org"
        ),
        expect.objectContaining({ flags: "a" })
      );
    });

    it("should append to an existing file when one exists", async () => {
      const groupedHighlights = givenABookWithHighlights();

      dir.findFileInDirectory.mockReturnValueOnce(
        "1231231231_somesurname_somefirstname_The_Book_of_Why.org"
      );

      await writeFile(groupedHighlights, "~/some/path", "org-roam");

      expect(fs.readFileSync).toHaveBeenCalledWith(
        "~/some/path/1231231231_somesurname_somefirstname_The_Book_of_Why.org",
        "utf-8"
      );
    });
  });
});
