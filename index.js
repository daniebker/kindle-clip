const { parseFile } = require("./highlightParser");
const { writeFile } = require("./file-writer");
const { groupByBook } = require("./utils/groupByBook");
const inquirer = require("inquirer");

async function main() {
  const filePath = process.argv[2];
  const outPath = process.argv[3];
  const template = process.argv[4];
  const aiEnabled = process.argv[5] || false;
  const highlights = await parseFile(filePath);

  const groupedHighlights = groupByBook(highlights);
  const books = Object.keys(groupedHighlights);

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'books',
      message: 'Which book do you want to import highlights from?',
      choices: books,
    },
  ])

  // Create a new object by filtering the keys from the original object
  const filteredObject = Object.keys(groupedHighlights).reduce((acc, key) => {
    if (answers.books.includes(key)) {
      acc[key] = groupedHighlights[key];
    }
    return acc;
  }, {});

  await writeFile(filteredObject, outPath, template, aiEnabled)
}

main()
