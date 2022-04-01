const User = require("../models/Users");
const asyncError = require("express-async-handler");
const express = require("express");
const customError = require("../middleware/errors/customError");

const blockUser = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  user.blocked = !user.blocked;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "Block - Unblock Successfull",
  });
});
const deleteUser = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  await user.remove();

  return res.status(200).json({
    success: true,
    message: "Delete operation successfull",
  });
});
module.exports = { blockUser, deleteUser };
