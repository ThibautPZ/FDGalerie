const path = require("node:path");
const fs = require("node:fs");
const sharp = require("sharp");
const async = require("async");
const asyncHandler = require("express-async-handler");

const CustomErrorClass = require("../services/ErrorClasses");
const {
  giveSuccesfulAndFailedQueryNames,
} = require("../helpers/dbAsyncQueriesHelper");
const { isError } = require("../services/typesAndValidationChecks");

const thumbSizes = {
  medium: { pixelNum: 300, nameExtension: "md" },
  large: { pixelNum: 1024, nameExtension: "lg" },
};

const createThumbnail = (rawFileFolderName, options) => {
  return asyncHandler(async (req, res, next) => {
    const { rawFileName, rawFileExtension } = req.body;
    const { medium = false, large = false } = options;
    const filesFieldsQuery = req.query.fileFields;

    if (filesFieldsQuery === "none") {
      return next();
    }
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
        return err;
      }
      return true;
    };
    const retryableWriteThumbnail = async.retryable(5, writeThumbnail);

    const deleteThumbnail = async (size) => {
      const { nameExtension } = thumbSizes[size];
      const thumbFilePath = path.join(
        __dirname,
        `../../public/${rawFileFolderName}Thumb_${nameExtension}/${rawFileName}_${nameExtension}${thumbFileExtension}`
      );
      try {
        fs.unlinkSync(thumbFilePath);
      } catch (error) {
        return error;
      }
      return true;
    };

    if (medium && !large) {
      const result = await retryableWriteThumbnail("medium");
      if (isError(result)) {
        return next(result);
      }
      return next();
    }

    if (large && !medium) {
      const result = await retryableWriteThumbnail("large");
      if (isError(result)) {
        return next(result);
      }
      return next();
    }

    const filesResults = await async.parallel({
      medium: async.retryable(5, async () => writeThumbnail("medium")),
      large: async.retryable(5, async () => writeThumbnail("large")),
    });

    const { success, failures } = giveSuccesfulAndFailedQueryNames(
      filesResults,
      true,
      false
    );

    if (failures.length) {
      const deletion = async.retryable(5, deleteThumbnail);
      const result = await deletion(success[0]);
      if (isError(result)) {
        return next(new CustomErrorClass("03001", result));
      }
      return next(filesResults[failures[0]]);
    }

    return next();
  });
};

module.exports = createThumbnail;
