const fs = require("fs");

function createOutputDirIfNotExists(outPath) {
  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath);
  }
}

/*
 * Replaces white space with _ and removes
 * any special characters
 * @param {string} bookTitle - the title of the book
 **/
function sanitiseString(bookTitle) {
  if (!bookTitle) {
    return "unknown";
  }
  return bookTitle.replace(/ /g, "_").replace(/[^a-zA-Z0-9_]/g, "");
}

function findFileInDirectory(directory, searchQuery) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (file.includes(searchQuery)) {
      return file;
    }
  }
  return null;
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

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\..+/, "")
      .replace(/T/, "");

    const existingFile = findFileInDirectory(outPath, `${bookAndAuthor}`);
    let orgFileName;
    if (existingFile) {
      console.log(`Found existing file: ${existingFile}`);
      orgFileName = existingFile;
    } else {
      orgFileName = `${outPath}/${timestamp}-${bookAndAuthor}.org`;
    }

    const file = fs.createWriteStream(orgFileName, {
      flags: "a",
    });

    const originalContent = fs.existsSync(orgFileName)
      ? fs.writeFileSync(orgFileName, "")
      : "";

    // this should only write if the file doesn't exist
    if (!originalContent) {
      file.write(`:PROPERTIES:\n`);
      file.write(`:ID: ${books[book].id}\n`);
      file.write(`:END:\n`);
      file.write(
        `#+TITLE: ${book} - ${books[book].author.surname}, ${books[book].author.firstName}\n\n`
      );
    }

    books[book].highlights.forEach((highlight) => {
      const headline = highlight.content.split(" ").slice(0, 5).join(" ");

      if (originalContent && originalContent.includes(`:ID: ${id}`)) {
        return;
      }

      file.write(`* ${headline}\n`);
      file.write(`:PROPERTIES:\n`);
      file.write(`:PAGE: ${highlight.page}\n`);
      file.write(`:LOCATION: ${highlight.location}\n`);
      file.write(`:ID: ${highlight.id}\n`);
      file.write(`:DATE: ${highlight.date}\n`);
      file.write(`:END:\n\n`);
      file.write("#+BEGIN_QUOTE\n");
      file.write(`${highlight.content}\n`);
      file.write("#+END_QUOTE\n\n");
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
