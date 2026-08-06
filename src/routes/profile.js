const express = require("express");
const userAuth = require("../middlewares/auth");
const {
  getUserProfile,
  updateUserData,
  updatePassword,
} = require("../controllers/profile");

const profileRouter = express.Router();

// API - GET User Profile
profileRouter.get("/", userAuth, getUserProfile);

// API - updateUserData
profileRouter.patch("/edit", userAuth, updateUserData);

// API - Update Password
profileRouter.patch("/updatePassword", userAuth, updatePassword);

module.exports = profileRouter;
