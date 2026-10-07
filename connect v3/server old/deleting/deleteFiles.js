const fs = require('fs');
const path = require('path');

const deleteFiles = (filePaths = []) => {
  filePaths.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Failed to delete file ${filePath}:`, err.message);
      } else {
        console.log(`Deleted file: ${filePath}`);
      }
    });
  });
};

module.exports = deleteFiles;
