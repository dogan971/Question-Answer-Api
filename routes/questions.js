const express = require("express");
const {
  askNewQuestion,
  getAllQuestion,
  getquestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undolikeQuestion,
} = require("../controllers/questions");
const {
  getAccessToRoute,
  getQuestionOwner,
} = require("../middleware/authorization/auth");
const {
  checkQuestionExist,
} = require("../middleware/database/dataBaseErrorHelpers");
const answer = require("./answer");
const questionQueryMiddleware = require("../middleware/query/questionQueryMiddleware");
const {
  answerQueryMiddleware,
} = require("../middleware/query/answerQueryMiddleware");
const Question = require("../models/Question");
const router = express.Router();

router.post("/ask", getAccessToRoute, askNewQuestion);
router.get(
  "/getallquestion",
  questionQueryMiddleware(Question, {
    population: {
      path: "user",
      select: "name profile_image",
    },
  }),
  getAllQuestion
);
router.get(
  "/:id",
  checkQuestionExist,
  answerQueryMiddleware(Question, {
    population: [
      {
        path: "user",
        select: "name profile_image",
      },
      {
        path: "answers",
        select: "content",
      },
    ],
  }),
  getquestion
);
router.put(
  "/:id/edit",
  [getAccessToRoute, checkQuestionExist, getQuestionOwner],
  editQuestion
);
router.delete(
  "/:id/delete",
  [getAccessToRoute, checkQuestionExist, getQuestionOwner],
  deleteQuestion
);
router.get("/:id/like", [getAccessToRoute, checkQuestionExist], likeQuestion);
router.get(
  "/:id/undolike",
  [getAccessToRoute, checkQuestionExist],
  undolikeQuestion
);
router.use("/:question_id/answer", checkQuestionExist, answer);
module.exports = router;
