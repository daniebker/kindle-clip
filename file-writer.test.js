const { writeFile } = require("./org-writer");
const fs = require("fs");

jest.mock("./utils/dir", () => ({
  findFileInDirectory: jest.fn(),
  createOutputDirIfNotExists: jest.fn(),
}));

jest.spyOn(fs, "createWriteStream").mockImplementation(() => {
  return { write: jest.fn(), end: jest.fn() };
});

jest.spyOn(fs, "readFileSync").mockImplementation(() => {});
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

describe("org-writer", () => {
  describe("writeFile", () => {
    it("should create dir if non exists", () => {
      const groupedHighlights = givenABookWithHighlights();

      writeFile(groupedHighlights, "/some/path");

      expect(dir.createOutputDirIfNotExists).toHaveBeenCalledWith("/some/path");
    });

    it("should write to file", () => {
      const groupedHighlights = givenABookWithHighlights();

      writeFile(groupedHighlights, "~/some/path");

      expect(fs.createWriteStream).toHaveBeenCalledWith(
        expect.stringContaining(
          "somesurname_somefirstname_The_Book_of_Why.org"
        ),
        expect.objectContaining({ flags: "a" })
      );
    });

    it("should append to an existing file when one exists", () => {
      const groupedHighlights = givenABookWithHighlights();

      dir.findFileInDirectory.mockReturnValueOnce(
        "1231231231_somesurname_somefirstname_The_Book_of_Why.org"
      );

      writeFile(groupedHighlights, "~/some/path");

      expect(fs.readFileSync).toHaveBeenCalledWith(
        "~/some/path/1231231231_somesurname_somefirstname_The_Book_of_Why.org",
        "utf-8"
      );
    });
  });
});
