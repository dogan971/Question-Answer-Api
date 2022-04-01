const User = require("../models/Users");
const customError = require("../helpers/error/CustomError");
const asyncError = require("express-async-handler");

const getSingleUser = asyncError(async (req, res, next) => {
  // const { id } = req.params;

  // const user = await User.findById(id);

  return res.status(200).json({
    success: true,
    message: "Succesful",
    data: req.data,
  });
});

const getAllUsers = asyncError(async (req, res, next) => {
  return res.status(200).json(res.queryResults);
});

module.exports = {
  getSingleUser,
  getAllUsers,
};
