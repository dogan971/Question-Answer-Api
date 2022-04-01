const User = require("../models/Users");
const customError = require("../helpers/error/CustomError");
const asyncError = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const {
  validateUserInput,
  comparePassword,
} = require("../helpers/input/inputHelpers");
const CustomError = require("../helpers/error/CustomError");
const sendEmail = require("../helpers/libraries/sendEmail");
const registerAuth = asyncError(async (req, res, next) => {
  // Post data
  const { name, email, password, role } = req.body;

  // async await
  const user = await User.create({
    // isimleri aynı olduğu için ES6 standartlarında password : password olarak vermeye gerek yok
    name,
    email,
    password,
    role,
  });
});

const getUser = (req, res, next) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
    },
  });
};

const loginAuth = asyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!validateUserInput(email, password)) {
    return next(new CustomError("Please check your input"), 400);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!comparePassword(password, user.password)) {
    return next(new customError("Please check your credentials", 400));
  }
  sendJwtToClient(user, res);
});

const logout = asyncError(async (req, res, next) => {
  const { NODE_ENV } = process.env;
  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout Successfull",
    });
});

const imageUpload = asyncError(async (req, res, next) => {
  //Image upload Success
  const user = await User.findById(
    req.user.id,
    {
      profile_image: req.savedProfileImage,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Image Upload Successfull",
    data: user,
  });
});

const forgotPassword = asyncError(async (req, res, next) => {
  const resetEmail = req.body.email;
  const user = await User.findOne({ email: resetEmail });
  if (!user) {
    return next(new CustomError("There is no user with that email", 400));
  }
  const resetPasswordToken = user.getResetPasswordTokenFromUser();
  await user.save();
  const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
  const emailTemplate = `<h3>Reset Your Password</h3>
                         <p>This <a href = '${resetPasswordUrl}' target='_blank'>link</a> will expire in 1 hour</p>`;
  try {
    await sendEmail({
      from: process.env.SMTP_USER,
      to: resetEmail,
      subject: "Reset your password",
      html: emailTemplate,
    });
    return res.status(200).json({
      success: true,
      message: "Token sent to your email",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new CustomError("Email Could Not Be Sent", 500));
  }
});

const resetPassword = asyncError(async (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const { password } = req.body;
  if (!resetPasswordToken) {
    return next(new CustomError("Please Provide a valid token"), 400);
  }
  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new CustomError("Invalid token or Session Expired", 404));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "Reset Password Process Succesfull",
  });
});
const editDetails = asyncError(async (req, res, next) => {
  const editInformation = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    data: user,
  });
});
module.exports = {
  registerAuth,
  getUser,
  loginAuth,
  logout,
  imageUpload,
  forgotPassword,
  resetPassword,
  editDetails,
};
