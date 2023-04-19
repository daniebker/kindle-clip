const fs = require("fs");
const handlebars = require("handlebars");

const {
  createOutputDirIfNotExists,
  findFileInDirectory,
} = require("./utils/dir");
const { sanitiseString } = require("./utils/sanitiseString");

function writeFileHeader(file, bookId, title, templateName) {
  const rawTemplate = fs.readFileSync(`./templates/${templateName}/header.hbs`, 'utf-8')
  const template = handlebars.compile(rawTemplate, { noEscape: true })
  file.write(template({ bookId, title }))
}

function generateFileName(bookAndAuthor, format) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "")
    .replace(/T/, "");
  return `${timestamp}-${bookAndAuthor}.${format}`;
}

/*
 * It should write the highlights to an org file format
 * @param {array} highlights - the highlights to write
 **/
function writeFile(books, outPath, templateName) {
  createOutputDirIfNotExists(outPath);

  Object.keys(books).forEach((book) => {
    const bookAndAuthor = `${sanitiseString(
      books[book].author.surname
    )}_${sanitiseString(books[book].author.firstName)}_${sanitiseString(book)}`;

    const existingFile = findFileInDirectory(outPath, `${bookAndAuthor}`);

    // read config from template dir
    const formatConfig = JSON.parse(fs.readFileSync(`./templates/${templateName}/config.json`, 'utf-8'))

    const fileName = existingFile
      ? existingFile
      : generateFileName(bookAndAuthor, formatConfig.format);

    const file = fs.createWriteStream(`${outPath}/${fileName}`, {
      flags: "a",
    });

    const existingContent = existingFile
      ? fs.readFileSync(`${outPath}/${fileName}`, "utf-8")
      : "";

    if (!existingContent) {
      const fileTitle = `${book} - ${books[book].author.surname}, ${books[book].author.firstName}\n\n`;
      writeFileHeader(file, books[book].id, fileTitle, templateName);
    }

    const preparedHighlights = books[book].highlights
      .filter(highlight => !existingContent.includes(`${highlight.id}`))
      .map((highlight) => {
        const headline = highlight.content.split(" ").slice(0, 5).join(" ");
        // TODO: use chatgpt to create a headline from the content

        return { headline, ...highlight };
      });

    const rawTemplate = fs.readFileSync(`./templates/${templateName}/content.hbs`, 'utf-8')
    const template = handlebars.compile(rawTemplate, { noEscape: true })

    file.write(template(preparedHighlights))
    //TODO: Use chatGPT give the context of all notes to create a summary of the book
    file.end();
  });
}

module.exports = { writeFile };