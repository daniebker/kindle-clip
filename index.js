const { parseFile } = require("./highlightParser");
const { writeFile } = require("./file-writer");
const { groupByBook } = require("./utils/groupByBook");

async function main() {
  const filePath = process.argv[2];
  const outPath = process.argv[3];
  const template = process.argv[4];
  const aiEnabled = process.argv[5] || false;
  const highlights = parseFile(filePath);

  const groupedHighlights = groupByBook(highlights);

  console.log(`aiEnabled: `, aiEnabled)

  await writeFile(groupedHighlights, outPath, template, aiEnabled)
}

main()
