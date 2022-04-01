const Question = require("../models/Question");
const customError = require("../helpers/error/CustomError");
const asyncError = require("express-async-handler");
const askNewQuestion = asyncError(async (req, res, next) => {
  const information = req.body;
  const question = await Question.create({
    ...information,
    user: req.user.id,
  });
  return res.status(200).json({
    success: true,
    data: question,
  });
});
const getAllQuestion = asyncError(async (req, res, next) => {
  return res.status(200).json(res.queryResults);
});

const getquestion = asyncError(async (req, res, next) => {
  return res.status(200).json(res.queryResults);
});
const editQuestion = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  let question = await Question.findById(id);
  question.title = title;
  question.content = content;
  question = await question.save();
  return res.status(200).json({
    success: true,
    data: question,
  });
});
const deleteQuestion = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const question = await Question.findById(id);
  await question.remove();
  return res.status(200).json({
    success: true,
    message: "Successfull",
  });
});
const likeQuestion = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const question = await Question.findById(id);
  // Like etmişse
  if (question.likes.includes(req.user.id)) {
    return next(new customError("You already liked this question", 400));
  }
  question.likes.push(req.user.id);
  question.likeCount = question.likes.length;
  await question.save();
  return res.status(200).json({
    success: true,
    data: question,
  });
});
const undolikeQuestion = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const question = await Question.findById(id);
  if (!question.likes.includes(req.user.id)) {
    return next(new customError("you can not undo like  operation", 400));
  }
  const index = question.likes.indexOf(req.user.id);
  question.likes.splice(index, 1);
  question.likeCount = question.likes.length;

  await question.save();
  return res.status(200).json({
    success: true,
    data: question,
  });
});
module.exports = {
  askNewQuestion,
  getAllQuestion,
  getquestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undolikeQuestion,
};
