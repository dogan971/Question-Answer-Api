const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const asyncError = require("express-async-handler");
const Question = require("../../models/Question");
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require("../../helpers/authorization/tokenHelpers");
const Users = require("../../models/Users");
const Answer = require("../../models/Answer");
const getAccessToRoute = (req, res, next) => {
  // Token
  const { JWT_SECRET_KEY } = process.env;
  if (!isTokenIncluded(req)) {
    // 401 , 403
    // 401:Unauthorized
    // 403:Forbidden
    return next(
      new CustomError("You are not authorized to access this route"),
      401
    );
  }
  const accesstoken = getAccessTokenFromHeader(req);
  jwt.verify(accesstoken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(
        new CustomError("You are not authorized to access this route", 401)
      );
    }
    req.user = {
      id: decoded.id,
      name: decoded.name,
    };
    next();
  });
};

const getAdminAccess = asyncError(async (req, res, next) => {
  const { id } = req.user;
  const user = await Users.findById(id);
  if (user.role !== "admin") {
    return next(new CustomError("Only Admins Can Access This Route"), 403);
  }
  next();
});

const getQuestionOwner = asyncError(async (req, res, next) => {
  const userId = req.user.id;
  const questionId = req.params.id;
  const question = await Question.findById(questionId);
  if (question.user != userId) {
    return next(new CustomError("Only Owner Can Handle This Operation", 403));
  }
  next();
});
const getAnswerOwnerAccess = asyncError(async (req, res, next) => {
  const userId = req.user.id;
  const answerId = req.params.answer_id;
  const answer = await Answer.findById(answerId);
  if (answer.user != userId) {
    return next(new CustomError("Only Owner Can Handle This Operation", 403));
  }
  next();
});

module.exports = {
  getAccessToRoute,
  getAdminAccess,
  getQuestionOwner,
  getAnswerOwnerAccess,
};
