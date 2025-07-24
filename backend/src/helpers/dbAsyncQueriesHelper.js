const async = require("async");

const tables = require("../tables");
const {
  isPositiveNumber,
  isObjectNotEmpty,
  isError,
} = require("../services/typesAndValidationChecks");
const specs = require("../json/dbQuerySpecs.json");

/**
 * The function `giveDbQueriesSpecs` takes in an array of query objects and returns an array of query
 * specifications based on the provided query names and arguments.
 * @param {Array.<{name: string, queryArgs: [Array]}>} queries - The `giveDbQueriesSpecs` function takes in an array of objects representing database
 * queries. Each object should have a `name` property indicating the query name and a `queryArgs`
 * property containing the arguments for the query.
 * @returns {Array.<{name: string, manager: string, method: string, queryArgs: Array}>} An array of objects containing the specifications for the database queries specified in the
 * input arguments. Each object includes the name of the query, the query arguments, and additional
 * specifications retrieved from the `specs` object based on the query name.
 */
const giveDbQueriesSpecs = (queries) => {
  return queries.map(({ name, queryArgs }) => {
    return { ...specs[name], name, queryArgs };
  });
};

/**
 * The function `giveDbQueriesSpecsToUndoSuccess` filters database queries based on successful queries
 * and returns their corresponding specifications to undo these queries.
 * @param {Array.<{name: string, undoQueryArgs: Array}>} allQueries - Array of objects containing name and undoQueryArgs for all concerned queries
 * @param {string[]} success - Array of successful queries names
 * @returns {Array.<{name: string, manager: string, method: string, queryArgs: Array}>} An array of objects containing the specifications for the database queries specified in the
 * input arguments. Each object includes the name of the query, the query arguments, and additional
 * specifications retrieved from the `specs` object based on the query name.
 */
const giveDbQueriesSpecsToUndoSuccess = (allQueries, success) => {
  const queriesArr = [];
  allQueries.forEach(({ name, undoQueryArgs }) => {
    if (success.some((successQueryName) => successQueryName === name)) {
      const { manager, undo } = specs[name];
      queriesArr.push({
        name,
        manager,
        method: undo,
        queryArgs: undoQueryArgs,
      });
    }
  });
  return queriesArr;
};

/**
 * The function `giveDbQueryUndoSpecs` takes a query specification object containing name and undoQueryArgs as input and returns an
 * object containing the necessary information to undo the query.
 * @param {Object.<{name: string, undoQueryArgs: Array}>} querySpecs - The `querySpecs` parameter is an object containing the following properties:
 * @returns {Object.<{name: string, manager: string, method: string, queryArgs: Array}>} An object is being returned with the properties `name`, `manager`, `method`, and
 * `queryArgs`.
 */
const giveDbQueryUndoSpecs = (querySpecs) => {
  const { name, undoQueryArgs } = querySpecs;
  const { manager, undo } = specs[name];
  return {
    name,
    manager,
    method: undo,
    queryArgs: undoQueryArgs,
  };
};

/**
 * The function `giveSuccesfulAndFailedQueryNames` categorizes query names based on query results and
 * specified failure conditions.
 * @param {object} queriesResults - `queriesResults` is an object containing the results of multiple queries.
 * Each key-value pair in the object represents a query name and its corresponding result.
 * @param {boolean} [isErrorFailure=true] - The `isErrorFailure` parameter is a boolean flag that determines
 * whether queries with error results should be considered failures. If set to `true`, queries with
 * error results will be classified as failures.
 * @param {boolean} [isUnaffectedRowsFailure=false] - The `isUnaffectedRowsFailure` parameter in the
 * `giveSuccesfulAndFailedQueryNames` function is a boolean flag that determines whether queries with
 * no affected rows should be considered failures. If `isUnaffectedRowsFailure` is set to `true`,
 * queries that do not have any
 * @returns {{success: string[], failures: string[]}} The function `giveSuccesfulAndFailedQueryNames` returns an object with two properties:
 * `success` and `failures`. The `success` property contains an array of query names for successful
 * queries, while the `failures` property contains an array of query names for failed queries based on
 * the conditions specified in the function parameters.
 */
