const expressAsyncHandler = require("express-async-handler");
const async = require("async");

const tables = require("../tables");
const CustomErrorClass = require("../services/ErrorClasses");

const browse = expressAsyncHandler(async (req, res, next) => {
  const [rows] = await tables.contacts.findAll();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const browseWithPaintingsOwningCount = expressAsyncHandler(
  async (req, res, next) => {
    const [rows] = await tables.contacts.findAllWithPaintingsOwnershipCount();
    if (rows) {
      res.status(200).json({ success: true, queryResults: rows });
    } else {
      const error = new CustomErrorClass("07002");
      next(error);
    }
  }
);

const readById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const results = await async.parallel({
    contactInfo: async () => {
      const [rows] = await tables.contacts.findById(id);
      return rows[0];
    },
    giftedPaintings: async () => {
      const [rows] = await tables.paintingGifts.findAllGiftsByContactId(id);
      return rows;
    },
    soldPaintings: async () => {
      const [rows] = await tables.paintingSales.findAllSalesByContactId(id);
      return rows;
    },
    reservedPaintings: async () => {
      const [rows] =
        await tables.paintingReservations.findAllReservationsByContactId(id);
      return rows;
    },
  });

  if (results) {
    res.status(200).json({
      success: true,
      queryResults: results,
    });
  } else {
    const error = new CustomErrorClass("07001");
    next(error);
  }
});

module.exports = { browse, browseWithPaintingsOwningCount, readById };
