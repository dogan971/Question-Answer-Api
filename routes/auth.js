const express = require("express");
const {
  registerAuth,
  getUser,
  loginAuth,
  logout,
  imageUpload,
  forgotPassword,
  resetPassword,
  editDetails,
} = require("../controllers/auth");
const { getAccessToRoute } = require("../middleware/authorization/auth");
const profileImageUpload = require("../middleware/libraries/profileImageUploads");
const router = express.Router();

router.post("/register", registerAuth);
router.get("/profile", getAccessToRoute, getUser);
router.post("/login", loginAuth);
router.get("/logout", getAccessToRoute, logout);
router.post(
  "/upload",
  [getAccessToRoute, profileImageUpload.single("image")],
  imageUpload
);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.put("/edit/:id", getAccessToRoute, editDetails);
module.exports = router;
