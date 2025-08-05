const multer = require("multer");

// todo : transformations
const multerInstance = (limitsOptions) => {
  const storage = multer.memoryStorage();

  const limits = {
    fileSize: limitsOptions.fileSize || 50 * 1000 * 1000, // 50 MB
    files: 1,
  };

  return multer({
    storage,
    limits,
  });
};

module.exports = multerInstance;
