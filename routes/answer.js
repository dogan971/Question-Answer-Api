const express = require("express");
const {
  getAccessToRoute,
  getAnswerOwnerAccess,
} = require("../middleware/authorization/auth");
const {
  checkQuestionAndAnswerExist,
} = require("../middleware/database/dataBaseErrorHelpers");
const {
  addNewAnswerToQuestion,
  getAllAnswers,
  getSingleAnswer,
  updateAnswer,
  deleteAnswer,
  likeAnswer,
  undolikeAnswer,
} = require("../controllers/answer");
const router = express.Router({ mergeParams: true });

router.post("/", getAccessToRoute, addNewAnswerToQuestion);
router.get("/", getAllAnswers);
router.get("/:answer_id", checkQuestionAndAnswerExist, getSingleAnswer);
router.put(
  "/:answer_id/edit",
  [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess],
  updateAnswer
);
router.delete(
  "/:answer_id/delete",
  [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess],
  deleteAnswer
);
router.get(
  "/:answer_id/like",
  [checkQuestionAndAnswerExist, getAccessToRoute],
  likeAnswer
);
router.get(
  "/:answer_id/undo_like",
  [checkQuestionAndAnswerExist, getAccessToRoute],
  undolikeAnswer
);

module.exports = router;
