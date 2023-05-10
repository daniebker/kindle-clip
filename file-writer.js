const fs = require("fs");
const handlebars = require("handlebars");
const { registerHelpers } = require("./infrastructure/handlebars/formatting")
const { generateTitleFor, generateTagsFor } = require("./infrastructure/clients/openai");

const {
  createOutputDirIfNotExists,
  findFileInDirectory,
} = require("./utils/dir");

registerHelpers(handlebars)

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
async function writeFile(books, outPath, templateName, aiEnabled) {
  createOutputDirIfNotExists(outPath);

  for (const book in books) {
    const bookAndAuthor = `${sanitiseString(
      books[book].author.surname
    )}_${sanitiseString(books[book].author.firstName)}_${sanitiseString(book)}`;

    const existingFile = findFileInDirectory(outPath, `${bookAndAuthor}`);

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

    const preparedHighlightsPromises = books[book].highlights
      .filter(highlight => !existingContent.includes(`${highlight.id}`))
      .map(async (highlight) => {
        let headline = "";
        let tags = "";
        if (aiEnabled) {
          headlinePromise = generateTitleFor(highlight.content);
          tagsPromise = generateTagsFor(highlight.content);
          [headline, tags] = await Promise.all([headlinePromise, tagsPromise])
          console.log(tags)
        } else {
          headline = highlight.content.split(" ").slice(0, 5).join(" ");
        }

        return { headline, tags, ...highlight };
      });

    const preparedHighlights = await Promise.all(preparedHighlightsPromises)

    const rawTemplate = fs.readFileSync(`./templates/${templateName}/content.hbs`, 'utf-8')
    const template = handlebars.compile(rawTemplate, { noEscape: true })

    file.write(template(preparedHighlights))
    //TODO: Use chatGPT give the context of all notes to create a summary of the book
    file.end();
  };
}

module.exports = { writeFile };
