const asyncError = require("express-async-handler");
const User = require("../../models/Users");
const {
  searchHelper,

  paginationHelper,
} = require("./queryMiddlewareHelpers/queryMiddlewareHelpers");

const userQueryMiddleware = function (model, options) {
  return asyncError(async (req, res, next) => {
    let query = model.find();
    query = searchHelper("name", query, req);
    const total = await model.countDocuments();
    const paginationResult = await paginationHelper(total, query, req);
    query = paginationResult.query;
    pagination = paginationResult.pagination;
    const queryResults = await query.find();
    res.queryResults = {
      success: true,
      count: queryResults.length,
      pagination: pagination,
      data: queryResults,
    };

    next();
  });
};
module.exports = { userQueryMiddleware };
