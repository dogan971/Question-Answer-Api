const asyncError = require("express-async-handler");
const customError = require("../helpers/error/CustomError");
const Answer = require("../models/Answer");
const Question = require("../models/Question");
const addNewAnswerToQuestion = asyncError(async (req, res, next) => {
  const { question_id } = req.params;
  const user_id = req.user.id;
  const information = req.body;
  const answer = await Answer.create({
    ...information,
    question: question_id,
    user: user_id,
  });
  return res.status(200).json({
    success: true,
    data: answer,
  });
});
const getAllAnswers = asyncError(async (req, res, next) => {
  const { question_id } = req.params;
  const question = await Question.findById(question_id).populate("answers");
  const answer = question.answers;
  return res.status(200).json({
    success: true,
    count: answer.length,
    data: answer,
  });
});
const getSingleAnswer = asyncError(async (req, res, next) => {
  const { answer_id } = req.params;
  const answer = await Answer.findById(answer_id)
    .populate({
      path: "question",
      select: "title",
    })
    .populate({
      path: "user",
      select: "name profile_image",
    });
  return res.status(200).json({
    success: true,
    data: answer,
  });
});
const updateAnswer = asyncError(async (req, res, next) => {
  const { answer_id } = req.params;
  const { content } = req.body;
  let answer = await Answer.findById(answer_id);
  answer.content = content;
  await answer.save();
  return res.status(200).json({
    success: true,
    data: answer,
  });
});
const deleteAnswer = asyncError(async (req, res, next) => {
  const { answer_id } = req.params;
  const { question_id } = req.params;
  await Answer.findByIdAndRemove(answer_id);
  const question = await Question.findById(question_id);
  question.answers.splice(question.answers.indexOf(answer_id, 1));
  question.answerCount = question.answers.length;
  await question.save();
  return res.status(200).json({
    success: true,
    message: "Answer Deleted Successfully",
  });
});

const likeAnswer = asyncError(async (req, res, next) => {
  const { answer_id } = req.params;
  const answer = await Answer.findById(answer_id);
  // Like etmişse
  if (answer.likes.includes(req.user.id)) {
    return next(new customError("You already liked this answer", 400));
  }
  answer.likes.push(req.user.id);
  await answer.save();
  return res.status(200).json({
    success: true,
    data: answer,
  });
});
const undolikeAnswer = asyncError(async (req, res, next) => {
  const { answer_id } = req.params;
  const answer = await answer.findById(answer_id);
  if (!answer.likes.includes(req.user.id)) {
    return next(new customError("you can not undo like  answer", 400));
  }
  const index = answer.likes.indexOf(req.user.id);
  answer.likes.splice(index, 1);
  await answer.save();
  return res.status(200).json({
    success: true,
    data: answer,
  });
});
module.exports = {
  addNewAnswerToQuestion,
  getAllAnswers,
  getSingleAnswer,
  updateAnswer,
  deleteAnswer,
  likeAnswer,
  undolikeAnswer,
};
