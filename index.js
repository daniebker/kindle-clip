const { parseFile } = require("./highlightParser");
const { writeFile } = require("./file-writer");
const { groupByBook } = require("./utils/groupByBook");

const filePath = process.argv[2];
const outPath = process.argv[3];
const template = process.argv[4];
const highlights = parseFile(filePath);

const groupedHighlights = groupByBook(highlights);

writeFile(groupedHighlights, outPath, template)
