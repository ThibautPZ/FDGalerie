const path = require("node:path");
const fs = require("node:fs/promises");
const async = require("async");
const expressAsyncHandler = require("express-async-handler");

const {
  isError,
  isObjectNotEmpty,
  isStringNotEmpty,
  isArrayNotEmpty,
  isFunction,
} = require("../../services/typesAndValidationChecks");
const CustomErrorClass = require("../../services/ErrorClasses");
const {
  giveSuccesfulAndFailedQueryNames,
} = require("../../helpers/dbAsyncQueriesHelper");
const { getObjectNestedValue } = require("../../services/objectFunctions");

const isFilesDataValid = (filesData) => {
  if (!isObjectNotEmpty(filesData)) {
    return false;
  }
  const { fileName, fileExtension, folderName } = filesData;
  if (
    !isObjectNotEmpty(fileName) ||
    !isObjectNotEmpty(fileExtension) ||
    !isStringNotEmpty(folderName)
  ) {
    return false;
  }
  return true;
};
const giveFileData = (fileData, request) => {
  const { folderName, fileName, fileExtension } = fileData;
  const baseName = fileName.name || getObjectNestedValue(request, fileName.key);
  const prefix = isStringNotEmpty(fileName.prefix) ? fileName.prefix : "";
  const suffix = isStringNotEmpty(fileName.suffix) ? fileName.suffix : "";
  const name = `${prefix}${baseName}${suffix}`;
  const extension =
    fileExtension.extension || getObjectNestedValue(request, fileExtension.key);

  return { folder: folderName, name, extension };
};

const deleteFileFunc = async (
  folderName,
  fileName,
  fileExtension,
  errorNumber
) => {
  const filePath = path.join(
    __dirname,
    `../../../public/${folderName}/${fileName}.${fileExtension}`
  );
  try {
    await fs.unlink(filePath);
  } catch (error) {
    const err = new CustomErrorClass(errorNumber, error);
    return err;
  }
  return true;
};

const deleteFiles = (filesData, isDeleteOkCb, errorNumber) => {
  return expressAsyncHandler(async (req, res, next) => {
    if (isFunction(isDeleteOkCb) && !isDeleteOkCb(req)) {
      return next();
    }

    if (isObjectNotEmpty(filesData) && isFilesDataValid(filesData)) {
      const { folder, name, extension } = giveFileData(filesData, req);

      const retryableDeleteFile = async.retryable(5, async () =>
        deleteFileFunc(folder, name, extension, errorNumber)
      );

      const result = await retryableDeleteFile();
      if (isError(result)) {
        return next(result);
      }

      return next();
    }

    if (isArrayNotEmpty(filesData)) {
      const originalFilesData = {};
      const originalFilesQueries = {};
      const deleteQueries = {};
      filesData.forEach((fileData) => {
        if (isFilesDataValid(fileData)) {
          const { folder, name, extension } = giveFileData(fileData, req);

          const filePath = path.join(
            __dirname,
            `../../../public/${folder}/${name}.${extension}`
          );

          deleteQueries[name] = async.retryable(5, async () =>
            deleteFileFunc(folder, name, extension, errorNumber)
          );

          originalFilesData[name] = {
            filePath,
          };

          originalFilesQueries[name] = async.retryable(5, async () =>
            fs.readFile(filePath)
          );
        }
      });
      if (!isObjectNotEmpty(deleteQueries)) {
        return next(new CustomErrorClass(errorNumber));
      }

      const buffers = await async.parallel(originalFilesQueries);

      for (const [name, buffer] of Object.entries(buffers)) {
        if (isError(buffer)) {
          return next(new CustomErrorClass("03002", buffer));
        }

        originalFilesData[name].buffer = buffer;
      }

      const results = await async.parallel(deleteQueries);

      const { success, failures } = giveSuccesfulAndFailedQueryNames(
        results,
        true,
        false
      );

      if (!failures.length) {
        return next();
      }

      if (!success.length) {
        return next(new CustomErrorClass(errorNumber, failures));
      }

      if (success.length === 1) {
        const { filePath, buffer } = results[success[0]];
        const rewrite = async.retryable(5, async () =>
          fs.writeFile(filePath, buffer)
        );
        const result = await rewrite();
        if (isError(result)) {
          return next(new CustomErrorClass("03002", result));
        }
        return next(results[failures[0]]);
      }

      const rewriteQueries = {};
      failures.forEach((failure) => {
        const { filePath, buffer } = results[failure];
        rewriteQueries[failure] = async.retryable(5, async () =>
          fs.writeFile(filePath, buffer)
        );
      });
      const rewriteResults = await async.parallel(rewriteQueries);
      const { failures: rewriteFailures } = giveSuccesfulAndFailedQueryNames(
        rewriteResults,
        true,
        false
      );
      if (rewriteFailures.length) {
        return next(new CustomErrorClass("03001", rewriteFailures));
      }
      return next(new CustomErrorClass("03002", failures));
    }
    return next(new CustomErrorClass(errorNumber));
  });
};

module.exports = deleteFiles;
