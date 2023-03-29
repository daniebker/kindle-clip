const crypto = require("crypto");
const fs = require("fs");
const { parsePageNumber } = require("./utils/parsePageNumber");

/*
 * Parse the title line and extracts the author and title
 * @param {string} titleLine - the title line
 * @returns {object} - the parsed title line
 * @example
 * parseTitle('Life Time (Foster, Russell)')
 **/
const parseTitle = (titleLine) => {
  const titleMatch = titleLine.match(/(.*) \((.*), (.*)\)/);
  const surname = titleMatch ? titleMatch[2].trim() : undefined;
  const firstName = titleMatch ? titleMatch[3].trim() : undefined;
  const author = { firstName, surname };
  const bookTitle = titleMatch ? titleMatch[1].trim() : undefined;
  if (!author) {
    console.log(bookTitle);
  }
  return { author, bookTitle };
};

/*
 * Parses the info line and extraces the date
 * @param {string} infoLine - the info line
 * @returns {string} - the date
 * @example
 * parseDate('- Your Highlight on page 98 | location 2052-2052 | Added on Tuesday, 28 March 2023 13:43:14  ')
 **/
const parseDate = (infoLine) => {
  const dateMatch = infoLine.match(/Added on (.*)/);
  return dateMatch ? dateMatch[1].trim() : "";
};

/*
 * Parse the info line and extracts the page number, location and date
 * @param {string} infoLine - the info line
 * @returns {object} - the parsed info line
 **/
function parseInfo(lines) {
  const info = lines[1].trim();
  const location = parseLocation(info);
  const date = parseDate(info);
  const page = parsePageNumber(info);
  return { page, location, date };
}

/*
 * Parse the location from the info string
 * @param {string} info - the info string
 * @returns {number} - the location
 **/
function parseLocation(info) {
  const locationMatch = info.match(/location ([0-9]+)-([0-9]+)/);
  return locationMatch ? +locationMatch[1] : "";
}

/*
 * Parse the file and extract the highlights
 * @param {string} file - the file to parse
 * @returns {array} - the parsed highlights
 * @example
 * parseFile('~/Documents/My Clippings.txt')
 **/
const parseFile = (file) => {
  const fileContents = fs.readFileSync(file, "utf8");
  const highlights = [];
  const clippings = fileContents.split(`==========\r\n`);
  clippings.forEach((clipping) => {
    if (clipping.trim().length === 0) return;
    const parsedHighlight = highlightParser(clipping);
    if (parsedHighlight.type === "Bookmark") return;

    if (parsedHighlight.type === "Highlight") {
      highlights.push(parsedHighlight);
    } else {
      highlights[highlights.length - 1].note = {
        content: parsedHighlight.content,
        date: parsedHighlight.date,
      };
    }
  });

  return highlights;
};

const highlightParser = (clipping) => {
  const lines = clipping.trim().split("\n");

  try {
    const type = lines[1].trim().match(/Your (Highlight|Note|Bookmark)/)[1];
    const { page, location, date } = parseInfo(lines);
    const { author, bookTitle } = parseTitle(lines[0]);
    const content = lines.slice(2).join("\n").trim();
    const id = crypto.createHash("sha1").update(content).digest("hex");

    return {
      id,
      author,
      title: bookTitle,
      page,
      location,
      content,
      date,
      type,
    };
  } catch (e) {
    console.log(e);
    console.log(lines);
  }
};

module.exports = { parseFile };
