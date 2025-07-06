const path = require("node:path");
const { nanoid } = require("nanoid");
const multer = require("multer");
const schemaValidationErrors = require("../services/expressValidator");
const CustomErrorClass = require("../services/ErrorClasses");
const { isArrayNotEmpty } = require("../services/typesAndValidationChecks");
const { giveErrorInstances } = require("../services/arrayFunctions");

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
// todo : transformations
const multerInstance = (
  storageOptions,
  limitsOptions,
  validationSchema,
  validationFunctionsArr
) => {
  const { folderName, fileType } = storageOptions;

  const savedFileName = nanoid(16);

  let savedFileExtension = "";

  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.join(__dirname, `../../public/${folderName}`));
    },
    filename: (req, file, callback) => {
      if (fileType === "image") {
        savedFileExtension = IMAGE_MIME_TYPE[file.mimetype];
      }
      if (fileType === "video") {
        savedFileExtension = VIDEO_MIME_TYPE[file.mimetype];
      }
      req.body.rawFileName = savedFileName;
      req.body.rawFileExtension = savedFileExtension;

      callback(null, `${savedFileName}.${savedFileExtension}`);
    },
  });

  const limits = {
    fileSize: limitsOptions.fileSize || 50 * 1000 * 1000, // 50 MB
    files: 1,
  };

  const fileFilter = async (req, file, callback) => {
    const reqBody = JSON.parse(JSON.stringify(req.body));
    req.body = reqBody;

    let schemaErrors = null;
    if (validationSchema) {
      schemaErrors = await schemaValidationErrors(validationSchema, req);
    }
    if (schemaErrors) {
      callback(schemaErrors, false);
    }

    // Check if the file is an image with the allowed extensions
    const fileExtension = path
      .extname(file.originalname)
      .toLowerCase()
      .replace(".", "");

    const fileMimeType = file.mimetype;

    let matchingExtension = "";
    if (fileType === "image") {
      matchingExtension = IMAGE_MIME_TYPE[fileMimeType] === fileExtension;
    }
    if (fileType === "video") {
      matchingExtension = VIDEO_MIME_TYPE[fileExtension] === fileExtension;
    }

    if (!matchingExtension) {
      callback(new CustomErrorClass("01000"), false);
    }

    if (isArrayNotEmpty(validationFunctionsArr)) {
      const promisesArr = validationFunctionsArr.map((validationFunction) =>
        validationFunction(req)
      );
      const validationsResultsArr = await Promise.all(promisesArr);
      const errorsArr = giveErrorInstances(validationsResultsArr);
      if (isArrayNotEmpty(errorsArr)) {
        const validationsErr = new CustomErrorClass("00005", errorsArr);
        return callback(validationsErr, false);
      }
    }

    return callback(null, true);
  };

  return multer({
    storage,
    limits,
    fileFilter,
  });
};

module.exports = multerInstance;
