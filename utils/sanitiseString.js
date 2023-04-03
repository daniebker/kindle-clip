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
exports.sanitiseString = sanitiseString;
