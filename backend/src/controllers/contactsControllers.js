const expressAsyncHandler = require("express-async-handler");
const tables = require("../tables");

const browse = expressAsyncHandler(async (req, res, next) => {
  const [rows] = await tables.contacts.findAll();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const readById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const [rows] = await tables.contacts.findById(id);
  if (rows) {
    res.status(200).send(rows);
  } else {
    res.sendStatus(400);
  }
});

module.exports = { browse, readById };
