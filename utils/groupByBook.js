function groupByBook(highlights) {
  const books = {};
  highlights.forEach((highlight) => {
    if (!books[highlight.title]) {
      books[highlight.title] = { highlights: [], author: highlight.author };
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
