const { readFile } = require("fs").promises;
const path = require("path");

/**
 * Reads a JSON file from the file system and returns its contents as a JavaScript object.
 *
 * @async
 * @function readJsonFile
 * @param {string} completePath - The complete path to the JSON file. If not provided, the function will look for the file in the specified folder.
 * @param {string} fileFolderPath - The relative path to the folder containing the JSON file.
 * @param {string} fileName - The name of the JSON file (without extension).
 * @returns {Promise<Object|Error>} Returns the JSON object if the file was read successfully, or the error object if an error occurred.
 */
const readJsonFile = async (completePath, fileFolderPath, fileName) => {
  try {
    const filePath =
      completePath ||
      path.join(__dirname, `${fileFolderPath}/${fileName}.json`);
    const data = await readFile(filePath);
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading JSON file: ${err.message}`);
    return err;
  }
};

module.exports = readJsonFile;
