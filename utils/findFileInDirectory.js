const fs = require("fs");

function findFileInDirectory(directory, searchQuery) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (file.includes(searchQuery)) {
      return file;
    }
  }
  return null;
}
exports.findFileInDirectory = findFileInDirectory;
