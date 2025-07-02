const papa = require("papaparse");

const unparse = (data) => {
  return papa.unparse(data);
};

module.exports = { unparse };
