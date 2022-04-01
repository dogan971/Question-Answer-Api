const express = require("express");
const router = express.Router();
const { getSingleUser, getAllUsers } = require("../controllers/users");
const {
  checkUserExist,
} = require("../middleware/database/dataBaseErrorHelpers");
const {
  userQueryMiddleware,
} = require("../middleware/query/userQueryMiddleware");
const Users = require("../models/Users");
router.get("/:id", checkUserExist, getSingleUser);
router.get("/", userQueryMiddleware(Users), getAllUsers);

module.exports = router;
