const User = require("../../models/Users");
const Question = require("../../models/Question");
const asyncError = require("express-async-handler");
const customError = require("../../helpers/error/CustomError");
const Answer = require("../../models/Answer");

const checkUserExist = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new customError("There is no such user with that id", 400));
  }
  req.data = user;
  next();
});

const checkQuestionExist = asyncError(async (req, res, next) => {
  const question_id = req.params.id || req.params.question_id;
  const question = await Question.findById(question_id);
  if (!question) {
    return next(new customError("There is no such user with that id", 400));
  }
  req.data = question;
  next();
});

const checkQuestionAndAnswerExist = asyncError(async (req, res, next) => {
  const question_id = req.params.question_id;
  const answer_id = req.params.answer_id;
  const answer = await Answer.findOne({
    _id: answer_id,
    question: question_id,
  });
  if (!answer) {
    return next(
      new customError(
        "There is no answer with that id associated with question id",
        400
      )
    );
  }

  next();
});

module.exports = {
  checkUserExist,
  checkQuestionExist,
  checkQuestionAndAnswerExist,
};
