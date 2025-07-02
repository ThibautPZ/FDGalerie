const path = require("node:path");
const { nanoid } = require("nanoid");

const multer = require("multer");

const singleFileUpload = (options) => {
  const { folderName, fileFormFieldName, fileType } = options;
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

  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.join(__dirname, `../../public/${folderName}`));
    },
    filename: (req, file, callback) => {
      const savedFileName = nanoid(16);
      let fileExtension = "";

      if (fileType === "image") {
        fileExtension = IMAGE_MIME_TYPE[file.mimetype];
      }
      if (fileType === "video") {
        fileExtension = VIDEO_MIME_TYPE[file.mimetype];
      }

      callback(null, `${savedFileName}.${fileExtension}`);
    },
  });

  return multer({ storage }).single(fileFormFieldName);
};

module.exports = singleFileUpload;
