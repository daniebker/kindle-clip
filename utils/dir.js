const fs = require("fs");

function createOutputDirIfNotExists(outPath) {
  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath);
  }
}

function findFileInDirectory(directory, searchQuery) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (file.includes(searchQuery)) {
      return file;
    }
  }
  return null;
}

module.exports = { findFileInDirectory, createOutputDirIfNotExists };
