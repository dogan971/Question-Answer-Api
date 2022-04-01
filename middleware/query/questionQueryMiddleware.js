const asyncError = require("express-async-handler");
const Question = require("../../models/Question");
const {
  searchHelper,
  populateHelper,
  querySortHelper,
  paginationHelper,
} = require("./queryMiddlewareHelpers/queryMiddlewareHelpers");
const questionQueryMiddleware = function (model, options) {
  return asyncError(async (req, res, next) => {
    let query = model.find();

    query = searchHelper("title", query, req);
    if (options && options.population) {
      query = populateHelper(query, options.population);
    }
    query = querySortHelper(query, req);
    const total = await model.countDocuments();
    const paginationResult = await paginationHelper(total, query, req);
    query = paginationResult.query;
    const pagination = paginationResult.pagination;
    const queryResult = await query;
    res.queryResults = {
      success: true,
      count: queryResult.length,
      pagination: pagination,
      data: queryResult,
    };
    next();
  });
};
module.exports = questionQueryMiddleware;
