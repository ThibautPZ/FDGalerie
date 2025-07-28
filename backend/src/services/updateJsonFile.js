const { readFile, writeFile } = require("fs").promises;
const path = require("path");

/**
 * Updates a JSON file by adding or removing a key-value pair.
 *
 * @async
 * @function updateJsonFile
 * @param {"add"|"remove"} operation - The operation to perform: "add" to insert or update a key, "remove" to delete a key.
 * @param {string} fileFolderPath - The relative path to the folder containing the JSON file.
 * @param {string} fileName - The name of the JSON file (without extension).
 * @param {string} key - The key to add or remove in the JSON object.
 * @param {{name: string, description: [string]}} value - The value to set for the key (used only when operation is "add").
 * @returns {Promise<boolean|Error>} Returns true if the operation was successful, or the error object if an error occurred.
 */
const updateJsonFile = async (
  operation,
  fileFolderPath,
  fileName,
  key,
  value
) => {
  try {
    const filePath = path.join(__dirname, `${fileFolderPath}/${fileName}.json`);
    const data = await readFile(filePath);
    const jsonData = JSON.parse(data);
    if (operation === "add") {
      if (!value) {
        throw new Error("Value must be provided for 'add' operation");
      }
      jsonData[key] = value;
    }
    if (operation === "remove") {
      delete jsonData[key];
    }
    await writeFile(filePath, JSON.stringify(jsonData, null, 2));

    return true;
  } catch (err) {
    console.error(`Error updating JSON file: ${err.message}`);
    return err;
  }
};

module.exports = updateJsonFile;
