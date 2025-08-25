const asyncHandler = require("express-async-handler");

const CustomErrorClass = require("../../services/ErrorClasses");

const {
  isArrayNotEmpty,
  isObjectNotEmpty,
  isError,
} = require("../../services/typesAndValidationChecks");
const {
  giveQueryPromise,
  giveParallelQueriesPromise,
} = require("../../helpers/dbAsyncQueriesHelper");

const giveParams = (
  reqBody,
  reqParams,
  bodyKeyParams,
  reqParamsKeyParams,
  addedParams
) => {
  const params = {};
  if (isObjectNotEmpty(bodyKeyParams)) {
    for (const [param, bodyKey] of Object.entries(bodyKeyParams)) {
      params[param] = reqBody[bodyKey];
    }
  }
  if (isObjectNotEmpty(reqParamsKeyParams)) {
    for (const [param, value] of Object.entries(reqParamsKeyParams)) {
      params[param] = reqParams[value];
    }
  }
  if (isObjectNotEmpty(addedParams)) {
    for (const [param, value] of Object.entries(addedParams)) {
      params[param] = value;
    }
  }
  return params;
};

const giveParamCount = (reqBody, param) => {
  return reqBody[param].length || 0;
};

const checkPresenceInDb = (...options) => {
  return asyncHandler(async (req, res, next) => {
    if (!isArrayNotEmpty(options)) {
      const err = new CustomErrorClass("00004");
      return next(err);
    }

    if (options.length === 1) {
      const {
        manager,
        method,
        bodyKeyParams,
        reqParamsKeyParams,
        addedParams,
        errorNumber,
        rejectWhenTrue = false,
        count,
      } = options[0];

      if (!manager || !method) {
        const err = new CustomErrorClass("00004");
        return next(err);
      }

      const params = giveParams(
        req.body,
        req.params,
        bodyKeyParams,
        reqParamsKeyParams,
        addedParams
      );

      const result = await giveQueryPromise(
        { name: `${manager}${method}`, manager, method, queryArgs: [params] },
        5
      );

      let doesExist = result.length > 0;

      if (count) {
        const { param, value } = count;
        const expectedCount = value || giveParamCount(req.body, param);
        doesExist = result === expectedCount;
      }

      if (doesExist === rejectWhenTrue) {
        const err = new CustomErrorClass(errorNumber);
        return next(err);
      }
      return next();
    }

    const errorConditions = {};
    const queriesSpecs = options.map((option) => {
      const {
        manager,
        method,
        bodyKeyParams,
        reqParamsKeyParams,
        addedParams,
        errorNumber,
        rejectWhenTrue = false,
        count,
      } = option;

      if (!manager || !method) {
        const err = new CustomErrorClass("00004");
        return next(err);
      }
      const name = `${manager}${method}`;
      const conditions = {
        errorNumber,
        rejectWhenTrue,
      };
      if (count) {
        Object.assign(conditions, { count });
      }

      Object.assign(errorConditions, {
        [name]: conditions,
      });
      const params = giveParams(
        req.body,
        req.params,
        bodyKeyParams,
        reqParamsKeyParams,
        addedParams
      );

      return {
        name: `${manager}${method}`,
        manager,
        method,
        queryArgs: [params],
      };
    });

    const results = await giveParallelQueriesPromise(queriesSpecs, 5);

    const errors = [];
    for (const [name, result] of Object.entries(results)) {
      const { errorNumber, rejectWhenTrue, count } = errorConditions[name];

      if (isError(result)) {
        errors.push(result);
      } else {
        let doesExist = result.length > 0;

        if (count) {
          const resCount = Object.values(result[0])[0] || 0;
          const { param, value } = count;
          const expectedCount = value ?? giveParamCount(req.body, param);
          doesExist = resCount === expectedCount;
        }

        if (doesExist === rejectWhenTrue) {
          errors.push(new CustomErrorClass(errorNumber));
        }
      }
    }

    if (errors.length === 1) {
      return next(errors[0]);
    }

    if (errors.length) {
      const err = new CustomErrorClass("01001", errors);
      return next(err);
    }

    return next();
  });
};

module.exports = checkPresenceInDb;
