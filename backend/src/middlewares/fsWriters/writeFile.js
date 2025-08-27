const path = require("node:path");
const fs = require("node:fs/promises");
const { nanoid } = require("nanoid");
const async = require("async");
const expressAsyncHandler = require("express-async-handler");

const { isError } = require("../../services/typesAndValidationChecks");
const CustomErrorClass = require("../../services/ErrorClasses");

const writeFile = (folderName) => {
  return expressAsyncHandler(async (req, res, next) => {
    const { file = null, query } = req;

    if (query.fileFields === "none") {
      return next();
    }

    const { extension, buffer } = file;
    const savedFileName = nanoid(16);

    if (!extension) {
      return next(new CustomErrorClass("01000"));
    }
    const writeFileFunc = async () => {
      const filePath = path.join(
        __dirname,
        `../../../public/${folderName}/${savedFileName}.${extension}`
      );
      try {
        await fs.writeFile(filePath, buffer);
      } catch (error) {
        const err = new CustomErrorClass("03002", error);
        return err;
      }
      return true;
    };

    const retryableWriteFile = async.retryable(5, writeFileFunc);

    const result = await retryableWriteFile();
    if (isError(result)) {
      delete req.body.file;
      return next(result);
    }
    req.body.rawFileName = savedFileName;
    req.body.rawFileExtension = extension;
    delete req.body.file;
    return next();
  });
};
module.exports = writeFile;