const giveSuccesfulAndFailedQueryNames = (
  queriesResults,
  isErrorFailure = true,
  isUnaffectedRowsFailure = false
) => {
  const success = [];
  const failures = [];
  for (const [queryName, result] of Object.entries(queriesResults)) {
    if (
      (isError(result) && isErrorFailure) ||
      (!result?.affectedRows && isUnaffectedRowsFailure)
    ) {
      failures.push(queryName);
    } else {
      success.push(queryName);
    }
  }
  return { success, failures };
};

/**
 * @function giveParallelQueriesPromise function `giveParallelQueriesPromise` creates and executes multiple asynchronous functions in parallel
 * based on the provided specifications and retry options.
 * @param {Array.<{name: string, manager: string, method: string, queryArgs: Array}>} queriesSpecs - The `queriesSpecs` parameter is an array of objects, where each object
 * contains the following properties:
 * @param {number|Object} [retryOptions] - The `retryOptions` parameter in the `giveParallelQueriesPromise` function is used to
 * specify options for retrying failed asynchronous operations. It can be a positive number indicating
 * the number of retries, or an object containing retry configuration options. If `retryOptions` is
 * provided and meets the conditions specified in
 * @returns {Promise} The `giveParallelQueriesPromise` function returns a Promise that resolves to an object containing
 * the results of running multiple asynchronous functions in parallel. The keys of the object
 * correspond to the names specified in the `queriesSpecs` array, and the values are the results of
 * the corresponding asynchronous functions.
 */
const giveParallelQueriesPromise = async (queriesSpecs, retryOptions) => {
  const queryPromises = {};

  queriesSpecs.forEach(({ name, manager, method, queryArgs }) => {
    const asyncFunc = async () => {
      try {
        const [result] = await tables[manager][method](...queryArgs);
        return result;
      } catch (error) {
        return error;
      }
    };
    if (isPositiveNumber(retryOptions) || isObjectNotEmpty(retryOptions)) {
      Object.assign(queryPromises, {
        [name]: async.retryable(retryOptions, asyncFunc),
      });
    } else {
      Object.assign(queryPromises, {
        [name]: asyncFunc,
      });
    }
  });

  return async.parallel(queryPromises);
};

/**
 * The function `giveQueryPromise` executes a query using specified parameters and retry options if
 * provided.
 * @param {object} queriesSpecs - The `querySpecs` parameter is an object containing the following properties:
 * @param {string} queriesSpecs.name - name to uniquely identify query
 * @param {string} queriesSpecs.manager - manager name to call from tables
 * @param {string} queriesSpecs.method - method name to call from manager
 * @param {Array} queriesSpecs.queryArgs - arguments provided for method call
 * @param {number|Object} [retryOptions] - RetryOptions is an object that contains options for retrying the query in case
 * of failure. It can include parameters like the number of retries, delay between retries, and other
 * options to control the retry behavior.
 * @returns {Promise} The `giveQueryPromise` function returns a promise. If the `retryOptions` parameter is a
 * positive number or an object that is not empty, it will return a retryable version of the async
 * function `asyncFunc` using `async.retryable`. Otherwise, it will return the original async function
 * `asyncFunc`.
 */
const giveQueryPromise = (querySpecs, retryOptions) => {
  const { manager, method, queryArgs } = querySpecs;

  const asyncFunc = async () => {
    try {
      const [result] = await tables[manager][method](...queryArgs);
      return result;
    } catch (error) {
      return error;
    }
  };
  if (isPositiveNumber(retryOptions) || isObjectNotEmpty(retryOptions)) {
    return async.retryable(retryOptions, asyncFunc)();
  }
  return asyncFunc();
};

module.exports = {
  giveDbQueriesSpecs,
  giveDbQueriesSpecsToUndoSuccess,
  giveDbQueryUndoSpecs,
  giveSuccesfulAndFailedQueryNames,
  giveParallelQueriesPromise,
  giveQueryPromise,
};
