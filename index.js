const { parseFile } = require("./highlightParser");
const { writeFile } = require("./org-writer");

const filePath = process.argv[2];
console.log(filePath);
const highlights = parseFile(filePath);

writeFile(highlights);
