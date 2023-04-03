const fs = require("fs");
const {
  createOutputDirIfNotExists,
  findFileInDirectory,
} = require("./utils/dir");
const { sanitiseString } = require("./utils/sanitiseString");

function writeNote(file, note) {
  file.write(`** Note :kindle:\n`);
  file.write(`:PROPERTIES:\n`);
  file.write(`:DATE: ${note.date}\n`);
  file.write(`:END:\n\n`);
  file.write(`${note.content}\n`);
}

function writeHighlight(file, headline, highlight) {
  file.write(`* ${headline} :kindle:quote: \n`);
  file.write(`:PROPERTIES:\n`);
  file.write(`:PAGE: ${highlight.page}\n`);
  file.write(`:LOCATION: ${highlight.location}\n`);
  file.write(`:ID: ${highlight.id}\n`);
  file.write(`:DATE: ${highlight.date}\n`);
  file.write(`:END:\n\n`);
  file.write("#+BEGIN_QUOTE\n");
  file.write(`${highlight.content}\n`);
  file.write("#+END_QUOTE\n\n");
}

function writeFileHeader(file, bookId, title) {
  file.write(`:PROPERTIES:\n`);
  file.write(`:ID: ${bookId}\n`);
  file.write(`:END:\n`);
  file.write(`#+TITLE: ${title}`);
}

function generateFileName(outPath, bookAndAuthor) {
  console.log(outPath);
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "")
    .replace(/T/, "");
  return `${outPath}/${timestamp}-${bookAndAuthor}.org`;
}

/*
 * It should write the highlights to an org file format
 * @param {array} highlights - the highlights to write
 **/
function writeFile(books, outPath) {
  createOutputDirIfNotExists(outPath);

  Object.keys(books).forEach((book) => {
    const bookAndAuthor = `${sanitiseString(
      books[book].author.surname
    )}_${sanitiseString(books[book].author.firstName)}_${sanitiseString(book)}`;

    const existingFile = findFileInDirectory(outPath, `${bookAndAuthor}`);

    const orgFileName = existingFile
      ? existingFile
      : generateFileName(outPath, bookAndAuthor);

    const file = fs.createWriteStream(orgFileName, {
      flags: "a",
    });

    const existingContent = existingFile
      ? fs.readFileSync(`${outPath}/${orgFileName}`, "utf-8")
      : "";

    if (!existingContent) {
      const fileTitle = `${book} - ${books[book].author.surname}, ${books[book].author.firstName}\n\n`;
      writeFileHeader(file, books[book].id, fileTitle);
    }

    books[book].highlights.forEach((highlight) => {
      const headline = highlight.content.split(" ").slice(0, 5).join(" ");

      if (existingContent && existingContent.includes(`:ID: ${highlight.id}`)) {
        return;
      }

      writeHighlight(file, headline, highlight);
      if (highlight.note) {
        writeNote(file, highlight.note);
      }
      file.write(`\n`);
    });
    file.end();
  });
}

module.exports = { writeFile };
