const asyncHandler = require("express-async-handler");
const tables = require("../tables");

const browse = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.painting_sizes.readAll();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

module.exports = {
  browse,
};
