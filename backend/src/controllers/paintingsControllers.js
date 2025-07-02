const asyncHandler = require("express-async-handler");
const tables = require("../tables");
const CustomErrorClass = require("../services/ErrorClasses");

const browse = async (req, res, next) => {
  try {
    const [rows] = await tables.paintings.readAll();
    if (rows) {
      res.send(rows);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const readAllSizes = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.paintings.readAssociatedSizes();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const readAllTechniques = asyncHandler(async (req, res, next) => {
  const [rows] = await tables.paintings.readAssociatedTechniques();
  if (rows) {
    res.send(rows);
  } else {
    res.sendStatus(400);
  }
});

const readByTechnique = asyncHandler(async (req, res, next) => {
  const technique = req.params.id;

  const [result] = await tables.paintings.readPaintingByTech(technique);
  if (result) {
    res.send(result);
  } else {
    res.sendStatus(400);
  }
});

const readByFormat = asyncHandler(async (req, res, next) => {
  const format = req.params.id;

  const [result] = await tables.paintings.readPaintingBySize(format);
  if (result) {
    res.send(result);
  } else {
    res.sendStatus(400);
  }
});

const readByTitle = asyncHandler(async (req, res, next) => {
  const title = req.params.id;

  const [result] = await tables.paintings.readByTitle(title);
  if (result) {
    const paintingId = await result[0].id;
    const [rows] = await tables.techniques.readByPaintingId(paintingId);
    result[0].techniques = await rows;
    if (result.family !== null) {
      const [sisters] = await tables.paintings.findAllFamilyMembers(
        result[0].familyId,
        result[0].id
      );
      result[0].sisters = await sisters;
    }

    res.send(result);
  } else {
    res.sendStatus(400);
  }
});

const browseWithDetails = asyncHandler(async (req, res, next) => {
  const [result] = await tables.paintings.readWithDetails();
  if (!result) {
    return next(new CustomErrorClass("00001"));
  }
  return res.status(200).json(result);
});

const createPainting = asyncHandler(async (req, res, next) => {
  const a = await 10;
  return res.status(210).json(a.toString());
});

module.exports = {
  browse,
  readAllSizes,
  readAllTechniques,
  readByTechnique,
  readByFormat,
  readByTitle,
  browseWithDetails,
  createPainting,
};
