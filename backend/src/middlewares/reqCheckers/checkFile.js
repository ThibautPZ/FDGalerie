const { filetypemime } = require("magic-bytes.js");
const expressAsyncHandler = require("express-async-handler");

const { isString } = require("../../services/typesAndValidationChecks");
const CustomErrorClass = require("../../services/ErrorClasses");

const IMAGE_MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

const VIDEO_MIME_TYPE = {
  "video/mp4": "mp4",
  "video/MOV": "MOV",
  "video/AVI": "AVI",
  "video/WMF": "WMF",
};

const giveExpectedMimeTypes = (fileType) => {
  if (fileType === "image") {
    return IMAGE_MIME_TYPE;
  }
  if (fileType === "video") {
    return VIDEO_MIME_TYPE;
  }
  return {};
};

// todo : transformations
const checkFile = (fileType) => {
  return expressAsyncHandler(async (req, res, next) => {
    const { file = null, query } = req;
    // const { folderName, fileType } = storageOptions;

    if (query.fileFields === "none") {
      return next();
    }

    const expectedMimeTypes = giveExpectedMimeTypes(fileType);

    const header = file.buffer.slice(0, 8);

    const [mimetype] = filetypemime(header);

    const fileExtension = expectedMimeTypes[mimetype];

    if (!isString(fileExtension)) {
      return next(new CustomErrorClass("01000"));
    }

    file.extension = fileExtension;

    return next();
  });
};

module.exports = checkFile;
