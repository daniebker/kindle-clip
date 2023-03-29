const fs = require("fs");
const { groupByBook } = require("./utils/groupByBook");

function createOutputDirIfNotExists() {
  if (!fs.existsSync(`${__dirname}/output`)) {
    fs.mkdirSync(`${__dirname}/output`);
  }
}

/*
 * It should write the highlights to an org file format
 * @param {array} highlights - the highlights to write
 **/
function writeFile(highlights) {
  const books = groupByBook(highlights);

  createOutputDirIfNotExists();

  Object.keys(books).forEach((book) => {
    const orgFileName = `${__dirname}/output/${books[book].author.surname}-${books[book].author.firstName}_${book}.org`;
    const file = fs.createWriteStream(orgFileName, {
      flags: "a",
    });

    const originalContent = fs.existsSync(orgFileName)
      ? fs.writeFileSync(orgFileName, "")
      : "";

    books[book].highlights.forEach((highlight) => {
      const headline = highlight.content.split(" ").slice(0, 5).join(" ");

      if (
        originalContent &&
        originalContent.includes(`:KINDLE_HIGHLIGHT_ID: ${id}`)
      ) {
        return;
      }

      file.write(`* ${headline}\n`);
      file.write(`:PROPERTIES:\n`);
      file.write(`:PAGE: ${highlight.page}\n`);
      file.write(`:LOCATION: ${highlight.location}\n`);
      file.write(`:KINDLE_HIGHLIGHT_ID: ${highlight.id}\n`);
      file.write(`:DATE: ${highlight.date}\n`);
      file.write(`:END:\n\n`);
      file.write("#+BEGIN_QUOTE\n");
      file.write(`${highlight.content}\n`);
      file.write("#+END_QUOTE\n");
      if (highlight.note) {
        file.write(`** Note\n`);
        file.write(`:PROPERTIES:\n`);
        file.write(`:DATE: ${highlight.note.date}\n`);
        file.write(`:END:\n\n`);
        file.write(`${highlight.note.content}\n`);
      }
      file.write(`\n`);
    });
    file.end();
  });
}

module.exports = { writeFile };
