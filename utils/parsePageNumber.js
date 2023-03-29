/*
 * Parse the page number from the book info string
 * @param {string} bookInfo - the book info string
 * @returns {number} - the page number
 * @example
 * parsePageNumber('- Your Highlight on page 98 | location 2052-2052 | Added on Tuesday, 28 March 2023 13:43:14  ')
 **/
function parsePageNumber(bookInfo) {
  const pageNumberMatch = bookInfo.match(/page ([0-9]+)/);
  return pageNumberMatch ? +pageNumberMatch[1] : "";
}

module.exports = { parsePageNumber };
