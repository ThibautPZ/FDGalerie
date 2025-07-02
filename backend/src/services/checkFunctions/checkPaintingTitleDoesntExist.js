const tables = require("../../tables");
const CustomErrorClass = require("../ErrorClasses");

const checkPaintingTitleDoesntExist = async (req) => {
  const paintingTitle = req.body.oeuvreTitle;
  const [result] = await tables.paintings.findByTitle(paintingTitle);

  if (result.length) {
    const takenPaintingTitleErr = new CustomErrorClass("00100");
    return takenPaintingTitleErr;
  }
  return null;
};

module.exports = checkPaintingTitleDoesntExist;
