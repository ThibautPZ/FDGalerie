const path = require("node:path");
const fs = require("node:fs");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const CustomErrorClass = require("../services/ErrorClasses");

const thumbSizes = {
  medium: { pixelNum: 300, nameExtension: "md" },
  large: { pixelNum: 1024, nameExtension: "lg" },
};

const createThumbnail = (rawFileFolderName, options) => {
  return asyncHandler(async (req, res, next) => {
    const { rawFileName, rawFileExtension } = req.body;
    const { medium = false, large = false } = options;
    const thumbFileExtension = ".jpg";

    const rawFilePath = path.join(
      __dirname,
      `../../public/${rawFileFolderName}/${rawFileName}.${rawFileExtension}`
    );

    const sharpImage = sharp(rawFilePath);

    const writeThumbnail = async (size) => {
      const { pixelNum, nameExtension } = thumbSizes[size];
      const thumbFilePath = path.join(
        __dirname,
        `../../public/${rawFileFolderName}Thumb_${nameExtension}/${rawFileName}_${nameExtension}${thumbFileExtension}`
      );
      try {
        const buffer = await sharpImage
          .jpeg()
          .resize(pixelNum, pixelNum, { fit: "inside", position: "centre" })
          .toBuffer();
        fs.writeFileSync(thumbFilePath, buffer);
      } catch (error) {
        const err = new CustomErrorClass("03001", error);
        return next(err);
      }
      return true;
    };

    if (medium) {
      writeThumbnail("medium");
    }

    if (large) {
      writeThumbnail("large");
    }

    return next();
  });
};

module.exports = createThumbnail;
