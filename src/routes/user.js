const express = require("express");
const userAuth = require("../middlewares/auth");
const {
  getAllPendingConnections,
  userConnections,
  feedAPI,
} = require("../controllers/user");

const userRouter = express.Router();

const USER_SAFE_DATA =
  "firstName lastName age gender profileImage about skills";

// API - GET All Pending Connection
userRouter.get("/user/requests/received", userAuth, getAllPendingConnections);

// API - Connections
userRouter.get("/user/connections", userAuth, userConnections);

// API - Feed API
userRouter.get("/feed", userAuth, feedAPI);

module.exports = userRouter;
