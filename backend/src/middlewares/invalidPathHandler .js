const invalidPathHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    errorObj: {
      type: "error",
      message: "notFound",
      code: "00001",
      errors: null,
      infoData: null,
    },
  });
};

module.exports = invalidPathHandler;
