const crypto = require("crypto");

function createBookId(highlight) {
  const bookAndAuthor = `${highlight.author.firstName} ${highlight.author.surname} ${highlight.title}`;
  const bookId = crypto.createHash("sha1").update(bookAndAuthor).digest("hex");
  return bookId;
}

function groupByBook(highlights) {
  const books = {};
  highlights.forEach((highlight) => {
    if (!books[highlight.title]) {
      const bookId = createBookId(highlight);

      books[highlight.title] = {
        highlights: [],
        author: highlight.author,
        id: bookId,
      };
    }

    // only push if highlights doesnt include a highlight with this id
    if (
      books[highlight.title].highlights.filter(
        (existingHighlight) => existingHighlight.id === highlight.id
      ).length === 0
    ) {
      books[highlight.title].highlights.push(highlight);
    }
  });
  return books;
}

module.exports = { groupByBook };
